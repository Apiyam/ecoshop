'use client'

import { useState, type ReactNode } from 'react'
import { Box, Button, Container, Dialog, DialogContent, Stack, Typography } from '@mui/material'
import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import { useRouter } from 'next/navigation'
import PackWizard from '@/app/packs/PackWizard'
import type { ExpoPack } from '@/app/packs/types'
import { useCart } from '@/context/CartContext'
import { BRAND_GREEN, BRAND_GREEN_HOVER, BRAND_PURPLE, BRAND_PURPLE_HOVER } from '@/lib/constants'
import {
  ANIV_ECOPIPO_PACKS,
  FILTROS_4X3,
  PARENT,
  calzonCart,
  ecopipoPackCart,
  filtros4x3Activa,
  filtros4x3Cart,
  money,
  mysteryCart,
  towelCart,
} from '@/lib/aniversario'
import AniversarioSelectWizard, { SelectSlot } from './AniversarioSelectWizard'

const INK = '#241820'
const CREAM = '#FFF6EE'
const LUBELLA = '#E23B86'
const LUBELLA_DEEP = '#8E2458'

const ART = {
  logo: '/aniversario/web/logo.webp',
  mysteryBadge: '/aniversario/web/mystery-badge.webp',
  mystery: '/aniversario/web/mystery.webp',
  pack1: '/aniversario/web/esencial.webp',
  pack2: '/aniversario/web/inteligente.webp',
  pack3: '/aniversario/web/libertad.webp',
  /** Sustituir cuando llegue el arte final. */
  filtros4x3: '/aniversario/web/filtros-4x3-placeholder.svg',
}

const STARS = [
  { top: '14%', left: '7%', size: 16, color: '#F5C518' },
  { top: '28%', left: '90%', size: 22, color: '#E23B86' },
  { top: '70%', left: '6%', size: 12, color: '#89b329' },
  { top: '78%', left: '88%', size: 18, color: '#F5C518' },
  { top: '8%', left: '72%', size: 10, color: '#733080' },
]

type Brand = 'ecopipo' | 'lubella'

type LubellaFlow = {
  kind: 'toalla' | 'calzon'
  id: string
  withPack17?: boolean
  title: string
  price: number
  was: number
  slots: SelectSlot[]
}

function buySx(bg: string, hover: string) {
  return {
    width: '100%',
    minHeight: 64,
    borderRadius: '999px',
    textTransform: 'none' as const,
    fontWeight: 900,
    fontSize: { xs: 18, sm: 20 },
    color: '#fff',
    bgcolor: bg,
    border: '3px solid #fff',
    boxShadow: 'none',
    '&:hover': { bgcolor: hover, boxShadow: 'none' },
  }
}

const HOW_STEPS = [
  ['Elige tu pack', 'Mystery Box, Esencial, Inteligente o Libertad. En Lubella, toallas o calzones.'],
  ['Elige tus piezas', 'En los packs de pañal tú eliges lisos y estampados. En toallas y calzones, el estampado y la talla.'],
  ['La sorpresa la arma la tienda', 'El diseño de regalo no se elige. Llega al azar.'],
  ['Pagas el pack', 'Las piezas quedan en el pedido y el precio que ves es el del pack completo.'],
]

function ArtFrame({ src, alt, children }: { src: string; alt: string; children?: ReactNode }) {
  return (
    <Box
      sx={{
        bgcolor: '#fff',
        borderRadius: '32px',
        p: { xs: 1.25, sm: 1.5 },
        pb: children ? { xs: 2.25, sm: 2.5 } : { xs: 1.25, sm: 1.5 },
        boxShadow: 'none',
        display: 'flex',
        flexDirection: 'column',
        gap: 1.25,
        height: '100%',
      }}
    >
      <Box
        component="img"
        src={src}
        alt={alt}
        sx={{ width: '100%', height: 'auto', display: 'block', borderRadius: '24px' }}
      />
      {children}
    </Box>
  )
}

function Includes({ items }: { items: string[] }) {
  return (
    <Stack component="ul" spacing={0.6} sx={{ listStyle: 'none', m: 0, p: 0 }}>
      {items.map((item) => (
        <Stack key={item} component="li" direction="row" spacing={1} alignItems="flex-start">
          <CheckRoundedIcon sx={{ color: BRAND_GREEN, fontSize: 18, mt: '2px' }} />
          <Typography sx={{ fontSize: 14.5, lineHeight: 1.35 }}>{item}</Typography>
        </Stack>
      ))}
    </Stack>
  )
}

export default function AniversarioLanding() {
  const router = useRouter()
  const { setAniversarioInCart } = useCart()
  const [brand, setBrand] = useState<Brand>('ecopipo')
  const [packWizard, setPackWizard] = useState<ExpoPack | null>(null)
  const [lubellaFlow, setLubellaFlow] = useState<LubellaFlow | null>(null)
  const [pack17, setPack17] = useState({ moderado: false, abundante: false })
  const [howOpen, setHowOpen] = useState(false)

  const saveAndGo = (cart: Parameters<typeof setAniversarioInCart>[0]) => {
    if (!cart) return
    setAniversarioInCart(cart)
    setPackWizard(null)
    setLubellaFlow(null)
    router.push('/carrito')
  }

  const towels = [
    {
      id: 'moderado' as const,
      name: 'Siempre protegida · Moderado',
      line: '6 Regular o Teen + 4 Nocturnas',
      base: 1468,
      baseWas: 1783,
      up: 1967,
      photos: ['/imgs/regular.png', '/imgs/nocturna.png'],
      day: 6,
      night: 4,
    },
    {
      id: 'abundante' as const,
      name: 'Siempre protegida · Abundante',
      line: '6 Nocturnas + 4 Regular o Teen',
      base: 1522,
      baseWas: 1837,
      up: 2021,
      photos: ['/imgs/nocturna.png', '/imgs/regular.png'],
      day: 4,
      night: 6,
    },
  ]

  return (
    <Box sx={{ bgcolor: CREAM, color: INK, minHeight: '100vh', pb: 8 }}>
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          background:
            'radial-gradient(circle at 12% 18%, #ffe7a3 0, transparent 26%), radial-gradient(circle at 88% 8%, #f7c3e4 0, transparent 30%), radial-gradient(circle at 50% 120%, #d7f3a4 0, transparent 42%), linear-gradient(180deg, #f4e4ff 0%, #fff6ee 100%)',
          pt: { xs: 3, md: 4 },
          pb: { xs: 2, md: 3 },
        }}
      >
        <Box aria-hidden sx={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          {STARS.map((star) => (
            <Box
              key={`${star.top}-${star.left}`}
              sx={{
                position: 'absolute',
                top: star.top,
                left: star.left,
                width: star.size,
                height: star.size,
                bgcolor: star.color,
                clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
              }}
            />
          ))}
        </Box>
        <Container maxWidth="md" sx={{ position: 'relative' }}>
          <Box
            component="img"
            src={ART.logo}
            alt="17 Aniversario Ecopipo"
            sx={{
              width: { xs: 230, sm: 320 },
              height: 'auto',
              display: 'block',
              mx: 'auto',
              animation: 'anivFloat 3.6s ease-in-out infinite',
              '@keyframes anivFloat': {
                '0%, 100%': { transform: 'translateY(0)' },
                '50%': { transform: 'translateY(-8px)' },
              },
            }}
          />
          <Typography component="h1" sx={{ textAlign: 'center', fontWeight: 900, fontSize: { xs: 28, sm: 40 }, lineHeight: 1.02, letterSpacing: '-0.03em', mt: 1.5, color: BRAND_PURPLE }}>
            Arma tu pack y llévatelo a este precio
          </Typography>
          <Typography sx={{ textAlign: 'center', mt: 1, fontSize: 17, maxWidth: 480, mx: 'auto', color: '#5c4d57' }}>
            Eliges las piezas. El regalo de diseño sorpresa lo arma la tienda.
          </Typography>
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Button
              onClick={() => setHowOpen(true)}
              sx={{ color: BRAND_PURPLE, border: `2px solid ${BRAND_PURPLE}`, borderRadius: '999px', textTransform: 'none', fontWeight: 800, px: 2.5, bgcolor: '#fff', boxShadow: 'none' }}
            >
              Cómo funcionan los packs
            </Button>
          </Box>
        </Container>
      </Box>

      <Box sx={{ py: 2 }}>
        <Container maxWidth="md">
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.25}>
            <Button
              onClick={() => setBrand('ecopipo')}
              aria-pressed={brand === 'ecopipo'}
              sx={{
                flex: 1,
                minHeight: 88,
                borderRadius: '22px',
                textTransform: 'none',
                fontWeight: 900,
                fontSize: 20,
                gap: 1.25,
                color: brand === 'ecopipo' ? '#fff' : BRAND_PURPLE,
                bgcolor: brand === 'ecopipo' ? BRAND_PURPLE : '#fff',
                border: `4px solid ${brand === 'ecopipo' ? '#fff' : BRAND_PURPLE}`,
                boxShadow: 'none',
                '&:hover': { bgcolor: brand === 'ecopipo' ? BRAND_PURPLE_HOVER : '#f8f1fa', boxShadow: 'none' },
              }}
            >
              <Box component="img" src="/imgs/Ecopipo-llsm.png" alt="" sx={{ height: 40, width: 'auto' }} />
              Ver promos Ecopipo
            </Button>
            <Button
              onClick={() => setBrand('lubella')}
              aria-pressed={brand === 'lubella'}
              sx={{
                flex: 1,
                minHeight: 88,
                borderRadius: '22px',
                textTransform: 'none',
                fontWeight: 900,
                fontSize: 20,
                gap: 1.25,
                color: brand === 'lubella' ? '#fff' : LUBELLA_DEEP,
                bgcolor: brand === 'lubella' ? LUBELLA : '#fff',
                border: `4px solid ${brand === 'lubella' ? '#fff' : LUBELLA}`,
                boxShadow: 'none',
                '&:hover': { bgcolor: brand === 'lubella' ? LUBELLA_DEEP : '#fff5fa', boxShadow: 'none' },
              }}
            >
              <Box component="img" src="/imgs/logo.png" alt="" sx={{ height: 36, width: 'auto' }} />
              Ver promos Lubella
            </Button>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ pt: 3 }}>
        {brand === 'ecopipo' ? (
          <Stack spacing={3}>
            <Typography sx={{ fontWeight: 800, color: '#111', textAlign: 'center', fontSize: 18 }}>
              En estos tres eliges lisos y estampados. El pañal sin absorbente es sorpresa.
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2, alignItems: 'start' }}>
              {ANIV_ECOPIPO_PACKS.map((pack) => (
                <ArtFrame key={pack.id} src={ART[pack.id]} alt={`Pack ${pack.name}, de ${money(pack.priceOriginal)} a ${money(pack.priceDiscounted)}`}>
                  <Button
                    variant="contained"
                    onClick={() => setPackWizard(pack)}
                    sx={buySx(
                      pack.color === 'green' ? BRAND_GREEN : BRAND_PURPLE,
                      pack.color === 'green' ? BRAND_GREEN_HOVER : BRAND_PURPLE_HOVER
                    )}
                  >
                    Armar {pack.name}
                  </Button>
                </ArtFrame>
              ))}
            </Box>

            {filtros4x3Activa() && (
              <Stack spacing={1.5} sx={{ alignItems: 'center', pt: { xs: 1, md: 2 } }}>
                <Typography sx={{ fontWeight: 900, color: BRAND_PURPLE, textAlign: 'center', fontSize: { xs: 26, sm: 34 }, lineHeight: 1.1 }}>
                  Filtros de bambú
                </Typography>
                <Typography sx={{ fontWeight: 900, color: '#111', textAlign: 'center', fontSize: { xs: 22, sm: 28 }, lineHeight: 1.2 }}>
                  ¡4×3! Compra 3 y llévate 1 gratis
                </Typography>
                <Typography sx={{ color: '#5c4d57', textAlign: 'center', fontSize: 16 }}>
                  Antes {money(FILTROS_4X3.was)} · Ahora {money(FILTROS_4X3.price)} · Hasta el 2 de noviembre
                </Typography>
                <Box sx={{ width: '100%', maxWidth: 440 }}>
                  <ArtFrame
                    src={ART.filtros4x3}
                    alt={`Filtros de bambú 4x3, de ${money(FILTROS_4X3.was)} a ${money(FILTROS_4X3.price)}`}
                  >
                    <Button
                      variant="contained"
                      onClick={() => saveAndGo(filtros4x3Cart())}
                      sx={buySx(BRAND_PURPLE, BRAND_PURPLE_HOVER)}
                    >
                      Quiero 4 filtros · {money(FILTROS_4X3.price)}
                    </Button>
                  </ArtFrame>
                </Box>
              </Stack>
            )}

            <Stack spacing={1.5} sx={{ alignItems: 'center', pt: { xs: 1, md: 3 } }}>
              <Typography sx={{ fontWeight: 900, color: '#111', textAlign: 'center', fontSize: { xs: 26, sm: 34 }, lineHeight: 1.15, maxWidth: 640 }}>
                Y si eres más de sorpresas ¡Déjate sorprender con la Mystery Box!
              </Typography>
              <Box component="img" src={ART.mysteryBadge} alt="Mystery Box" sx={{ width: { xs: 200, sm: 260 }, height: 'auto' }} />
              <Box sx={{ width: '100%', maxWidth: 440 }}>
                <ArtFrame src={ART.mystery} alt="Mystery Box: 10 pañales sorpresa, de $3,340 a $2,460">
                  <Button
                    variant="contained"
                    onClick={() => saveAndGo(mysteryCart())}
                    sx={buySx(BRAND_GREEN, BRAND_GREEN_HOVER)}
                  >
                    La quiero · {money(2460)}
                  </Button>
                </ArtFrame>
              </Box>
            </Stack>
          </Stack>
        ) : (
          <Stack spacing={2.5}>
            <Stack direction="row" spacing={2} alignItems="center" justifyContent="center">
              <Box component="img" src={ART.logo} alt="" sx={{ width: 108, height: 'auto' }} />
              <Typography sx={{ color: '#5c4d57', maxWidth: 420 }}>
                Eliges el estampado de Regular, Teen y Nocturna. Pantiprotector, panti y pañoleta llegan al azar.
              </Typography>
            </Stack>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
              {towels.map((pack) => {
                const upgraded = pack17[pack.id]
                const price = upgraded ? pack.up : pack.base
                return (
                  <Box key={pack.id} sx={{ bgcolor: '#fff', borderRadius: '28px', p: 2, display: 'flex', flexDirection: 'column', gap: 1.25 }}>
                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
                      {pack.photos.map((src) => (
                        <Box key={src} component="img" src={src} alt="" sx={{ width: '100%', aspectRatio: '1', objectFit: 'contain', borderRadius: '16px' }} />
                      ))}
                    </Box>
                    <Typography component="h3" sx={{ fontWeight: 900, fontSize: 22 }}>{pack.name}</Typography>
                    <Typography sx={{ color: '#7a6a74', textDecoration: 'line-through' }}>De {money(pack.baseWas)}</Typography>
                    <Typography sx={{ fontWeight: 900, fontSize: 36, color: LUBELLA_DEEP, lineHeight: 1 }}>{money(price)}</Typography>
                    <Button
                      onClick={() => setPack17((prev) => ({ ...prev, [pack.id]: !prev[pack.id] }))}
                      aria-pressed={upgraded}
                      sx={{
                        minHeight: 56,
                        borderRadius: '16px',
                        textTransform: 'none',
                        fontWeight: 900,
                        fontSize: 16,
                        justifyContent: 'flex-start',
                        color: upgraded ? '#fff' : LUBELLA_DEEP,
                        bgcolor: upgraded ? LUBELLA : '#fff',
                        border: `3px solid ${LUBELLA}`,
                        boxShadow: 'none',
                        '&:hover': { bgcolor: upgraded ? LUBELLA : '#fff5fa', boxShadow: 'none' },
                      }}
                    >
                      {upgraded ? 'Pack 17 incluido · $499' : 'Sumar Pack 17 por $499'}
                    </Button>
                    <Includes
                      items={[
                        pack.line,
                        'De regalo: 1 pantiprotector, 1 panti ultradelgada y 1 pañoleta',
                        ...(upgraded ? ['Pack 17: pantiprotector extra, desmaquillantes, detergente y bolsa'] : []),
                      ]}
                    />
                    <Button
                      variant="contained"
                      onClick={() =>
                        setLubellaFlow({
                          kind: 'toalla',
                          id: pack.id,
                          withPack17: upgraded,
                          title: upgraded ? `${pack.name} + Pack 17` : pack.name,
                          price,
                          was: upgraded ? (pack.id === 'moderado' ? 2420 : 2474) : pack.baseWas,
                          slots: [
                            { key: 'day', title: `Elige ${pack.day} Regular o Teen`, count: pack.day, parents: [PARENT.TOALLA_REGULAR, PARENT.TOALLA_TEEN] },
                            { key: 'night', title: `Elige ${pack.night} Nocturnas`, count: pack.night, parents: [PARENT.TOALLA_NOCTURNA] },
                          ],
                        })
                      }
                      sx={{ mt: 'auto', ...buySx(LUBELLA, LUBELLA_DEEP) }}
                    >
                      Armar este pack
                    </Button>
                  </Box>
                )
              })}
            </Box>

            <Typography component="h2" sx={{ fontWeight: 900, fontSize: 28, color: '#111' }}>Calzones</Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
              {[
                {
                  id: 'normal-prueba',
                  name: 'Tiro bikini · Prueba',
                  note: '2 por este precio',
                  was: 909,
                  price: 799,
                  items: ['1 Ligero o Moderado', '1 Moderado o Abundante'],
                  slots: [
                    { key: 'ligero', title: 'Elige 1 Ligero o Moderado', count: 1, parents: [PARENT.CALZON_BIKINI_LIGERO] },
                    { key: 'abundante', title: 'Elige 1 Moderado o Abundante', count: 1, parents: [PARENT.CALZON_BIKINI_ABUNDANTE] },
                  ],
                },
                {
                  id: 'normal-completo',
                  name: 'Tiro bikini · Completo',
                  note: 'Compra 4 y el 5.º va incluido',
                  was: 2228,
                  price: 1818,
                  items: ['3 Ligero o Moderado, uno va incluido', '2 Moderado o Abundante'],
                  slots: [
                    { key: 'ligero', title: 'Elige 3 Ligero o Moderado', count: 3, parents: [PARENT.CALZON_BIKINI_LIGERO] },
                    { key: 'abundante', title: 'Elige 2 Moderado o Abundante', count: 2, parents: [PARENT.CALZON_BIKINI_ABUNDANTE] },
                  ],
                },
                {
                  id: 'bikini-prueba',
                  name: 'Tiro bikini teen · Prueba',
                  note: '2 por este precio',
                  was: 806,
                  price: 709,
                  items: ['1 Ligero o Moderado teen', '1 Moderado o Abundante teen'],
                  slots: [
                    { key: 'ligero', title: 'Elige 1 Ligero o Moderado teen', count: 1, parents: [PARENT.CALZON_TEEN_LIGERO] },
                    { key: 'abundante', title: 'Elige 1 Moderado o Abundante teen', count: 1, parents: [PARENT.CALZON_TEEN_ABUNDANTE] },
                  ],
                },
                {
                  id: 'bikini-completo',
                  name: 'Tiro bikini teen · Completo',
                  note: 'Compra 4 y el 5.º va incluido',
                  was: 2011,
                  price: 1612,
                  items: ['3 Ligero o Moderado teen, uno va incluido', '2 Moderado o Abundante teen'],
                  slots: [
                    { key: 'ligero', title: 'Elige 3 Ligero o Moderado teen', count: 3, parents: [PARENT.CALZON_TEEN_LIGERO] },
                    { key: 'abundante', title: 'Elige 2 Moderado o Abundante teen', count: 2, parents: [PARENT.CALZON_TEEN_ABUNDANTE] },
                  ],
                },
                {
                  id: 'alto-prueba',
                  name: 'Tiro alto · Prueba',
                  note: '2 por este precio',
                  was: 998,
                  price: 879,
                  items: ['2 calzones tiro alto moderado o abundante'],
                  slots: [
                    { key: 'alto', title: 'Elige 2 tiro alto', count: 2, parents: [PARENT.CALZON_TIRO_ALTO] },
                  ],
                },
                {
                  id: 'alto-completo',
                  name: 'Tiro alto · Completo',
                  note: 'Compra 4 y el 5.º va incluido',
                  was: 2495,
                  price: 1996,
                  items: ['5 calzones tiro alto, uno va incluido'],
                  slots: [
                    { key: 'alto', title: 'Elige 5 tiro alto', count: 5, parents: [PARENT.CALZON_TIRO_ALTO] },
                  ],
                },
              ].map((pack) => (
                <Box key={pack.id} sx={{ bgcolor: '#fff', borderRadius: '28px', p: 2, display: 'flex', flexDirection: 'column', gap: 1.25 }}>
                  <Box component="img" src="/imgs/calzon.png" alt="Calzón Lubella" sx={{ width: '100%', maxHeight: 220, objectFit: 'contain', borderRadius: '16px' }} />
                  <Typography sx={{ fontWeight: 800, color: LUBELLA }}>{pack.note}</Typography>
                  <Typography component="h3" sx={{ fontWeight: 900, fontSize: 24 }}>{pack.name}</Typography>
                  <Typography sx={{ color: '#7a6a74', textDecoration: 'line-through' }}>De {money(pack.was)}</Typography>
                  <Typography sx={{ fontWeight: 900, fontSize: 36, color: LUBELLA_DEEP, lineHeight: 1 }}>{money(pack.price)}</Typography>
                  <Includes items={pack.items} />
                  <Button
                    variant="contained"
                    onClick={() =>
                      setLubellaFlow({
                        kind: 'calzon',
                        id: pack.id,
                        title: pack.name,
                        price: pack.price,
                        was: pack.was,
                        slots: pack.slots,
                      })
                    }
                    sx={{ mt: 'auto', ...buySx(LUBELLA, LUBELLA_DEEP) }}
                  >
                    Armar {pack.name}
                  </Button>
                </Box>
              ))}
            </Box>
          </Stack>
        )}
      </Container>

      {packWizard && (
        <PackWizard
          pack={packWizard}
          open
          onClose={() => setPackWizard(null)}
          onPay={(selection) =>
            saveAndGo(
              ecopipoPackCart(
                packWizard,
                selection.lisos,
                selection.estampados,
                selection.wetbag
              )
            )
          }
        />
      )}

      {lubellaFlow && (
        <AniversarioSelectWizard
          open
          title={lubellaFlow.title}
          price={lubellaFlow.price}
          accent={LUBELLA}
          slots={lubellaFlow.slots}
          onClose={() => setLubellaFlow(null)}
          onPay={(picked) => {
            if (lubellaFlow.kind === 'toalla' && (lubellaFlow.id === 'moderado' || lubellaFlow.id === 'abundante')) {
              saveAndGo(
                towelCart({
                  id: lubellaFlow.id,
                  withPack17: !!lubellaFlow.withPack17,
                  day: picked.day || [],
                  night: picked.night || [],
                })
              )
              return
            }
            if (lubellaFlow.kind === 'calzon') {
              saveAndGo(
                calzonCart({
                  id: lubellaFlow.id,
                  name: lubellaFlow.title,
                  price: lubellaFlow.price,
                  was: lubellaFlow.was,
                  lines: Object.values(picked).flat(),
                })
              )
            }
          }}
        />
      )}

      <Dialog
        open={howOpen}
        onClose={() => setHowOpen(false)}
        fullWidth
        maxWidth="sm"
        sx={{ zIndex: 11000 }}
      >
        <DialogContent sx={{ px: { xs: 2.5, sm: 4 }, py: 3 }}>
          <Typography component="h2" sx={{ fontWeight: 900, color: BRAND_PURPLE, fontSize: 26, textAlign: 'center', lineHeight: 1.15 }}>
            Cómo funcionan los packs
          </Typography>
          <Stack component="ol" spacing={2} sx={{ listStyle: 'none', m: 0, mt: 2.5, p: 0 }}>
            {HOW_STEPS.map(([title, body], index) => (
              <Stack key={title} component="li" direction="row" spacing={1.5} alignItems="flex-start">
                <Box sx={{ width: 32, height: 32, borderRadius: '50%', bgcolor: BRAND_PURPLE, color: '#fff', fontWeight: 900, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                  {index + 1}
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: 800, color: BRAND_PURPLE }}>{title}</Typography>
                  <Typography sx={{ color: '#5c4d57', lineHeight: 1.45 }}>{body}</Typography>
                </Box>
              </Stack>
            ))}
          </Stack>
          <Button
            fullWidth
            variant="contained"
            onClick={() => setHowOpen(false)}
            sx={{ ...buySx(BRAND_GREEN, BRAND_GREEN_HOVER), mt: 3 }}
          >
            Entendido, ver packs
          </Button>
        </DialogContent>
      </Dialog>
    </Box>
  )
}
