'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Modal,
  Stack,
  Typography,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import { ProductItem } from '@/lib/wooApi'
import { WEBHOOK_URL } from '@/app/packs/types'
import { money } from '@/lib/aniversario'

export type SelectSlot = {
  key: string
  title: string
  count: number
  parents: number[]
}

type Props = {
  open: boolean
  title: string
  price: number
  accent: string
  slots: SelectSlot[]
  onClose: () => void
  onPay: (picked: Record<string, ProductItem[]>) => void
}

function shortName(product: ProductItem) {
  let name = product.name.replace(/6 Meses - 6 Años/gi, '').trim()
  const parent = (product.parent_name || '').replace(/^Privado:\s*/i, '').trim()
  if (parent && name.toLowerCase().startsWith(parent.toLowerCase())) {
    name = name.slice(parent.length).replace(/^[\s\-–]+/, '').trim()
  }
  return name || product.name
}

export default function AniversarioSelectWizard({ open, title, price, accent, slots, onClose, onPay }: Props) {
  const [products, setProducts] = useState<ProductItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [step, setStep] = useState(0)
  const [picked, setPicked] = useState<Record<string, ProductItem[]>>({})

  useEffect(() => {
    if (!open) return
    setStep(0)
    setPicked({})
    setLoading(true)
    setError(null)
    fetch(WEBHOOK_URL)
      .then((res) => res.json())
      .then((data: unknown) => setProducts(Array.isArray(data) ? (data as ProductItem[]) : []))
      .catch(() => setError('No se pudieron cargar los productos.'))
      .finally(() => setLoading(false))
  }, [open])

  const slot = slots[step]
  const isSummary = step >= slots.length
  const current = slot ? picked[slot.key] || [] : []

  const options = useMemo(() => {
    if (!slot) return []
    return products
      .filter((product) => slot.parents.includes(Number(product.parent)) && (product.stock ?? 0) > 0)
      .sort((a, b) => shortName(a).localeCompare(shortName(b), 'es'))
  }, [products, slot])

  const add = (product: ProductItem) => {
    if (!slot) return
    setPicked((prev) => {
      const list = prev[slot.key] || []
      const countThis = list.filter((item) => item.id === product.id).length
      if (list.length >= slot.count || countThis >= Math.max(0, product.stock ?? 0)) return prev
      return { ...prev, [slot.key]: [...list, product] }
    })
  }

  const remove = (product: ProductItem) => {
    if (!slot) return
    setPicked((prev) => {
      const list = prev[slot.key] || []
      const index = list.findIndex((item) => item.id === product.id)
      if (index < 0) return prev
      return { ...prev, [slot.key]: [...list.slice(0, index), ...list.slice(index + 1)] }
    })
  }

  const canNext = !!slot && current.length === slot.count

  return (
    <Modal open={open} onClose={onClose} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 8 }}>
      <Box
        sx={{
          bgcolor: '#fff',
          borderRadius: 3,
          maxWidth: 480,
          width: '100%',
          maxHeight: '85vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          mx: 1,
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 1.5, borderBottom: '1px solid #eee' }}>
          <IconButton onClick={step === 0 ? onClose : () => setStep((value) => value - 1)} aria-label={step === 0 ? 'Cerrar' : 'Atrás'}>
            {step === 0 ? <CloseIcon /> : <ArrowBackIosNewIcon fontSize="small" />}
          </IconButton>
          <Typography sx={{ fontWeight: 800, textAlign: 'center' }}>{isSummary ? 'Resumen' : slot?.title}</Typography>
          <Box sx={{ width: 40 }} />
        </Stack>
        <Box sx={{ overflow: 'auto', flex: 1, py: 2, px: 1 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
              <CircularProgress sx={{ color: accent }} />
            </Box>
          ) : error ? (
            <Typography sx={{ textAlign: 'center', px: 2 }}>{error}</Typography>
          ) : isSummary ? (
            <Stack spacing={1.5} sx={{ px: 1.5 }}>
              <Typography sx={{ fontWeight: 900, fontSize: 22 }}>{title}</Typography>
              <Typography sx={{ fontWeight: 900, fontSize: 32, color: accent }}>{money(price)}</Typography>
              {slots.map((item) => (
                <Box key={item.key}>
                  <Typography sx={{ fontWeight: 800, mb: 0.5 }}>{item.title}</Typography>
                  {(picked[item.key] || []).map((product, index) => (
                    <Typography key={`${product.id}-${index}`} sx={{ fontSize: 14, color: '#444' }}>
                      {shortName(product)}
                    </Typography>
                  ))}
                </Box>
              ))}
              <Typography sx={{ fontSize: 13, color: '#666' }}>
                Los regalos de diseño sorpresa los elige la tienda.
              </Typography>
              <Button
                variant="contained"
                onClick={() => onPay(picked)}
                sx={{ minHeight: 48, borderRadius: '999px', textTransform: 'none', fontWeight: 800, bgcolor: accent, '&:hover': { bgcolor: accent } }}
              >
                Agregar al carrito
              </Button>
            </Stack>
          ) : (
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1.5 }}>
              {options.map((product) => {
                const countThis = current.filter((item) => item.id === product.id).length
                const canAdd = current.length < (slot?.count || 0) && countThis < Math.max(0, product.stock ?? 0)
                return (
                  <Box key={product.id} sx={{ borderRadius: 2, overflow: 'hidden', border: countThis ? `3px solid ${accent}` : '1px solid #eee' }}>
                    <Box
                      component="img"
                      src={product.images || '/imgs/pads.png'}
                      alt={shortName(product)}
                      sx={{
                        width: '100%',
                        aspectRatio: '1',
                        objectFit: 'contain',
                        bgcolor: '#fff',
                        border: '4px solid #fff',
                        boxSizing: 'border-box',
                      }}
                    />
                    <Box sx={{ p: 0.75, textAlign: 'center' }}>
                      <Typography sx={{ fontSize: 12, minHeight: 32, lineHeight: 1.2 }}>{shortName(product)}</Typography>
                      <Stack direction="row" justifyContent="center" alignItems="center" spacing={0.5}>
                        <IconButton size="small" disabled={!countThis} onClick={() => remove(product)} aria-label="Quitar">
                          <RemoveIcon fontSize="small" />
                        </IconButton>
                        <Typography sx={{ fontWeight: 800, minWidth: 16 }}>{countThis}</Typography>
                        <IconButton size="small" disabled={!canAdd} onClick={() => add(product)} aria-label="Sumar">
                          <AddIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                      <Typography sx={{ fontSize: 11, color: '#777' }}>
                        {current.length}/{slot?.count}
                      </Typography>
                    </Box>
                  </Box>
                )
              })}
              {!options.length && (
                <Typography sx={{ gridColumn: '1 / -1', textAlign: 'center', py: 4 }}>No hay piezas con existencia en este grupo.</Typography>
              )}
            </Box>
          )}
        </Box>
        {!loading && !error && !isSummary && (
          <Box sx={{ p: 2, borderTop: '1px solid #eee' }}>
            <Button
              fullWidth
              variant="contained"
              disabled={!canNext}
              onClick={() => setStep((value) => value + 1)}
              endIcon={<ArrowForwardIosIcon />}
              sx={{ minHeight: 48, fontWeight: 800, bgcolor: accent, textTransform: 'none', '&:hover': { bgcolor: accent } }}
            >
              Siguiente
            </Button>
          </Box>
        )}
      </Box>
    </Modal>
  )
}
