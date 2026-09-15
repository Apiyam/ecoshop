import { ProductItem } from './wooApi'

export const CHECKOUT_BASE = 'https://ecopipo.com/matriz/?redirect=ecopipo'

export const VOLUME_TIERS = [
  { min: 6, max: 9, discount: 5 },
  { min: 10, max: 14, discount: 8 },
  { min: 15, max: 19, discount: 10 },
  { min: 20, max: Infinity, discount: 12 },
] as const

export const ECOPIPO_PRINTS = [
  'Muñequitas',
  'Juguetitos',
  'Apapacho',
  'Monarca',
  'Girasoles',
  'Zarigüeya',
] as const

const PRINT_KEYS = [
  'muñequitas',
  'munequitas',
  'juguetitos',
  'apapacho',
  'monarca',
  'girasoles',
  'zarigüeya',
  'zarigueya',
]

export const PREMIUM_ESTAMPADO_PARENT = 6031
export const PREMIUM_LISO_PARENT = 5743
export const FILTRO_BEBE_ID = 4723
export const FILTRO_PARENT = 4722
export const FILTRO_PACK_QTY = 3
export const FILTRO_PACK_REGULAR = 567
export const FILTRO_PACK_PROMO = 499
export const PROMO_PANAL_PERCENT = 20
export const PROMO_PANAL_MIN = 3
export const GIFT_FILTRO_MIN = 6
export const LUBELLA_PERCENT = 15
export const LUBELLA_MIN = 5
export const LUBELLA_PARENTS = [4115, 4176, 4236, 4277]
export const LUBELLA_SIMPLE_IDS = [4272, 4273]
export const LUBELLA_PARENT_TOALLAS = [4115, 4176, 4236]
export const LUBELLA_PARENT_PANOLETA = 4277

export type BanderazoCampaign = 'banderazo-patrio-ecopipo' | 'banderazo-patrio-lubella'

export type BanderazoRole = 'promo_panal' | 'regular' | 'filtro_pack' | 'gift' | 'lubella_promo'

export type BanderazoCartLine = {
  product: ProductItem
  quantity: number
  role: BanderazoRole
}

export type BanderazoPayload = {
  campaign: BanderazoCampaign
  items: { id: number; quantity: number; role: BanderazoRole }[]
  meta: {
    promoPanalCount: number
    lubellaCount: number
    volumePieces: number
    volumeDiscount: number
    giftFiltro: boolean
    filtroPacks: number
    expectedTotal: number
  }
}

export function volumeDiscountFor(pieces: number) {
  const tier = VOLUME_TIERS.find((t) => pieces >= t.min && pieces <= t.max)
  return tier?.discount ?? 0
}

export function unitPrice(product: ProductItem) {
  return parseFloat(product.public_price || '0') || 0
}

function norm(s: string) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

export function isPromoPanal(product: ProductItem) {
  if (product.parent !== PREMIUM_ESTAMPADO_PARENT) return false
  const n = norm(product.name)
  return PRINT_KEYS.some((k) => n.includes(norm(k)))
}

export function isLubellaPromoProduct(product: ProductItem) {
  if (LUBELLA_SIMPLE_IDS.includes(product.id)) return true
  return LUBELLA_PARENTS.includes(product.parent)
}

export function lubellaGroup(product: ProductItem) {
  if (product.id === 4272 || /protector/i.test(product.name)) return 'Protectores de lactancia'
  if (product.id === 4273 || /desmaquill/i.test(product.name)) return 'Desmaquillantes'
  if (product.parent === LUBELLA_PARENT_PANOLETA || /pañoleta/i.test(product.name)) return 'Pañoletas'
  if (LUBELLA_PARENT_TOALLAS.includes(product.parent) || /toalla/i.test(product.name)) return 'Toallas'
  return 'Lubella'
}

export function getShortName(product: ProductItem) {
  let n = product.name.replace(/6 Meses - 6 Años/gi, '').trim()
  const parent = (product.parent_name || '').replace(/^Privado:\s*/i, '').trim()
  if (parent && n.toLowerCase().startsWith(parent.toLowerCase())) {
    n = n.slice(parent.length).replace(/^[\s\-–]+/, '').trim()
  }
  return n || product.name
}

export function productImage(product: ProductItem | null, fallback = '') {
  const img = product?.images
  if (!img || img === 'False' || img === 'false') return fallback
  return img
}

export function quoteEcopipo(lines: BanderazoCartLine[]) {
  const purchased = lines.filter((l) => l.role !== 'gift')
  const promoPanalCount = purchased
    .filter((l) => l.role === 'promo_panal')
    .reduce((a, l) => a + l.quantity, 0)
  const filtroPacks = purchased
    .filter((l) => l.role === 'filtro_pack')
    .reduce((a, l) => a + Math.floor(l.quantity / FILTRO_PACK_QTY), 0)
  const volumePieces = purchased.reduce((a, l) => a + l.quantity, 0)
  const volumeDiscount = volumeDiscountFor(volumePieces)
  const applyPromoPanal = promoPanalCount >= PROMO_PANAL_MIN
  const giftFiltro = promoPanalCount >= GIFT_FILTRO_MIN

  const breakdown = purchased.map((line) => {
    const price = unitPrice(line.product)
    let discount = 0
    if (line.role === 'promo_panal' && applyPromoPanal) discount = PROMO_PANAL_PERCENT
    else if (line.role === 'filtro_pack') discount = 0
    else discount = volumeDiscount
    const unit =
      line.role === 'filtro_pack'
        ? FILTRO_PACK_PROMO / FILTRO_PACK_QTY
        : price * (1 - discount / 100)
    return {
      ...line,
      list: price,
      discount,
      unit,
      subtotal: unit * line.quantity,
    }
  })

  const productsTotal = breakdown.reduce((a, l) => a + l.subtotal, 0)
  const expectedTotal = productsTotal

  return {
    promoPanalCount,
    volumePieces,
    volumeDiscount,
    applyPromoPanal,
    giftFiltro,
    filtroPacks,
    breakdown,
    expectedTotal,
  }
}

export function quoteLubella(lines: BanderazoCartLine[]) {
  const purchased = lines.filter((l) => l.role !== 'gift')
  const lubellaCount = purchased
    .filter((l) => l.role === 'lubella_promo')
    .reduce((a, l) => a + l.quantity, 0)
  const volumePieces = purchased.reduce((a, l) => a + l.quantity, 0)
  const volumeDiscount = volumeDiscountFor(volumePieces)
  const applyLubella = lubellaCount >= LUBELLA_MIN

  const breakdown = purchased.map((line) => {
    const price = unitPrice(line.product)
    let discount = 0
    if (line.role === 'lubella_promo' && applyLubella) discount = LUBELLA_PERCENT
    else discount = volumeDiscount
    const unit = price * (1 - discount / 100)
    return { ...line, list: price, discount, unit, subtotal: unit * line.quantity }
  })

  return {
    lubellaCount,
    volumePieces,
    volumeDiscount,
    applyLubella,
    breakdown,
    expectedTotal: breakdown.reduce((a, l) => a + l.subtotal, 0),
  }
}

export function buildPayload(
  campaign: BanderazoCampaign,
  lines: BanderazoCartLine[],
  giftProduct?: ProductItem | null
): BanderazoPayload {
  const items: BanderazoPayload['items'] = lines
    .filter((l) => l.quantity > 0)
    .map((l) => ({ id: l.product.id, quantity: l.quantity, role: l.role }))

  if (campaign === 'banderazo-patrio-ecopipo') {
    const q = quoteEcopipo(lines)
    if (q.giftFiltro && giftProduct) {
      items.push({ id: giftProduct.id, quantity: 1, role: 'gift' })
    }
    return {
      campaign,
      items,
      meta: {
        promoPanalCount: q.promoPanalCount,
        lubellaCount: 0,
        volumePieces: q.volumePieces,
        volumeDiscount: q.volumeDiscount,
        giftFiltro: q.giftFiltro,
        filtroPacks: q.filtroPacks,
        expectedTotal: Math.round(q.expectedTotal * 100) / 100,
      },
    }
  }

  const q = quoteLubella(lines)
  return {
    campaign,
    items,
    meta: {
      promoPanalCount: 0,
      lubellaCount: q.lubellaCount,
      volumePieces: q.volumePieces,
      volumeDiscount: q.volumeDiscount,
      giftFiltro: false,
      filtroPacks: 0,
      expectedTotal: Math.round(q.expectedTotal * 100) / 100,
    },
  }
}

export function checkoutUrl(payload: BanderazoPayload) {
  const items = payload.items.map(({ id, quantity, role }) => ({ id, quantity, role }))
  const data = encodeURIComponent(JSON.stringify(items))
  const banderazo = encodeURIComponent(JSON.stringify(payload))
  return `${CHECKOUT_BASE}&items=${data}&banderazo=${banderazo}`
}
