import type { ExpoPack } from '@/app/packs/types'

export const ANIVERSARIO_STORAGE_KEY = 'ecopipo_aniversario'
export const CHECKOUT_BASE = 'https://ecopipo.com/matriz/?redirect=ecopipo'

export const FILTRO_BEBE_ID = 4723
export const DETERGENTE_PANAL_ID = 4942
export const DESMAQUILLANTES_ID = 4273
export const DETERGENTE_LUBELLA_ID = 4275

export const PARENT = {
  LISO: 5743,
  ESTAMPADO: 6031,
  WETBAG: 3882,
  TOALLA_TEEN: 4115,
  TOALLA_REGULAR: 4176,
  TOALLA_NOCTURNA: 4236,
  PANTIPROTECTOR: 4057,
  PANTI_TANGA: 4024,
  PANOLETA: 4277,
  CALZON_LIGERO: [17201, 17217],
  CALZON_ABUNDANTE: [17211, 17219],
  CALZON_BIKINI_LIGERO: 17201,
  CALZON_BIKINI_ABUNDANTE: 17211,
  CALZON_TEEN_LIGERO: 17217,
  CALZON_TEEN_ABUNDANTE: 17219,
  CALZON_TIRO_ALTO: 25846,
} as const

export type AniversarioLine = {
  id: number
  quantity: number
  name: string
  image?: string
  role: string
}

export type AniversarioFixed = {
  id: number
  quantity: number
  name: string
}

export type AniversarioSurprise = {
  parent: number
  qty: number
  match?: string
  exclude?: string
  label: string
}

export type AniversarioInCart = {
  offerId: string
  name: string
  price: number
  was: number
  lines: AniversarioLine[]
  fixed: AniversarioFixed[]
  surprises: AniversarioSurprise[]
}

export const ANIV_ECOPIPO_PACKS: ExpoPack[] = [
  {
    id: 'pack1',
    name: 'Esencial',
    lisos: 4,
    estampados: 4,
    wetbag: 0,
    priceOriginal: 3834,
    priceDiscounted: 3200,
    color: 'green',
  },
  {
    id: 'pack2',
    name: 'Inteligente',
    lisos: 5,
    estampados: 10,
    wetbag: 1,
    priceOriginal: 7160,
    priceDiscounted: 5670,
    color: 'purple',
  },
  {
    id: 'pack3',
    name: 'Libertad',
    lisos: 8,
    estampados: 12,
    wetbag: 1,
    priceOriginal: 9397,
    priceDiscounted: 7190,
    color: 'purple',
  },
]

const GIFTS_PANAL: Record<string, number> = {
  pack1: 1,
  pack2: 2,
  pack3: 3,
}

export function money(n: number) {
  return n.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 })
}

export function groupQty(rows: { id: number; quantity: number }[]) {
  const map = new Map<number, number>()
  rows.forEach((row) => {
    if (!row.id || row.quantity < 1) return
    map.set(row.id, (map.get(row.id) || 0) + row.quantity)
  })
  return Array.from(map.entries()).map(([id, quantity]) => ({ id, quantity }))
}

export function linesFromProducts(
  products: { id: number; name: string; images?: string }[],
  role: string
): AniversarioLine[] {
  const map = new Map<number, AniversarioLine>()
  products.forEach((product) => {
    const prev = map.get(product.id)
    if (prev) prev.quantity += 1
    else {
      map.set(product.id, {
        id: product.id,
        quantity: 1,
        name: product.name,
        image: product.images || '',
        role,
      })
    }
  })
  return Array.from(map.values())
}

export function ecopipoPackCart(
  pack: ExpoPack,
  lisos: { id: number; name: string; images?: string }[],
  estampados: { id: number; name: string; images?: string }[],
  wetbag: { id: number; name: string; images?: string } | null
): AniversarioInCart {
  const lines = [
    ...linesFromProducts(lisos, 'liso'),
    ...linesFromProducts(estampados, 'estampado'),
  ]
  if (wetbag) lines.push(...linesFromProducts([wetbag], 'bolsa'))
  const gifts = GIFTS_PANAL[pack.id] || 0
  return {
    offerId: pack.id,
    name: `Aniversario · ${pack.name}`,
    price: pack.priceDiscounted,
    was: pack.priceOriginal,
    lines,
    fixed: [
      { id: FILTRO_BEBE_ID, quantity: 1, name: 'Filtro de bambú bebé' },
      { id: DETERGENTE_PANAL_ID, quantity: 1, name: 'Detergente 1 litro' },
    ],
    surprises:
      gifts > 0
        ? [
            {
              parent: PARENT.ESTAMPADO,
              qty: gifts,
              match: 'sin absorbente',
              label: `${gifts} pañal estampado sin absorbente, diseño sorpresa`,
            },
          ]
        : [],
  }
}

export function mysteryCart(): AniversarioInCart {
  return {
    offerId: 'mystery',
    name: 'Aniversario · Mystery Box 6 + 4',
    price: 2460,
    was: 3340,
    lines: [],
    fixed: [],
    surprises: [
      {
        parent: PARENT.ESTAMPADO,
        qty: 6,
        exclude: 'sin absorbente',
        label: '6 pañales premium estampados completos, diseño sorpresa',
      },
      {
        parent: PARENT.ESTAMPADO,
        qty: 4,
        match: 'sin absorbente',
        label: '4 pañales premium estampados sin absorbente, diseño sorpresa',
      },
    ],
  }
}

/** 4 filtros por el precio de 3. Vigente hasta el 2 de noviembre 2026. */
export const FILTROS_4X3 = {
  offerId: 'filtros-4x3',
  price: 567,
  was: 756,
  qty: 4,
  until: '2026-11-02',
  visible: true,
} as const

export function filtros4x3Activa(hoy = new Date()) {
  if (!FILTROS_4X3.visible) return false
  const fin = new Date(`${FILTROS_4X3.until}T23:59:59`)
  return hoy.getTime() <= fin.getTime()
}

export function filtros4x3Cart(): AniversarioInCart {
  return {
    offerId: FILTROS_4X3.offerId,
    name: 'Filtros de bambú · 4×3',
    price: FILTROS_4X3.price,
    was: FILTROS_4X3.was,
    lines: [
      {
        id: FILTRO_BEBE_ID,
        quantity: FILTROS_4X3.qty,
        name: 'Filtro de bambú bebé',
        role: 'filtro',
      },
    ],
    fixed: [],
    surprises: [],
  }
}

export function towelCart(input: {
  id: 'moderado' | 'abundante'
  withPack17: boolean
  day: { id: number; name: string; images?: string }[]
  night: { id: number; name: string; images?: string }[]
}): AniversarioInCart {
  const upgraded = input.withPack17
  const price = input.id === 'moderado' ? (upgraded ? 1967 : 1468) : upgraded ? 2021 : 1522
  const was = input.id === 'moderado' ? (upgraded ? 2420 : 1783) : upgraded ? 2474 : 1837
  const name = input.id === 'moderado' ? 'Siempre protegida · Moderado' : 'Siempre protegida · Abundante'
  const surprises: AniversarioSurprise[] = [
    { parent: PARENT.PANTIPROTECTOR, qty: upgraded ? 2 : 1, label: upgraded ? '2 pantiprotectores, diseño sorpresa' : '1 pantiprotector, diseño sorpresa' },
    { parent: PARENT.PANTI_TANGA, qty: 1, label: '1 panti ultradelgada, diseño sorpresa' },
    { parent: PARENT.PANOLETA, qty: 1, label: '1 pañoleta, diseño sorpresa' },
  ]
  if (upgraded) {
    surprises.push({ parent: PARENT.WETBAG, qty: 1, label: '1 bolsa impermeable, diseño sorpresa' })
  }
  return {
    offerId: upgraded ? `${input.id}-17` : input.id,
    name: upgraded ? `${name} + Pack 17` : name,
    price,
    was,
    lines: [...linesFromProducts(input.day, 'toalla'), ...linesFromProducts(input.night, 'toalla')],
    fixed: upgraded
      ? [
          { id: DESMAQUILLANTES_ID, quantity: 1, name: 'Desmaquillantes' },
          { id: DETERGENTE_LUBELLA_ID, quantity: 1, name: 'Detergente Lubella' },
        ]
      : [],
    surprises,
  }
}

export function calzonCart(input: {
  id: string
  name: string
  price: number
  was: number
  lines: { id: number; name: string; images?: string }[]
}): AniversarioInCart {
  return {
    offerId: input.id,
    name: input.name,
    price: input.price,
    was: input.was,
    lines: linesFromProducts(input.lines, 'calzon'),
    fixed: [],
    surprises: [],
  }
}

export function aniversarioItems(cart: AniversarioInCart) {
  return groupQty([
    ...cart.lines.map((line) => ({ id: line.id, quantity: line.quantity })),
    ...cart.fixed.map((line) => ({ id: line.id, quantity: line.quantity })),
  ])
}

export function aniversarioCheckoutUrl(cart: AniversarioInCart, extraItems: { id: number; quantity: number }[] = []) {
  const items = [...aniversarioItems(cart), ...extraItems]
  const payload = {
    campaign: 'aniversario-2026',
    offer: cart.offerId,
    name: cart.name,
    price: cart.price,
    lines: items,
    surprises: cart.surprises,
  }
  const data = encodeURIComponent(JSON.stringify(items))
  const aniversario = encodeURIComponent(JSON.stringify(payload))
  return `${CHECKOUT_BASE}&items=${data}&aniversario=${aniversario}`
}
