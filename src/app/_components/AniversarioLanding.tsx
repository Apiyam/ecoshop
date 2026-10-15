'use client'

import { useState } from 'react'
import { Box, Button, Container, Stack, Typography } from '@mui/material'
import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import { useRouter } from 'next/navigation'
import PackWizard from '@/app/packs/PackWizard'
import type { ExpoPack } from '@/app/packs/types'
import { useCart } from '@/context/CartContext'
import { BRAND_GREEN, BRAND_GREEN_HOVER, BRAND_PURPLE, BRAND_PURPLE_HOVER } from '@/lib/constants'
import {
  ANIV_ECOPIPO_PACKS,
  PARENT,
  calzonCart,
  ecopipoPackCart,
  money,
  mysteryCart,
  towelCart,
} from '@/lib/aniversario'
import AniversarioSelectWizard, { SelectSlot } from './AniversarioSelectWizard'
import Link from 'next/link'

const INK = '#241820'
const CREAM = '#FFF6EE'
const LUBELLA = '#E23B86'
const LUBELLA_DEEP = '#8E2458'

type Brand = 'ecopipo' | 'lubella'

type LubellaFlow = {
  kind: 'toalla' | 'calzon'
  id: 'moderado' | 'abundante' | 'prueba' | 'completo'
  withPack17?: boolean
  title: string
  price: number
  slots: SelectSlot[]
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
          background:
            'radial-gradient(circle at 10% 20%, rgba(137,179,41,0.35), transparent 32%), radial-gradient(circle at 90% 0%, rgba(226,59,134,0.3), transparent 36%), linear-gradient(165deg, #4d2158 0%, #733080 55%, #9a3d78 100%)',
          color: '#fff',
          pt: { xs: 4, md: 6 },
          pb: { xs: 4, md: 5 },
        }}
      >
        <Container maxWidth="md">
          <Typography sx={{ textAlign: 'center', fontWeight: 800, letterSpacing: '0.16em', fontSize: 12 }}>
            ANIVERSARIO 17
          </Typography>
          <Typography component="h1" sx={{ textAlign: 'center', fontWeight: 900, fontSize: { xs: 34, sm: 48 }, lineHeight: 0.95, letterSpacing: '-0.04em', mt: 1 }}>
            Arma tu pack y llévatelo a este precio
          </Typography>
          <Typography sx={{ textAlign: 'center', mt: 1.5, fontSize: 17, maxWidth: 520, mx: 'auto' }}>
            Eliges las piezas. El regalo de diseño sorpresa lo arma la tienda.
          </Typography>
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Button
              component={Link}
              href="/packs/como-funcionan"
              sx={{ color: '#fff', borderColor: '#fff', border: '1px solid #fff', borderRadius: '999px', textTransform: 'none', fontWeight: 700, px: 2 }}
            >
              Cómo funcionan los packs
            </Button>
          </Box>
        </Container>
      </Box>

      <Box sx={{ position: 'sticky', top: 72, zIndex: 20, bgcolor: 'rgba(255,246,238,0.96)', backdropFilter: 'blur(8px)', py: 1.25, borderBottom: '1px solid rgba(36,24,32,0.06)' }}>
        <Container maxWidth="md">
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.25}>
            <Button
              onClick={() => setBrand('ecopipo')}
              aria-pressed={brand === 'ecopipo'}
              sx={{
                flex: 1,
                minHeight: 76,
                borderRadius: '20px',
                textTransform: 'none',
                fontWeight: 900,
                fontSize: 18,
                gap: 1.25,
                color: brand === 'ecopipo' ? '#fff' : BRAND_PURPLE,
                bgcolor: brand === 'ecopipo' ? BRAND_PURPLE : '#fff',
                border: `3px solid ${BRAND_PURPLE}`,
                boxShadow: brand === 'ecopipo' ? '0 10px 24px rgba(115,48,128,0.35)' : '0 4px 0 #d7c3dc',
                '&:hover': { bgcolor: brand === 'ecopipo' ? BRAND_PURPLE_HOVER : '#f8f1fa' },
              }}
            >
              <Box component="img" src="/imgs/Ecopipo-llsm.png" alt="" sx={{ height: 36, bgcolor: '#fff', borderRadius: '10px', px: 0.75 }} />
              Ver promos Ecopipo
            </Button>
            <Button
              onClick={() => setBrand('lubella')}
              aria-pressed={brand === 'lubella'}
              sx={{
                flex: 1,
                minHeight: 76,
                borderRadius: '20px',
                textTransform: 'none',
                fontWeight: 900,
                fontSize: 18,
                gap: 1.25,
                color: brand === 'lubella' ? '#fff' : LUBELLA_DEEP,
                bgcolor: brand === 'lubella' ? LUBELLA : '#fff',
                border: `3px solid ${LUBELLA}`,
                boxShadow: brand === 'lubella' ? '0 10px 24px rgba(226,59,134,0.35)' : '0 4px 0 #f3c2d8',
                '&:hover': { bgcolor: brand === 'lubella' ? LUBELLA_DEEP : '#fff5fa' },
              }}
            >
              <Box component="img" src="/imgs/logo.png" alt="" sx={{ height: 32, bgcolor: '#fff', borderRadius: '10px', px: 0.75 }} />
              Ver promos Lubella
            </Button>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ pt: 3 }}>
        {brand === 'ecopipo' ? (
          <Stack spacing={2.5}>
            <Box sx={{ bgcolor: '#fff', borderRadius: '28px', p: { xs: 2, sm: 3 }, display: 'grid', gridTemplateColumns: { xs: '1fr', md: '160px 1fr' }, gap: 2, alignItems: 'center', boxShadow: '0 12px 32px rgba(77,33,88,0.06)' }}>
              <Box component="img" src="/imgs/Ecopipo-llsm.png" alt="Ecopipo" sx={{ width: 140, mx: 'auto' }} />
              <Stack spacing={1.25}>
                <Typography sx={{ fontWeight: 800, color: BRAND_PURPLE, letterSpacing: '0.08em', fontSize: 13 }}>DISEÑOS SORPRESA</Typography>
                <Typography component="h2" sx={{ fontWeight: 900, fontSize: 28, lineHeight: 1.05 }}>Mystery Box 6 + 4</Typography>
                <Typography sx={{ color: '#7a6a74', textDecoration: 'line-through' }}>De {money(3340)}</Typography>
                <Typography sx={{ fontWeight: 900, fontSize: 40, color: BRAND_PURPLE, lineHeight: 1 }}>{money(2460)}</Typography>
                <Includes
                  items={[
                    '6 pañales premium estampados completos',
                    '4 pañales premium estampados sin absorbente',
                    'No eliges el diseño: llega al azar',
                  ]}
                />
                <Button
                  variant="contained"
                  onClick={() => saveAndGo(mysteryCart())}
                  sx={{ alignSelf: 'flex-start', minHeight: 48, px: 3, borderRadius: '999px', textTransform: 'none', fontWeight: 800, bgcolor: BRAND_GREEN, '&:hover': { bgcolor: BRAND_GREEN_HOVER } }}
                >
                  La quiero
                </Button>
              </Stack>
            </Box>

            <Typography sx={{ fontWeight: 800, color: '#5c4d57' }}>
              En estos tres eliges modelo de lisos y estampados. El regalo sin absorbente es sorpresa.
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2 }}>
              {ANIV_ECOPIPO_PACKS.map((pack) => (
                <Box key={pack.id} sx={{ bgcolor: '#fff', borderRadius: '28px', p: 2, display: 'flex', flexDirection: 'column', gap: 1.25, boxShadow: '0 12px 32px rgba(77,33,88,0.06)' }}>
                  <Typography component="h3" sx={{ fontWeight: 900, fontSize: 26 }}>{pack.name}</Typography>
                  <Typography sx={{ color: '#7a6a74', textDecoration: 'line-through' }}>De {money(pack.priceOriginal)}</Typography>
                  <Typography sx={{ fontWeight: 900, fontSize: 36, color: pack.color === 'green' ? BRAND_GREEN : BRAND_PURPLE, lineHeight: 1 }}>
                    {money(pack.priceDiscounted)}
                  </Typography>
                  <Includes
                    items={[
                      `${pack.lisos} pañales premium lisos`,
                      `${pack.estampados} pañales premium estampados`,
                      pack.wetbag ? '1 bolsa impermeable, tú eliges el estampado' : 'Sin bolsa',
                      '1 filtro de bambú y 1 detergente',
                      `De regalo: ${pack.id === 'pack1' ? 1 : pack.id === 'pack2' ? 2 : 3} estampado sin absorbente, sorpresa`,
                    ]}
                  />
                  <Button
                    variant="contained"
                    onClick={() => setPackWizard(pack)}
                    sx={{
                      mt: 'auto',
                      minHeight: 48,
                      borderRadius: '999px',
                      textTransform: 'none',
                      fontWeight: 800,
                      bgcolor: pack.color === 'green' ? BRAND_GREEN : BRAND_PURPLE,
                      '&:hover': { bgcolor: pack.color === 'green' ? BRAND_GREEN_HOVER : BRAND_PURPLE_HOVER },
                    }}
                  >
                    Armar {pack.name}
                  </Button>
                </Box>
              ))}
            </Box>
          </Stack>
        ) : (
          <Stack spacing={2.5}>
            <Typography sx={{ color: '#5c4d57' }}>
              Eliges el estampado de Regular, Teen y Nocturna. Pantiprotector, panti y pañoleta llegan al azar.
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
              {towels.map((pack) => {
                const upgraded = pack17[pack.id]
                const price = upgraded ? pack.up : pack.base
                return (
                  <Box key={pack.id} sx={{ bgcolor: '#fff', borderRadius: '28px', p: 2, display: 'flex', flexDirection: 'column', gap: 1.25, boxShadow: '0 12px 32px rgba(142,36,88,0.06)' }}>
                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
                      {pack.photos.map((src) => (
                        <Box key={src} component="img" src={src} alt="" sx={{ width: '100%', aspectRatio: '1', objectFit: 'contain', bgcolor: '#fff7fb', borderRadius: '16px' }} />
                      ))}
                    </Box>
                    <Typography component="h3" sx={{ fontWeight: 900, fontSize: 22 }}>{pack.name}</Typography>
                    <Typography sx={{ color: '#7a6a74', textDecoration: 'line-through' }}>De {money(pack.baseWas)}</Typography>
                    <Typography sx={{ fontWeight: 900, fontSize: 36, color: LUBELLA_DEEP, lineHeight: 1 }}>{money(price)}</Typography>
                    <Button
                      onClick={() => setPack17((prev) => ({ ...prev, [pack.id]: !prev[pack.id] }))}
                      aria-pressed={upgraded}
                      sx={{
                        minHeight: 48,
                        borderRadius: '16px',
                        textTransform: 'none',
                        fontWeight: 800,
                        justifyContent: 'flex-start',
                        color: upgraded ? '#fff' : LUBELLA_DEEP,
                        bgcolor: upgraded ? LUBELLA : '#fff',
                        border: `2px solid ${LUBELLA}`,
                        '&:hover': { bgcolor: upgraded ? LUBELLA : '#fff5fa' },
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
                          slots: [
                            { key: 'day', title: `Elige ${pack.day} Regular o Teen`, count: pack.day, parents: [PARENT.TOALLA_REGULAR, PARENT.TOALLA_TEEN] },
                            { key: 'night', title: `Elige ${pack.night} Nocturnas`, count: pack.night, parents: [PARENT.TOALLA_NOCTURNA] },
                          ],
                        })
                      }
                      sx={{ mt: 'auto', minHeight: 48, borderRadius: '999px', textTransform: 'none', fontWeight: 800, bgcolor: LUBELLA, '&:hover': { bgcolor: LUBELLA_DEEP } }}
                    >
                      Armar este pack
                    </Button>
                  </Box>
                )
              })}
            </Box>

            <Typography component="h2" sx={{ fontWeight: 900, fontSize: 28 }}>Calzones</Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
              {[
                {
                  id: 'prueba' as const,
                  name: 'Pack prueba',
                  note: '2 calzones',
                  was: 909,
                  price: 799,
                  items: ['1 Ligero o Moderado', '1 Moderado o Abundante'],
                  slots: [
                    { key: 'ligero', title: 'Elige 1 Ligero o Moderado', count: 1, parents: [...PARENT.CALZON_LIGERO] },
                    { key: 'abundante', title: 'Elige 1 Moderado o Abundante', count: 1, parents: [...PARENT.CALZON_ABUNDANTE] },
                  ],
                },
                {
                  id: 'completo' as const,
                  name: 'Pack completo',
                  note: 'El quinto va en el precio',
                  was: 2228,
                  price: 1818,
                  items: ['3 Ligero o Moderado, uno es el de regalo', '2 Moderado o Abundante'],
                  slots: [
                    { key: 'ligero', title: 'Elige 3 Ligero o Moderado', count: 3, parents: [...PARENT.CALZON_LIGERO] },
                    { key: 'abundante', title: 'Elige 2 Moderado o Abundante', count: 2, parents: [...PARENT.CALZON_ABUNDANTE] },
                  ],
                },
              ].map((pack) => (
                <Box key={pack.id} sx={{ bgcolor: '#fff', borderRadius: '28px', p: 2, display: 'flex', flexDirection: 'column', gap: 1.25, boxShadow: '0 12px 32px rgba(142,36,88,0.06)' }}>
                  <Box component="img" src="/imgs/calzon.png" alt="Calzón Lubella" sx={{ width: '100%', maxHeight: 220, objectFit: 'contain' }} />
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
                        slots: pack.slots,
                      })
                    }
                    sx={{ mt: 'auto', minHeight: 48, borderRadius: '999px', textTransform: 'none', fontWeight: 800, bgcolor: LUBELLA, '&:hover': { bgcolor: LUBELLA_DEEP } }}
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
            if (lubellaFlow.id === 'prueba' || lubellaFlow.id === 'completo') {
              saveAndGo(
                calzonCart({
                  id: lubellaFlow.id,
                  ligero: picked.ligero || [],
                  abundante: picked.abundante || [],
                })
              )
            }
          }}
        />
      )}
    </Box>
  )
}
