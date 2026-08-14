'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Chip,
  Container,
  Stack,
  Typography,
} from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import PaletteIcon from '@mui/icons-material/Palette'
import SavingsIcon from '@mui/icons-material/Savings'
import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'
import CelebrationIcon from '@mui/icons-material/Celebration'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Link from 'next/link'
import { getCategories, getProducts, ProductItem } from '@/lib/wooApi'
import { BRAND_GREEN, BRAND_GREEN_HOVER, BRAND_PURPLE, BRAND_PURPLE_HOVER } from '@/lib/constants'

const FALLBACK_MOCHILA_ID = 3810
const FALLBACK_LONCHERA_ID = 3829
const PRICE_MOCHILA = 490
const PRICE_LONCHERA = 399
const PRICE_COMBO = 780
const CHECKOUT_BASE = 'https://ecopipo.com/matriz/?redirect=ecopipo'
const IMG_MOCHILA = 'https://ecopipo.com/matriz/wp-content/uploads/2024/06/mochila.png'
const IMG_LONCHERA = 'https://ecopipo.com/matriz/wp-content/uploads/2024/06/lonchera.png'
const IMG_PLACEHOLDER =
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRU34ZGC6H9BGPDorU8aNG2P8ark14cj0DqOA&'

const PRODUCT_INFO = {
  mochila: {
    title: 'Conoce la mochila',
    description:
      'Elaborada con la calidad que nos caracteriza, la Mochila es excelente para niños y niñas que van al preescolar por su amplitud, también la puedes utilizar como pañalera.',
    care: 'Límpiala con un paño húmedo por fuera y con un paño seco por dentro.',
    extras: 'Está hecha en México, es 100% poliéster y pintada con tintas a base de agua y libres de plomo.',
    specs: ['Alto 35 cm', 'Ancho 27 cm', 'Fuelle 10 cm', 'Hecha en México', '100% poliéster'],
  },
  lonchera: {
    title: 'Conoce la lonchera',
    description:
      'Elaborada con la calidad que nos caracteriza, la Lonchera es excelente para llevar comida ya sea fría o caliente por largo tiempo gracias a su forro térmico. Ideal para edad preescolar, primaria e incluso llevarla a la oficina, combínala con el outfit Ecopipo de tu bebé.',
    care: 'La puedes limpiar con un paño húmedo por fuera y con un paño seco por dentro.',
    extras: 'Está hecha en México.',
    specs: ['Alto 25 cm', 'Ancho 20 cm', 'Fuelle 15 cm', 'Forro térmico', 'Hecha en México'],
  },
} as const

function money(n: number) {
  return n.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 })
}

function getDesignName(product: ProductItem) {
  const dash = product.name.indexOf(' - ')
  if (dash >= 0) return product.name.slice(dash + 3).trim()
  const parent = (product.parent_name || '').replace(/^Privado:\s*/i, '').trim()
  if (parent && product.name.toLowerCase().startsWith(parent.toLowerCase())) {
    return product.name.slice(parent.length).replace(/^[\s\-–]+/, '').trim() || product.name
  }
  return product.name
}

function getProductImage(product: ProductItem | null, fallback: string) {
  const img = product?.images
  if (!img || img === 'False' || img === 'false') return fallback
  return img
}

function isInStock(product: ProductItem) {
  return (product.stock ?? 0) > 0
}

export default function MochilaLanding() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [products, setProducts] = useState<ProductItem[]>([])
  const [mochilaParentId, setMochilaParentId] = useState(FALLBACK_MOCHILA_ID)
  const [loncheraParentId, setLoncheraParentId] = useState(FALLBACK_LONCHERA_ID)
  const [selectedMochila, setSelectedMochila] = useState<ProductItem | null>(null)
  const [selectedLonchera, setSelectedLonchera] = useState<ProductItem | null>(null)
  const [includeMochila, setIncludeMochila] = useState(true)
  const [includeLonchera, setIncludeLonchera] = useState(false)
  const [paying, setPaying] = useState(false)

  useEffect(() => {
    let cancelled = false
    Promise.all([getCategories(), getProducts()])
      .then(([categories, allProducts]) => {
        if (cancelled) return
        let mochilaId = FALLBACK_MOCHILA_ID
        let loncheraId = FALLBACK_LONCHERA_ID
        categories.forEach((cat) => {
          cat.children?.forEach((child) => {
            if (child.slug === 'mochila' && child.id) mochilaId = child.id
            if (child.slug === 'lonchera' && child.id) loncheraId = child.id
          })
        })
        setMochilaParentId(mochilaId)
        setLoncheraParentId(loncheraId)
        setProducts(allProducts)
        const firstMochila = allProducts.find((p) => p.parent === mochilaId && isInStock(p))
          ?? allProducts.find((p) => p.parent === mochilaId)
          ?? null
        setSelectedMochila(firstMochila)
      })
      .catch(() => {
        if (!cancelled) setError('No pudimos cargar los diseños. Recarga la página o escríbenos por WhatsApp.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const mochilas = useMemo(
    () => products.filter((p) => p.parent === mochilaParentId),
    [products, mochilaParentId]
  )
  const loncheras = useMemo(
    () => products.filter((p) => p.parent === loncheraParentId),
    [products, loncheraParentId]
  )
  const mochilasInStock = mochilas.filter(isInStock)
  const loncherasInStock = loncheras.filter(isInStock)
  const canAddMochila = mochilasInStock.length > 0
  const canAddLonchera = loncherasInStock.length > 0
  const isCombo = includeMochila && includeLonchera
  const isLoncheraOnly = includeLonchera && !includeMochila

  const total = isCombo ? PRICE_COMBO : includeLonchera ? PRICE_LONCHERA : PRICE_MOCHILA
  const savings = PRICE_MOCHILA + PRICE_LONCHERA - PRICE_COMBO
  const mochilaReady = !includeMochila || (!!selectedMochila && isInStock(selectedMochila))
  const loncheraReady = !includeLonchera || (!!selectedLonchera && isInStock(selectedLonchera))
  const canPay = (includeMochila || includeLonchera) && mochilaReady && loncheraReady

  const scrollTo = (id: string) => {
    requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  const pickLonchera = () => {
    const match = selectedMochila
      ? loncherasInStock.find((l) => getDesignName(l) === getDesignName(selectedMochila))
      : null
    setSelectedLonchera((current) => current && isInStock(current) ? current : (match ?? loncherasInStock[0] ?? null))
  }

  const pickMochila = () => {
    const match = selectedLonchera
      ? mochilasInStock.find((m) => getDesignName(m) === getDesignName(selectedLonchera))
      : null
    setSelectedMochila((current) => current && isInStock(current) ? current : (match ?? mochilasInStock[0] ?? null))
  }

  const enableLonchera = () => {
    if (!canAddLonchera) return
    pickLonchera()
    setIncludeLonchera(true)
  }

  const enableMochila = () => {
    if (!canAddMochila) return
    pickMochila()
    setIncludeMochila(true)
  }

  const disableLonchera = () => {
    if (!includeMochila) return
    setIncludeLonchera(false)
  }

  const disableMochila = () => {
    if (!includeLonchera) return
    setIncludeMochila(false)
  }

  const chooseMochilaOnly = () => {
    enableMochila()
    setIncludeLonchera(false)
    scrollTo('elige-mochila')
  }

  const chooseLoncheraOnly = () => {
    enableLonchera()
    setIncludeMochila(false)
    scrollTo('elige-lonchera')
  }

  const chooseCombo = () => {
    enableMochila()
    enableLonchera()
    scrollTo('elige-lonchera')
  }

  const goToPay = () => {
    if (!canPay) return
    setPaying(true)
    const items: { id: number; quantity: number }[] = []
    if (includeMochila && selectedMochila) {
      items.push({ id: selectedMochila.id, quantity: 1 })
    }
    if (includeLonchera && selectedLonchera) {
      items.push({ id: selectedLonchera.id, quantity: 1 })
    }
    const url = `${CHECKOUT_BASE}&items=${encodeURIComponent(JSON.stringify(items))}&promoTotal=${total}`
    window.location.href = url
  }

  if (loading) {
    return <DesignLoader />
  }

  if (error) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>
        <Button component={Link} href="/tienda/outfit" variant="contained" sx={{ bgcolor: BRAND_PURPLE }}>
          Ir a la tienda
        </Button>
      </Container>
    )
  }

  return (
    <Box sx={{ bgcolor: '#F7F4F8', minHeight: '100vh', color: '#333', pb: { xs: 22, sm: 14 } }}>
      <Box
        sx={{
          background: `linear-gradient(160deg, #EFE9F1 0%, #fff 55%, #F3F7E8 100%)`,
          pt: { xs: 4, sm: 6 },
          pb: { xs: 4, sm: 6 },
        }}
      >
        <Container maxWidth="md">
          <Stack alignItems="center" spacing={1.5} textAlign="center">
            <Chip
              label="Oferta especial"
              sx={{ bgcolor: BRAND_GREEN, color: 'white', fontWeight: 700, letterSpacing: 0.4 }}
            />
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                color: BRAND_PURPLE,
                letterSpacing: '-0.6px',
                fontSize: { xs: '1.85rem', sm: '2.6rem' },
                lineHeight: 1.15,
              }}
            >
              Arma tu kit escolar
            </Typography>
            <Typography
              sx={{
                color: BRAND_GREEN,
                fontWeight: 800,
                fontSize: { xs: '1.15rem', sm: '1.35rem' },
              }}
            >
              ya con envío incluido
            </Typography>
            <Typography sx={{ maxWidth: 560, color: '#444', lineHeight: 1.6 }}>
              Elige solo la mochila, solo la lonchera o las dos con precio especial. En los tres casos pagas un solo total, con envío incluido.
            </Typography>
          </Stack>

          <Box
            sx={{
              mt: 4,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-end',
              gap: { xs: 2, sm: 4 },
            }}
          >
            {includeMochila && selectedMochila ? (
              <PreviewCard
                title="Mochila"
                design={getDesignName(selectedMochila)}
                image={getProductImage(selectedMochila, IMG_MOCHILA)}
                price={PRICE_MOCHILA}
                featured={!isLoncheraOnly}
                onClick={() => scrollTo('elige-mochila')}
              />
            ) : (
              <AddSlot
                label={canAddMochila ? 'Agrega la mochila' : 'Mochila agotada'}
                hint={`A ${money(PRICE_MOCHILA)}`}
                disabled={!canAddMochila}
                featured={!isLoncheraOnly}
                onClick={() => {
                  enableMochila()
                  scrollTo('elige-mochila')
                }}
              />
            )}
            {includeLonchera && selectedLonchera ? (
              <PreviewCard
                title="Lonchera"
                design={getDesignName(selectedLonchera)}
                image={getProductImage(selectedLonchera, IMG_LONCHERA)}
                price={PRICE_LONCHERA}
                featured={isLoncheraOnly}
                onClick={() => scrollTo('elige-lonchera')}
              />
            ) : (
              <AddSlot
                label={canAddLonchera ? 'Agrega la lonchera' : 'Lonchera agotada'}
                hint={includeMochila ? `Combo ${money(PRICE_COMBO)}` : `A ${money(PRICE_LONCHERA)}`}
                disabled={!canAddLonchera}
                featured={isLoncheraOnly}
                onClick={chooseCombo}
              />
            )}
          </Box>

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1.5}
            justifyContent="center"
            sx={{ mt: 3 }}
          >
            <PricePill
              label="Mochila"
              price={PRICE_MOCHILA}
              selected={includeMochila && !includeLonchera}
              disabled={!canAddMochila}
              onClick={chooseMochilaOnly}
            />
            <PricePill
              label="Lonchera"
              price={PRICE_LONCHERA}
              selected={isLoncheraOnly}
              disabled={!canAddLonchera}
              onClick={chooseLoncheraOnly}
            />
            <PricePill
              label="Las dos"
              price={PRICE_COMBO}
              highlight
              selected={isCombo}
              disabled={!canAddMochila || !canAddLonchera}
              onClick={chooseCombo}
            />
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="md" sx={{ py: 2 }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          justifyContent="center"
          sx={{ mb: 4 }}
        >
          <TrustItem icon={<LocalShippingIcon />} text="Envío incluido en el total" />
          <TrustItem icon={<PaletteIcon />} text="Tú eliges el diseño" />
          <TrustItem icon={<SavingsIcon />} text={`Ahorra ${money(savings)} al llevar las dos`} />
        </Stack>

        <Box
          id="elige-mochila"
          sx={{
            scrollMarginTop: 88,
            p: { xs: 2, sm: 3 },
            borderRadius: 4,
            bgcolor: includeMochila ? '#F3F7E8' : 'white',
            border: '2px solid',
            borderColor: includeMochila ? BRAND_GREEN : 'rgba(115,48,128,0.12)',
            boxShadow: includeMochila ? '0 8px 24px rgba(137,179,41,0.18)' : '0 4px 16px rgba(115,48,128,0.06)',
          }}
        >
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }} justifyContent="space-between">
            <Box>
              <SectionTitle step="1" title={includeMochila ? 'Elige el diseño de tu mochila' : '¿Quieres la mochila?'} compact />
              <Typography sx={{ color: '#444', mt: 0.5 }}>
                Sola cuesta {money(PRICE_MOCHILA)} con envío incluido. Con la lonchera, las dos salen en{' '}
                <Box component="strong" sx={{ color: BRAND_PURPLE }}>{money(PRICE_COMBO)}</Box>
                {' '}con envío incluido.
              </Typography>
            </Box>
            {includeMochila ? (
              <Button
                variant="outlined"
                startIcon={<CloseIcon />}
                disabled={!includeLonchera}
                onClick={disableMochila}
                sx={{
                  borderColor: BRAND_PURPLE,
                  color: BRAND_PURPLE,
                  fontWeight: 700,
                  minHeight: 44,
                  whiteSpace: 'nowrap',
                  '&:hover': { borderColor: BRAND_PURPLE_HOVER, bgcolor: 'rgba(115,48,128,0.06)' },
                }}
              >
                Quitar mochila
              </Button>
            ) : (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                disabled={!canAddMochila}
                onClick={enableMochila}
                sx={{
                  bgcolor: BRAND_GREEN,
                  fontWeight: 700,
                  minHeight: 44,
                  whiteSpace: 'nowrap',
                  boxShadow: '0 4px 14px rgba(137,179,41,0.35)',
                  '&:hover': { bgcolor: BRAND_GREEN_HOVER },
                  '&:disabled': { bgcolor: '#c5c5c5', color: 'white' },
                }}
              >
                {canAddMochila ? 'Agregar mochila' : 'Mochila agotada'}
              </Button>
            )}
          </Stack>
          <ProductInfo info={PRODUCT_INFO.mochila} />
          {includeMochila && (
            <Box sx={{ mt: 2 }}>
              <DesignGrid
                products={mochilas}
                selectedId={selectedMochila?.id}
                fallbackImage={IMG_MOCHILA}
                onSelect={(p) => {
                  if (!isInStock(p)) return
                  setSelectedMochila(p)
                  setIncludeMochila(true)
                }}
              />
            </Box>
          )}
        </Box>

        <Box
          id="elige-lonchera"
          sx={{
            mt: 3,
            scrollMarginTop: 88,
            p: { xs: 2, sm: 3 },
            borderRadius: 4,
            bgcolor: includeLonchera ? '#F3F7E8' : 'white',
            border: '2px solid',
            borderColor: includeLonchera ? BRAND_GREEN : 'rgba(115,48,128,0.12)',
            boxShadow: includeLonchera ? '0 8px 24px rgba(137,179,41,0.18)' : '0 4px 16px rgba(115,48,128,0.06)',
          }}
        >
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }} justifyContent="space-between">
            <Box>
              <SectionTitle step="2" title={includeLonchera ? 'Elige el diseño de tu lonchera' : '¿Quieres la lonchera?'} compact />
              <Typography sx={{ color: '#444', mt: 0.5 }}>
                Sola cuesta {money(PRICE_LONCHERA)} con envío incluido. Junto con la mochila, las dos salen en{' '}
                <Box component="strong" sx={{ color: BRAND_PURPLE }}>{money(PRICE_COMBO)}</Box>
                {' '}con envío incluido. Ahorras {money(savings)}.
              </Typography>
            </Box>
            {includeLonchera ? (
              <Button
                variant="outlined"
                startIcon={<CloseIcon />}
                disabled={!includeMochila}
                onClick={disableLonchera}
                sx={{
                  borderColor: BRAND_PURPLE,
                  color: BRAND_PURPLE,
                  fontWeight: 700,
                  minHeight: 44,
                  whiteSpace: 'nowrap',
                  '&:hover': { borderColor: BRAND_PURPLE_HOVER, bgcolor: 'rgba(115,48,128,0.06)' },
                }}
              >
                Quitar lonchera
              </Button>
            ) : (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                disabled={!canAddLonchera}
                onClick={enableLonchera}
                sx={{
                  bgcolor: BRAND_GREEN,
                  fontWeight: 700,
                  minHeight: 44,
                  whiteSpace: 'nowrap',
                  boxShadow: '0 4px 14px rgba(137,179,41,0.35)',
                  '&:hover': { bgcolor: BRAND_GREEN_HOVER },
                  '&:disabled': { bgcolor: '#c5c5c5', color: 'white' },
                }}
              >
                {canAddLonchera ? 'Agregar lonchera' : 'Lonchera agotada'}
              </Button>
            )}
          </Stack>

          <ProductInfo info={PRODUCT_INFO.lonchera} />
          {includeLonchera && (
            <Box sx={{ mt: 2 }}>
              <DesignGrid
                products={loncheras}
                selectedId={selectedLonchera?.id}
                fallbackImage={IMG_LONCHERA}
                onSelect={(p) => {
                  if (!isInStock(p)) return
                  setSelectedLonchera(p)
                  setIncludeLonchera(true)
                }}
              />
            </Box>
          )}
        </Box>

        <Box
          sx={{
            mt: 4,
            p: 3,
            borderRadius: 4,
            bgcolor: 'white',
            textAlign: 'center',
            boxShadow: '0 4px 16px rgba(115,48,128,0.08)',
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 800, color: BRAND_PURPLE, mb: 1 }}>
            Tu total a pagar
          </Typography>
          <Typography sx={{ fontSize: { xs: '2rem', sm: '2.4rem' }, fontWeight: 800, color: BRAND_GREEN, lineHeight: 1 }}>
            {money(total)}
          </Typography>
          <Typography sx={{ fontWeight: 700, color: '#555', mt: 0.5 }}>
            con envío incluido
          </Typography>
          <Typography sx={{ color: '#666', mt: 1, fontSize: '0.95rem' }}>
            {isCombo && selectedMochila && selectedLonchera
              ? `Mochila ${getDesignName(selectedMochila)} + Lonchera ${getDesignName(selectedLonchera)}`
              : includeLonchera && selectedLonchera
                ? `Lonchera ${getDesignName(selectedLonchera)}`
                : includeMochila && selectedMochila
                  ? `Mochila ${getDesignName(selectedMochila)}`
                  : 'Elige un diseño para continuar'}
          </Typography>
          <Button
            fullWidth
            variant="contained"
            size="large"
            disabled={!canPay || paying}
            onClick={goToPay}
            sx={{
              mt: 2,
              bgcolor: BRAND_GREEN,
              color: 'white',
              fontWeight: 800,
              minHeight: 52,
              borderRadius: 2,
              fontSize: '1.05rem',
              boxShadow: '0 4px 14px rgba(137,179,41,0.35)',
              '&:hover': { bgcolor: BRAND_GREEN_HOVER, transform: 'translateY(-1px)' },
            }}
          >
            {paying ? 'Te llevamos a pagar...' : `Pagar ${money(total)} con envío incluido`}
          </Button>
        </Box>
      </Container>

      <Box
        component="footer"
        sx={{ bgcolor: BRAND_PURPLE, py: 6, px: 2, color: 'white', textAlign: 'center', mt: 4 }}
      >
        <CelebrationIcon sx={{ color: BRAND_GREEN, fontSize: 40 }} />
        <Typography variant="h6" sx={{ fontWeight: 600, mt: 1 }}>
          Outfit escolar ecológico, hecho en México
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.85, mt: 1 }}>
          Ecopipo® 2026 — Empresa 100% mexicana.
        </Typography>
      </Box>

      <Box
        sx={{
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: { xs: 72, sm: 0 },
          zIndex: 1100,
          bgcolor: 'white',
          borderTop: '1px solid rgba(115,48,128,0.12)',
          boxShadow: '0 -6px 20px rgba(0,0,0,0.08)',
          px: 2,
          py: 1.5,
          pb: 'calc(12px + env(safe-area-inset-bottom))',
        }}
      >
        <Container maxWidth="md" sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {includeMochila && selectedMochila && (
              <Box
                component="img"
                src={getProductImage(selectedMochila, IMG_MOCHILA)}
                alt="Mochila"
                sx={{ width: 48, height: 48, borderRadius: 1.5, objectFit: 'cover', border: '2px solid white', boxShadow: 1 }}
              />
            )}
            {includeLonchera && selectedLonchera && (
              <Box
                component="img"
                src={getProductImage(selectedLonchera, IMG_LONCHERA)}
                alt="Lonchera"
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 1.5,
                  objectFit: 'cover',
                  border: '2px solid white',
                  boxShadow: 1,
                  ml: includeMochila ? -1.5 : 0,
                }}
              />
            )}
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ fontWeight: 800, color: BRAND_PURPLE, lineHeight: 1.1 }}>
              {money(total)}
            </Typography>
            <Typography variant="caption" sx={{ color: '#666', fontWeight: 600 }}>
              envío incluido
            </Typography>
          </Box>
          <Button
            variant="contained"
            disabled={!canPay || paying}
            onClick={goToPay}
            sx={{
              bgcolor: BRAND_GREEN,
              fontWeight: 800,
              minHeight: 44,
              px: 2.5,
              '&:hover': { bgcolor: BRAND_GREEN_HOVER },
            }}
          >
            {paying ? '...' : 'Pagar ahora'}
          </Button>
        </Container>
      </Box>
    </Box>
  )
}

const LOADER_MESSAGES = [
  'Preparando tu kit escolar',
  'Cargando estampados',
  'Revisando disponibilidad',
]

function DesignLoader() {
  const [msgIndex, setMsgIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setMsgIndex((i) => (i + 1) % LOADER_MESSAGES.length)
    }, 1600)
    return () => clearInterval(timer)
  }, [])

  return (
    <Box
      sx={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(160deg, #EFE9F1 0%, #fff 55%, #F3F7E8 100%)',
        px: 2,
        '@keyframes kitPulse': {
          '0%, 100%': { transform: 'scale(1)', opacity: 1 },
          '50%': { transform: 'scale(1.08)', opacity: 0.85 },
        },
        '@keyframes kitOrbit': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        '@keyframes kitShimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        '@keyframes kitRise': {
          '0%': { opacity: 0, transform: 'translateY(12px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        '@keyframes kitBar': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(220%)' },
        },
        '@keyframes kitFade': {
          '0%, 100%': { opacity: 0.45 },
          '50%': { opacity: 1 },
        },
      }}
    >
      <Stack alignItems="center" spacing={3} sx={{ width: '100%', maxWidth: 420 }}>
        <Box sx={{ position: 'relative', width: 96, height: 96 }}>
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              border: '3px solid rgba(115,48,128,0.12)',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              border: '3px solid transparent',
              borderTopColor: BRAND_PURPLE,
              borderRightColor: BRAND_GREEN,
              animation: 'kitOrbit 1.1s linear infinite',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              inset: 18,
              borderRadius: '50%',
              bgcolor: 'white',
              boxShadow: '0 8px 22px rgba(115,48,128,0.16)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'kitPulse 1.6s ease-in-out infinite',
            }}
          >
            <Box
              component="img"
              src="/imgs/Ecopipo-llsm.png"
              alt="Ecopipo"
              sx={{ width: 46, filter: 'none' }}
            />
          </Box>
        </Box>

        <Box sx={{ textAlign: 'center', minHeight: 56 }}>
          <Typography
            key={msgIndex}
            sx={{
              fontWeight: 800,
              color: BRAND_PURPLE,
              fontSize: '1.15rem',
              animation: 'kitRise 0.45s ease',
            }}
          >
            {LOADER_MESSAGES[msgIndex]}
          </Typography>
          <Typography variant="body2" sx={{ color: '#666', mt: 0.5, animation: 'kitFade 1.6s ease-in-out infinite' }}>
            Eligiendo los diseños para ti
          </Typography>
        </Box>

        <Box
          sx={{
            width: '100%',
            height: 6,
            borderRadius: 999,
            bgcolor: 'rgba(115,48,128,0.1)',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              width: '42%',
              borderRadius: 999,
              background: `linear-gradient(90deg, ${BRAND_PURPLE}, ${BRAND_GREEN})`,
              animation: 'kitBar 1.35s ease-in-out infinite',
            }}
          />
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 1,
            width: '100%',
          }}
        >
          {[0, 1, 2, 3].map((i) => (
            <Box
              key={i}
              sx={{
                aspectRatio: '1',
                borderRadius: 2,
                background: 'linear-gradient(90deg, #efe6f2 0%, #f7f4f8 45%, #efe6f2 90%)',
                backgroundSize: '200% 100%',
                animation: `kitRise 0.5s ease ${i * 0.12}s both, kitShimmer 1.4s linear ${i * 0.1}s infinite`,
              }}
            />
          ))}
        </Box>
      </Stack>
    </Box>
  )
}

function PricePill({
  label,
  price,
  highlight,
  selected,
  disabled,
  onClick,
}: {
  label: string
  price: number
  highlight?: boolean
  selected?: boolean
  disabled?: boolean
  onClick?: () => void
}) {
  return (
    <Box
      component="button"
      type="button"
      disabled={disabled}
      onClick={onClick}
      sx={{
        px: 2,
        py: 1,
        borderRadius: 999,
        bgcolor: selected ? BRAND_PURPLE : highlight ? BRAND_GREEN : 'white',
        color: selected || highlight ? 'white' : BRAND_PURPLE,
        border: selected || highlight ? 'none' : '1px solid rgba(115,48,128,0.2)',
        fontWeight: 700,
        textAlign: 'center',
        cursor: disabled ? 'not-allowed' : 'pointer',
        appearance: 'none',
        font: 'inherit',
        opacity: disabled ? 0.5 : 1,
        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
        '&:hover': disabled
          ? {}
          : {
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 14px rgba(115,48,128,0.18)',
            },
      }}
    >
      {label} {money(price)} · envío incluido
    </Box>
  )
}

function TrustItem({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <Stack direction="row" spacing={1} alignItems="center" justifyContent="center" sx={{ color: '#444' }}>
      <Box sx={{ color: BRAND_GREEN, display: 'flex' }}>{icon}</Box>
      <Typography variant="body2" sx={{ fontWeight: 600 }}>{text}</Typography>
    </Stack>
  )
}

function SectionTitle({ step, title, compact }: { step: string; title: string; compact?: boolean }) {
  return (
    <Stack direction="row" spacing={1.25} alignItems="center" sx={{ mb: compact ? 0 : 0.5 }}>
      <Box
        sx={{
          width: 28,
          height: 28,
          borderRadius: '50%',
          bgcolor: BRAND_PURPLE,
          color: 'white',
          fontWeight: 800,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 14,
          flexShrink: 0,
        }}
      >
        {step}
      </Box>
      <Typography variant={compact ? 'h6' : 'h5'} sx={{ fontWeight: 800, color: BRAND_PURPLE }}>
        {title}
      </Typography>
    </Stack>
  )
}

function ProductInfo({ info }: { info: (typeof PRODUCT_INFO)[keyof typeof PRODUCT_INFO] }) {
  return (
    <Accordion
      disableGutters
      elevation={0}
      sx={{
        mt: 2,
        bgcolor: 'rgba(255,255,255,0.72)',
        borderRadius: '12px !important',
        border: '1px solid rgba(115,48,128,0.12)',
        '&:before': { display: 'none' },
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon sx={{ color: BRAND_PURPLE }} />}
        sx={{
          minHeight: 48,
          px: 1.5,
          '& .MuiAccordionSummary-content': { my: 1 },
        }}
      >
        <Typography sx={{ fontWeight: 700, color: BRAND_PURPLE }}>{info.title}</Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ px: 1.5, pb: 2, pt: 0 }}>
        <Typography sx={{ color: '#444', lineHeight: 1.65, mb: 1.5 }}>
          {info.description}
        </Typography>
        <Typography sx={{ color: '#555', lineHeight: 1.6, mb: 0.75 }}>
          {info.care}
        </Typography>
        <Typography sx={{ color: '#555', lineHeight: 1.6, mb: 1.5 }}>
          {info.extras}
        </Typography>
        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
          {info.specs.map((spec) => (
            <Chip
              key={spec}
              label={spec}
              size="small"
              sx={{
                bgcolor: 'rgba(115,48,128,0.08)',
                color: BRAND_PURPLE,
                fontWeight: 700,
              }}
            />
          ))}
        </Stack>
      </AccordionDetails>
    </Accordion>
  )
}

function AddSlot({
  label,
  hint,
  disabled,
  featured,
  onClick,
}: {
  label: string
  hint: string
  disabled?: boolean
  featured?: boolean
  onClick: () => void
}) {
  return (
    <Box
      component="button"
      type="button"
      disabled={disabled}
      onClick={onClick}
      sx={{
        width: featured ? { xs: 180, sm: 240 } : { xs: 120, sm: 160 },
        height: featured ? { xs: 210, sm: 280 } : { xs: 150, sm: 200 },
        borderRadius: 3,
        border: '2px dashed',
        borderColor: disabled ? 'rgba(115,48,128,0.2)' : BRAND_PURPLE,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: BRAND_PURPLE,
        bgcolor: 'rgba(115,48,128,0.04)',
        px: 1,
        textAlign: 'center',
        cursor: disabled ? 'not-allowed' : 'pointer',
        appearance: 'none',
        font: 'inherit',
        opacity: disabled ? 0.55 : 1,
        transition: 'transform 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease',
        '&:hover': disabled
          ? {}
          : {
              transform: 'translateY(-3px)',
              bgcolor: 'rgba(137,179,41,0.12)',
              borderColor: BRAND_GREEN,
              boxShadow: '0 8px 18px rgba(137,179,41,0.2)',
            },
      }}
    >
      <AddIcon />
      <Typography variant="caption" sx={{ fontWeight: 700, mt: 0.5 }}>
        {label}
      </Typography>
      <Typography variant="caption" sx={{ color: '#666' }}>
        {hint}
      </Typography>
    </Box>
  )
}

function PreviewCard({
  title,
  design,
  image,
  price,
  featured,
  onClick,
}: {
  title: string
  design: string
  image: string
  price: number
  featured?: boolean
  onClick?: () => void
}) {
  return (
    <Box
      component={onClick ? 'button' : 'div'}
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      sx={{
        textAlign: 'center',
        width: featured ? { xs: 180, sm: 240 } : { xs: 120, sm: 160 },
        appearance: 'none',
        border: 0,
        bgcolor: 'transparent',
        p: 0,
        font: 'inherit',
        cursor: onClick ? 'pointer' : 'default',
      }}
    >
      <Box
        component="img"
        src={image || IMG_PLACEHOLDER}
        alt={`${title} ${design}`}
        sx={{
          width: '100%',
          aspectRatio: '1',
          objectFit: 'cover',
          borderRadius: 3,
          bgcolor: 'white',
          boxShadow: featured ? '0 10px 28px rgba(115,48,128,0.18)' : '0 6px 16px rgba(0,0,0,0.08)',
        }}
      />
      <Typography sx={{ fontWeight: 800, mt: 1, color: BRAND_PURPLE }}>{title}</Typography>
      <Typography variant="body2" sx={{ color: '#555' }}>{design}</Typography>
      <Typography variant="caption" sx={{ color: BRAND_GREEN, fontWeight: 700 }}>
        {money(price)} con envío incluido
      </Typography>
    </Box>
  )
}

function DesignGrid({
  products,
  selectedId,
  fallbackImage,
  onSelect,
}: {
  products: ProductItem[]
  selectedId?: number
  fallbackImage: string
  onSelect: (product: ProductItem) => void
}) {
  if (products.length === 0) {
    return <Typography sx={{ color: '#777' }}>No hay diseños disponibles por ahora.</Typography>
  }

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' },
        gap: 1.5,
      }}
    >
      {products.map((product) => {
        const selected = selectedId === product.id
        const available = isInStock(product)
        return (
          <Box
            key={product.id}
            component="button"
            type="button"
            disabled={!available}
            onClick={() => available && onSelect(product)}
            sx={{
              appearance: 'none',
              border: selected ? `3px solid ${BRAND_PURPLE}` : '2px solid transparent',
              borderRadius: 3,
              p: 0,
              bgcolor: 'white',
              cursor: available ? 'pointer' : 'not-allowed',
              overflow: 'hidden',
              position: 'relative',
              textAlign: 'left',
              boxShadow: selected ? '0 8px 20px rgba(115,48,128,0.2)' : '0 2px 10px rgba(0,0,0,0.06)',
              opacity: available ? 1 : 0.55,
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              '&:hover': available ? { transform: 'translateY(-2px)' } : {},
            }}
          >
            <Box
              component="img"
              src={getProductImage(product, fallbackImage)}
              alt={product.name}
              sx={{ width: '100%', aspectRatio: '1', objectFit: 'cover', display: 'block', filter: available ? 'none' : 'grayscale(0.7)' }}
            />
            {selected && (
              <CheckCircleIcon
                sx={{ position: 'absolute', top: 8, right: 8, color: BRAND_GREEN, bgcolor: 'white', borderRadius: '50%', fontSize: 26 }}
              />
            )}
            {!available && (
              <Chip
                label="Agotado"
                size="small"
                sx={{ position: 'absolute', top: 8, left: 8, bgcolor: '#555', color: 'white', fontWeight: 700 }}
              />
            )}
            <Box sx={{ p: 1.25 }}>
              <Typography sx={{ fontWeight: 700, color: BRAND_PURPLE, fontSize: '0.95rem' }}>
                {getDesignName(product)}
              </Typography>
            </Box>
          </Box>
        )
      })}
    </Box>
  )
}
