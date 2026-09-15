'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard'
import CloseIcon from '@mui/icons-material/Close'
import ExploreIcon from '@mui/icons-material/Explore'
import PercentIcon from '@mui/icons-material/Percent'
import FilterAltIcon from '@mui/icons-material/FilterAlt'
import FavoriteIcon from '@mui/icons-material/Favorite'
import LocalOfferIcon from '@mui/icons-material/LocalOffer'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import type { SvgIconComponent } from '@mui/icons-material'
import Link from 'next/link'
import { getProducts, ProductItem } from '@/lib/wooApi'
import {
  BanderazoCampaign,
  BanderazoCartLine,
  ECOPIPO_PRINTS,
  FILTRO_BEBE_ID,
  FILTRO_PACK_PROMO,
  FILTRO_PACK_QTY,
  FILTRO_PACK_REGULAR,
  GIFT_FILTRO_MIN,
  LUBELLA_MIN,
  PREMIUM_ESTAMPADO_PARENT,
  PREMIUM_LISO_PARENT,
  PROMO_PANAL_MIN,
  buildPayload,
  checkoutUrl,
  getShortName,
  isLubellaPromoProduct,
  isPromoPanal,
  lubellaGroup,
  productImage,
  quoteEcopipo,
  quoteLubella,
  unitPrice,
} from '@/lib/banderazoPatrio'

const FLAG_GREEN = '#006847'
const FLAG_RED = '#CE1126'
const GOLD = '#C9A227'
const LUBELLA_PINK = '#FF4FB0'
const ECOPIPO_PURPLE = '#733080'
const INK = '#1A120C'
const INK_SOFT = '#3A2A22'

const IMG_FALLBACK = '/imgs/pads.png'
const LUBELLA_CATS = ['Protectores de lactancia', 'Desmaquillantes', 'Pañoletas', 'Toallas'] as const

function money(n: number, digits = 2) {
  return n.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: digits })
}

function isInStock(p: ProductItem) {
  return (p.stock ?? 0) > 0
}

type Props = { campaign: BanderazoCampaign }

export default function BanderazoLanding({ campaign }: Props) {
  const isEcopipo = campaign === 'banderazo-patrio-ecopipo'
  const accent = isEcopipo ? FLAG_GREEN : LUBELLA_PINK
  const theme = useTheme()
  const exploreFullScreen = useMediaQuery(theme.breakpoints.down('sm'))
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [products, setProducts] = useState<ProductItem[]>([])
  const [qty, setQty] = useState<Record<number, number>>({})
  const [filtroPacks, setFiltroPacks] = useState(0)
  const [paying, setPaying] = useState(false)
  const [exploreOpen, setExploreOpen] = useState(false)
  const [exploreQuery, setExploreQuery] = useState('')
  const [lubellaCat, setLubellaCat] = useState<(typeof LUBELLA_CATS)[number]>('Protectores de lactancia')

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch(() => setError('No pudimos cargar los productos. Recarga o escríbenos por WhatsApp.'))
      .finally(() => setLoading(false))
  }, [])

  const promoPanales = useMemo(
    () =>
      products
        .filter(isPromoPanal)
        .filter(isInStock)
        .sort((a, b) => getShortName(a).localeCompare(getShortName(b), 'es')),
    [products]
  )
  const otrosPanales = useMemo(
    () =>
      products
        .filter(
          (p) =>
            isInStock(p) &&
            (p.parent === PREMIUM_LISO_PARENT ||
              (p.parent === PREMIUM_ESTAMPADO_PARENT && !isPromoPanal(p)))
        )
        .sort((a, b) => getShortName(a).localeCompare(getShortName(b), 'es')),
    [products]
  )
  const lubella = useMemo(
    () =>
      products
        .filter(isLubellaPromoProduct)
        .filter(isInStock)
        .sort((a, b) => lubellaGroup(a).localeCompare(lubellaGroup(b), 'es') || getShortName(a).localeCompare(getShortName(b), 'es')),
    [products]
  )

  useEffect(() => {
    const available = LUBELLA_CATS.filter((g) => lubella.some((p) => lubellaGroup(p) === g))
    if (available.length && !available.includes(lubellaCat)) {
      setLubellaCat(available[0])
    }
  }, [lubella, lubellaCat])

  const filtroBebe = products.find((p) => p.id === FILTRO_BEBE_ID) ?? null
  const extrasElegidos = otrosPanales.reduce((n, p) => n + (qty[p.id] || 0), 0)
  const extrasFiltrados = useMemo(() => {
    const q = exploreQuery.trim().toLowerCase()
    if (!q) return otrosPanales
    return otrosPanales.filter((p) => getShortName(p).toLowerCase().includes(q) || p.name.toLowerCase().includes(q))
  }, [otrosPanales, exploreQuery])

  const setLine = (id: number, next: number, max: number) => {
    setQty((prev) => ({ ...prev, [id]: Math.max(0, Math.min(max, next)) }))
  }

  const lines: BanderazoCartLine[] = useMemo(() => {
    const out: BanderazoCartLine[] = []
    if (isEcopipo) {
      promoPanales.forEach((p) => {
        const q = qty[p.id] || 0
        if (q > 0) out.push({ product: p, quantity: q, role: 'promo_panal' })
      })
      otrosPanales.forEach((p) => {
        const q = qty[p.id] || 0
        if (q > 0) out.push({ product: p, quantity: q, role: 'regular' })
      })
      if (filtroPacks > 0 && filtroBebe) {
        out.push({
          product: filtroBebe,
          quantity: filtroPacks * FILTRO_PACK_QTY,
          role: 'filtro_pack',
        })
      }
    } else {
      lubella.forEach((p) => {
        const q = qty[p.id] || 0
        if (q > 0) out.push({ product: p, quantity: q, role: 'lubella_promo' })
      })
    }
    return out
  }, [isEcopipo, promoPanales, otrosPanales, lubella, qty, filtroPacks, filtroBebe])

  const quote = isEcopipo ? quoteEcopipo(lines) : quoteLubella(lines)
  const payload = buildPayload(campaign, lines, filtroBebe)
  const canPay = lines.some((l) => l.quantity > 0)

  const goPay = () => {
    if (!canPay) return
    setPaying(true)
    window.location.href = checkoutUrl(payload)
  }

  if (loading) {
    return (
      <Box sx={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, bgcolor: '#fff8f0' }}>
        <CircularProgress sx={{ color: FLAG_RED }} />
        <Typography fontWeight={700}>Preparando el banderazo...</Typography>
      </Box>
    )
  }

  if (error) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>
        <Button href="/tienda" variant="contained" sx={{ bgcolor: FLAG_GREEN }}>Ir a la tienda</Button>
      </Container>
    )
  }

  return (
    <Box sx={{ bgcolor: '#FFF8F0', minHeight: '100vh', pb: { xs: 22, sm: 14 } }}>
      <PatrioticBanner isEcopipo={isEcopipo} />

      <Container maxWidth="md" sx={{ mt: 2.5, position: 'relative', zIndex: 2 }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
            gap: 1.1,
            mb: 2.5,
          }}
        >
          {(isEcopipo
            ? [
                { color: FLAG_GREEN, Icon: PercentIcon, kicker: 'Promo Patria', title: '20% en pañales', note: 'Lleva 3 o más de los modelos seleccionados' },
                { color: FLAG_RED, Icon: CardGiftcardIcon, kicker: 'Regalo', title: 'Filtro de bambú', note: 'Gratis al completar 6 pañales patrios' },
                { color: ECOPIPO_PURPLE, Icon: FilterAltIcon, kicker: 'Pack filtros', title: '$567 → $499', note: 'Tres filtros de bambú al precio de fiesta' },
              ]
            : [
                { color: LUBELLA_PINK, Icon: LocalOfferIcon, kicker: 'Promo Lubella', title: '15% de festejo', note: 'Desde 5 piezas de la selección' },
                { color: FLAG_GREEN, Icon: FavoriteIcon, kicker: 'Tu mix', title: 'Arma tu combo', note: 'Toallas, pañoletas, protectores y más' },
                { color: GOLD, Icon: AutoAwesomeIcon, kicker: 'Septiembre', title: 'Hecho en México', note: 'Lubella se pone de fiesta contigo' },
              ] as { color: string; Icon: SvgIconComponent; kicker: string; title: string; note: string }[]
          ).map((card) => (
            <Box
              key={card.title}
              sx={{
                bgcolor: '#fff',
                borderRadius: 3.5,
                px: 1.5,
                pt: 1.75,
                pb: 1.5,
                textAlign: 'center',
                boxShadow: '0 12px 30px rgba(115,48,128,0.14)',
                border: '1px solid rgba(115,48,128,0.08)',
              }}
            >
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  bgcolor: card.color,
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 0.85,
                  boxShadow: `0 8px 18px ${card.color}66`,
                }}
              >
                <card.Icon sx={{ fontSize: 26 }} />
              </Box>
              <Typography sx={{ color: card.color, fontWeight: 900, fontSize: 12, letterSpacing: 1.2, textTransform: 'uppercase' }}>
                {card.kicker}
              </Typography>
              <Typography sx={{ color: INK, fontWeight: 900, fontSize: '1.05rem', lineHeight: 1.15, mt: 0.25 }}>
                {card.title}
              </Typography>
              <Typography sx={{ color: INK_SOFT, fontWeight: 700, mt: 0.4, fontSize: '0.82rem' }}>{card.note}</Typography>
            </Box>
          ))}
        </Box>

        <Stack alignItems="center" spacing={1.5} textAlign="center" sx={{ mb: 2 }}>
          <Typography sx={{ maxWidth: 640, color: INK, fontWeight: 700, fontSize: { xs: '1.08rem', sm: '1.22rem' }, lineHeight: 1.45 }}>
            {isEcopipo
              ? 'Tres pañales patriotas y el 20% ya es tuyo. Llega a seis y te regalamos un filtro de bambú para celebrar.'
              : 'Cinco piezas Lubella de la selección y el 15% se enciende solita: toallas, pañoletas, protectores y desmaquillantes.'}
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap justifyContent="center">
            {isEcopipo
              ? ECOPIPO_PRINTS.map((p) => (
                  <Chip key={p} label={p} sx={{ bgcolor: '#fff', border: `2px solid ${FLAG_GREEN}`, color: INK, fontWeight: 800 }} />
                ))
              : ['Toallas', 'Pañoletas', 'Protectores de lactancia', 'Desmaquillantes'].map((p) => (
                  <Chip key={p} label={p} sx={{ bgcolor: '#fff', border: `2px solid ${LUBELLA_PINK}`, color: INK, fontWeight: 800 }} />
                ))}
          </Stack>
        </Stack>
      </Container>

      <Container maxWidth="md" sx={{ py: 2 }}>
        {isEcopipo && (
          <>
            <SectionTitle color={FLAG_GREEN} kicker="Los consentidos de septiembre" title="Pañales de Promo Patria · 20%" />
            <Typography sx={{ mb: 2, color: INK_SOFT, fontWeight: 700, fontSize: '1.05rem' }}>
              Elige {PROMO_PANAL_MIN} o más. Si completas {GIFT_FILTRO_MIN}, el filtro de bambú se suma de regalo.
            </Typography>
            <ProductGrid
              products={promoPanales}
              qty={qty}
              setLine={setLine}
              accent={FLAG_GREEN}
              badge="−20%"
            />

            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Button
                size="large"
                variant="contained"
                startIcon={<ExploreIcon />}
                onClick={() => setExploreOpen(true)}
                sx={{
                  bgcolor: FLAG_RED,
                  fontWeight: 900,
                  px: 3.5,
                  py: 1.4,
                  borderRadius: 999,
                  fontSize: '1.05rem',
                  boxShadow: '0 8px 20px rgba(206,17,38,0.28)',
                  '&:hover': { bgcolor: '#a50d22' },
                }}
              >
                Explorar más
                {extrasElegidos > 0 ? ` · ${extrasElegidos} en tu pedido` : ''}
              </Button>
              <Typography sx={{ mt: 1.25, color: INK, fontWeight: 700 }}>
                ¿Se te antoja otro estampado o un liso? Ábrelo y agrégalo aquí mismo.
              </Typography>
            </Box>

            <Dialog
              fullWidth
              maxWidth="md"
              open={exploreOpen}
              onClose={() => setExploreOpen(false)}
              fullScreen={exploreFullScreen}
              sx={{ zIndex: 13000 }}
              slotProps={{
                backdrop: { sx: { zIndex: 12990 } },
              }}
              PaperProps={{
                sx: {
                  borderRadius: { xs: 0, sm: 4 },
                  bgcolor: '#FFF8F0',
                  zIndex: 13001,
                  display: 'flex',
                  flexDirection: 'column',
                  maxHeight: { xs: '100%', sm: '90vh' },
                  height: { xs: '100%', sm: 'auto' },
                },
              }}
            >
              <DialogTitle sx={{ fontWeight: 900, color: INK, pr: 6, flexShrink: 0 }}>
                Más pañales para tu banderazo
                <IconButton
                  onClick={() => setExploreOpen(false)}
                  sx={{ position: 'absolute', right: 8, top: 8, color: INK }}
                  aria-label="Cerrar"
                >
                  <CloseIcon />
                </IconButton>
              </DialogTitle>
              <DialogContent sx={{ flex: 1, overflowY: 'auto', pb: 2 }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Buscar estampado o color…"
                  value={exploreQuery}
                  onChange={(e) => setExploreQuery(e.target.value)}
                  sx={{ mb: 2, bgcolor: '#fff', '& .MuiInputBase-input': { color: INK, fontWeight: 700 } }}
                />
                <ProductGrid products={extrasFiltrados} qty={qty} setLine={setLine} accent={FLAG_RED} />
              </DialogContent>
              <DialogActions
                sx={{
                  flexShrink: 0,
                  position: 'sticky',
                  bottom: 0,
                  px: 2,
                  py: 1.5,
                  bgcolor: '#FFF8F0',
                  borderTop: '1px solid #ead9c8',
                  boxShadow: '0 -8px 20px rgba(26,18,12,0.08)',
                }}
              >
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => setExploreOpen(false)}
                  sx={{ bgcolor: FLAG_GREEN, fontWeight: 900, minHeight: 48, '&:hover': { bgcolor: '#055c3e' } }}
                >
                  Listo, volver a la promo
                </Button>
              </DialogActions>
            </Dialog>

            <Box
              sx={{
                mt: 5,
                p: 3,
                borderRadius: 4,
                bgcolor: '#fff',
                border: `2px solid ${GOLD}`,
                boxShadow: '0 8px 24px rgba(0,104,71,0.08)',
              }}
            >
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }} justifyContent="space-between">
                <Box>
                  <Typography sx={{ fontWeight: 900, color: FLAG_GREEN, fontSize: '1.2rem' }}>
                    3 filtros de bambú de {money(FILTRO_PACK_REGULAR, 0)} a {money(FILTRO_PACK_PROMO, 0)}
                  </Typography>
                  <Typography sx={{ color: INK, fontWeight: 700 }}>
                    Tres filtros juntos, precio de fiesta. Agrégalos si quieres stock extra.
                  </Typography>
                </Box>
                <QtyControl
                  value={filtroPacks}
                  max={20}
                  accent={FLAG_GREEN}
                  onChange={setFiltroPacks}
                  label="packs"
                />
              </Stack>
            </Box>
          </>
        )}

        {!isEcopipo && (
          <>
            <SectionTitle color={LUBELLA_PINK} kicker="La mesa está puesta" title={`15% desde ${LUBELLA_MIN} piezas`} />
            <Typography sx={{ mb: 2, color: INK, fontWeight: 700, fontSize: '1.05rem' }}>
              Junta cinco de la selección y Lubella te premia. Elige una categoría y arma tu mix.
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 2.5 }}>
              {LUBELLA_CATS.map((group) => {
                const count = lubella.filter((p) => lubellaGroup(p) === group).length
                if (!count) return null
                const active = lubellaCat === group
                return (
                  <Chip
                    key={group}
                    clickable
                    label={group}
                    onClick={() => setLubellaCat(group)}
                    sx={{
                      fontWeight: 800,
                      bgcolor: active ? LUBELLA_PINK : '#fff',
                      color: active ? '#fff' : INK,
                      border: `2px solid ${LUBELLA_PINK}`,
                      '&:hover': { bgcolor: active ? LUBELLA_PINK : '#ffe6f3' },
                    }}
                  />
                )
              })}
            </Stack>
            <ProductGrid
              products={lubella.filter((p) => lubellaGroup(p) === lubellaCat)}
              qty={qty}
              setLine={setLine}
              accent={LUBELLA_PINK}
              badge="−15%"
            />
          </>
        )}

        <QuoteCard
          isEcopipo={isEcopipo}
          accent={accent}
          quote={quote}
          payload={payload}
          canPay={canPay}
          paying={paying}
          onPay={goPay}
        />

        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button
            component={Link}
            href={isEcopipo ? '/banderazo-patrio-lubella' : '/banderazo-patrio-ecopipo'}
            variant="outlined"
            sx={{ borderColor: accent, color: accent, fontWeight: 800 }}
          >
            {isEcopipo ? 'Ver Banderazo Lubella' : 'Ver Banderazo Ecopipo'}
          </Button>
        </Box>
      </Container>

      <Box sx={{ bgcolor: FLAG_GREEN, color: '#fff', textAlign: 'center', py: 5, mt: 4 }}>
        <Typography sx={{ fontWeight: 800 }}>Hecho en México · Banderazo Patrio 2026</Typography>
        <Typography variant="body2" sx={{ opacity: 0.85, mt: 1 }}>Ecopipo® y Lubella® — Empresa 100% mexicana.</Typography>
      </Box>

      <Box
        sx={{
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: { xs: 72, sm: 0 },
          zIndex: 1100,
          bgcolor: '#fff',
          borderTop: `3px solid ${FLAG_RED}`,
          px: 2,
          py: 1.5,
        }}
      >
        <Container maxWidth="md" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontWeight: 900, color: accent, lineHeight: 1.1 }}>
              {money(payload.meta.expectedTotal)}
            </Typography>
            <Typography variant="caption" sx={{ color: INK, fontWeight: 800 }}>
              {payload.meta.volumePieces} piezas
              {isEcopipo && payload.meta.giftFiltro ? ' · filtro de regalo' : ''}
            </Typography>
          </Box>
          <Button
            variant="contained"
            disabled={!canPay || paying}
            onClick={goPay}
            sx={{ bgcolor: FLAG_RED, fontWeight: 800, minHeight: 44, '&:hover': { bgcolor: '#a50d22' } }}
          >
            {paying ? '...' : 'Pagar ahora'}
          </Button>
        </Container>
      </Box>
    </Box>
  )
}

function PatrioticBanner({ isEcopipo }: { isEcopipo: boolean }) {
  return (
    <Box sx={{ bgcolor: isEcopipo ? FLAG_GREEN : '#F7C6DE' }}>
      <Box
        component="img"
        src={isEcopipo ? '/imgs/banderazo-ecopipo.jpg' : '/imgs/banderazo-lubella.jpg'}
        alt={isEcopipo ? 'Promo Patria Ecopipo' : 'Promo Patria Lubella'}
        sx={{
          width: '100%',
          height: 'auto',
          display: 'block',
          objectFit: 'contain',
        }}
      />
    </Box>
  )
}

function SectionTitle({ color, kicker, title }: { color: string; kicker: string; title: string }) {
  return (
    <Box sx={{ mb: 1.5 }}>
      <Typography sx={{ color, fontWeight: 800, letterSpacing: 1, fontSize: 12, textTransform: 'uppercase' }}>
        {kicker}
      </Typography>
      <Typography variant="h5" sx={{ fontWeight: 900, color: INK }}>{title}</Typography>
    </Box>
  )
}

function QtyControl({
  value,
  max,
  onChange,
  accent,
  label,
}: {
  value: number
  max: number
  onChange: (n: number) => void
  accent: string
  label?: string
}) {
  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      <Button
        size="small"
        variant="outlined"
        onClick={() => onChange(Math.max(0, value - 1))}
        sx={{ minWidth: 36, borderColor: accent, color: accent }}
      >
        <RemoveIcon fontSize="small" />
      </Button>
      <Typography sx={{ minWidth: 28, textAlign: 'center', fontWeight: 800 }}>
        {value}{label ? ` ${label}` : ''}
      </Typography>
      <Button
        size="small"
        variant="outlined"
        onClick={() => onChange(Math.min(max, value + 1))}
        sx={{ minWidth: 36, borderColor: accent, color: accent }}
      >
        <AddIcon fontSize="small" />
      </Button>
    </Stack>
  )
}

function ProductGrid({
  products,
  qty,
  setLine,
  accent,
  badge,
}: {
  products: ProductItem[]
  qty: Record<number, number>
  setLine: (id: number, next: number, max: number) => void
  accent: string
  badge?: string
}) {
  if (!products.length) {
    return <Typography sx={{ color: INK, fontWeight: 700 }}>Por ahora no hay piezas de esta selección. Prueba otro modelo.</Typography>
  }
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)' }, gap: 1.5 }}>
      {products.map((p) => {
        const q = qty[p.id] || 0
        const max = Math.max(0, p.stock ?? 0)
        return (
          <Box
            key={p.id}
            sx={{
              bgcolor: '#fff',
              borderRadius: 3,
              overflow: 'hidden',
              border: q > 0 ? `3px solid ${accent}` : '2px solid #f0e6d8',
              position: 'relative',
            }}
          >
            {badge && (
              <Chip
                size="small"
                label={badge}
                sx={{ position: 'absolute', top: 8, left: 8, bgcolor: FLAG_RED, color: '#fff', fontWeight: 800, zIndex: 1 }}
              />
            )}
            <Box
              component="img"
              src={productImage(p, IMG_FALLBACK)}
              alt={p.name}
              onError={(e) => {
                e.currentTarget.onerror = null
                e.currentTarget.src = IMG_FALLBACK
              }}
              sx={{ width: '100%', aspectRatio: '1', objectFit: 'cover', display: 'block' }}
            />
            <Box sx={{ p: 1.25 }}>
              <Typography sx={{ fontWeight: 800, fontSize: '0.9rem', minHeight: 40, color: INK }}>{getShortName(p)}</Typography>
              <Typography sx={{ color: accent, fontWeight: 800, fontSize: '0.9rem', mb: 1 }}>
                {money(unitPrice(p), 0)}
              </Typography>
              <QtyControl value={q} max={max} accent={accent} onChange={(n) => setLine(p.id, n, max)} />
            </Box>
          </Box>
        )
      })}
    </Box>
  )
}

function QuoteCard({
  isEcopipo,
  accent,
  quote,
  payload,
  canPay,
  paying,
  onPay,
}: {
  isEcopipo: boolean
  accent: string
  quote: ReturnType<typeof quoteEcopipo> | ReturnType<typeof quoteLubella>
  payload: ReturnType<typeof buildPayload>
  canPay: boolean
  paying: boolean
  onPay: () => void
}) {
  return (
    <Box sx={{ mt: 5, p: 3, borderRadius: 4, bgcolor: '#fff', boxShadow: '0 8px 28px rgba(206,17,38,0.1)' }}>
      <Typography sx={{ fontWeight: 900, color: accent, mb: 1, fontSize: '1.35rem' }}>Tu cuenta patriota</Typography>
      <Typography sx={{ color: INK, fontWeight: 700, mb: 2, fontSize: '1.02rem' }}>
        {isEcopipo
          ? payload.meta.volumePieces === 0
            ? 'Empieza a llenar tu canasta: el ahorro se ve aquí al instante.'
            : payload.meta.volumeDiscount > 0
              ? `${payload.meta.volumePieces} piezas en tu pedido.`
              : `${payload.meta.volumePieces} piezas. Desde 6 el pedido se pone más sabroso.`
          : payload.meta.lubellaCount >= LUBELLA_MIN
            ? 'Ya tienes el 15%. Podrás agregar más productos y seguir aprovechando el descuento.'
            : payload.meta.lubellaCount >= 1
              ? 'Te falta poco para el 15%.'
              : 'Empieza a llenar tu canasta: el 15% se activa con 5 piezas.'}
      </Typography>
      {isEcopipo && 'giftFiltro' in quote && quote.giftFiltro && (
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2, color: FLAG_GREEN }}>
          <CardGiftcardIcon />
          <Typography fontWeight={800}>Filtro de bambú de regalo incluido</Typography>
        </Stack>
      )}
      <Typography sx={{ fontSize: '2rem', fontWeight: 900, color: FLAG_RED, lineHeight: 1 }}>
        {money(payload.meta.expectedTotal)}
      </Typography>
      <Button
        fullWidth
        variant="contained"
        disabled={!canPay || paying}
        onClick={onPay}
        sx={{ mt: 2, minHeight: 52, bgcolor: FLAG_GREEN, fontWeight: 900, '&:hover': { bgcolor: '#055c3e' } }}
      >
        {paying ? 'Te llevamos a pagar...' : `Pagar ${money(payload.meta.expectedTotal)}`}
      </Button>
    </Box>
  )
}
