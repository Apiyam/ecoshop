'use client'

import {
  Typography,
  Table,
  Box,
  IconButton,
  Button,
  Alert,
  Modal,
  ModalDialog,
  ModalClose,
  Chip,
  Stack,
  Grid,
} from '@mui/joy'
import { Badge } from '@mui/material'
import { useEffect, useState } from 'react'
import { ArrowBack, DeleteForever, Visibility, Edit, RemoveShoppingCart } from '@mui/icons-material'
import QuantitySelector from './QuantitySelector'
import { useCart } from '../context/CartContext'
import { ProductItem } from '../lib/wooApi'
import ConfirmationModal from './ConfirmationModal'
import { BRAND_GREEN, BRAND_GREEN_HOVER, BRAND_PURPLE, BRAND_PURPLE_HOVER } from '@/lib/constants'
import { PACK_SELECTION_STORAGE_KEY } from '@/app/back-expo-nacional/types'
import type { ExpoPack } from '@/app/back-expo-nacional/types'
import PackWizard from '@/app/back-expo-nacional/PackWizard'

type CartContentProps = {
  onClose: () => void
}

function getDisplayName(p: ProductItem): string {
  let n = p.name.replace(/6 Meses - 6 Años/gi, '').trim()
  const parent = (p.parent_name || '').replace(/^Privado:\s*/i, '').trim()
  if (parent && n.toLowerCase().startsWith(parent.toLowerCase())) {
    n = n.slice(parent.length).replace(/^[\s\-–]+/, '').trim()
  }
  return n || p.name
}

export default function CartContent({ onClose }: CartContentProps) {
  const { cartItems, packInCart, removeFromCart, removePackFromCart, clearCart, currentDiscount } = useCart()
  const [clearCartModal, setClearCartModal] = useState(false)
  const [removePackModal, setRemovePackModal] = useState(false)
  const [packDetailsOpen, setPackDetailsOpen] = useState(false)
  const [editWizardPack, setEditWizardPack] = useState<ExpoPack | null>(null)
  const [goingToWordpress, setGoingToWordpress] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  const IMG_PLACEHOLDER = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRU34ZGC6H9BGPDorU8aNG2P8ark14cj0DqOA&'

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsMobile(window.innerWidth < 600)
    }
  }, [])

  const getDiscountedPrice = (product: ProductItem) => {
    let discount = currentDiscount
    if (product.name.includes('Tanga')) discount = 50
    if (product.name.includes('Mystery')) discount = 0
    if (product.name.includes('Leggings')) discount = 70
    if (product.name.includes('Pañoleta')) discount = 70
    if (product.name.includes('Mochila')) discount = 40
    if (product.name.includes('Lonchera')) discount = 35
    return parseFloat(product.public_price) * (1 - discount / 100)
  }

  const getTotal = () => {
    const itemsTotal = cartItems.reduce((acc, item) => acc + getDiscountedPrice(item.product) * item.quantity, 0)
    const packTotal = packInCart ? packInCart.pack.priceDiscounted : 0
    return itemsTotal + packTotal
  }

  const goToWordpress = () => {
    setGoingToWordpress(true)

    type ItemPayload = { id: number; quantity: number; kit?: boolean }
    const items: ItemPayload[] = []

    if (packInCart) {
      const byId = (arr: { id: number }[]) =>
        arr.reduce<Record<number, number>>((acc, p) => {
          acc[p.id] = (acc[p.id] ?? 0) + 1
          return acc
        }, {})
      const lisosQty = byId(packInCart.selectedLisos)
      const estampadosQty = byId(packInCart.selectedEstampados)
      Object.entries(lisosQty).forEach(([id, qty]) => {
        items.push({ id: Number(id), quantity: qty, kit: true })
      })
      Object.entries(estampadosQty).forEach(([id, qty]) => {
        items.push({ id: Number(id), quantity: qty, kit: true })
      })
      if (packInCart.selectedWetbag) {
        items.push({ id: packInCart.selectedWetbag.id, quantity: 1, kit: true })
      }
      items.push({ id: 4723, quantity: 1, kit: true }) // Filtro bambú (producto enviado a WordPress)
      items.push({ id: 4942, quantity: 1, kit: true }) // Detergente (producto enviado a WordPress)
    }

    cartItems.forEach((i) => {
      items.push({ id: i.product.id, quantity: i.quantity })
    })

    const data = encodeURIComponent(JSON.stringify(items))
    const base = `https://ecopipo.com/matriz/?redirect=ecopipo&items=${data}`
    const url = packInCart
      ? `${base}&kitTotal=${packInCart.pack.priceDiscounted}`
      : base
    window.location.href = url
  }

  const hasAnything = cartItems.length > 0 || !!packInCart

  const handleEditarPack = () => {
    if (!packInCart) return
    const payload = {
      lisos: packInCart.selectedLisos.map((p) => p.id),
      estampados: packInCart.selectedEstampados.map((p) => p.id),
      wetbagId: packInCart.selectedWetbag?.id ?? null,
    }
    sessionStorage.setItem(PACK_SELECTION_STORAGE_KEY(packInCart.pack.id), JSON.stringify(payload))
    //onClose()
    setEditWizardPack(packInCart.pack)
  }

  return (
    <>
      <Typography level="h4" m={0}>
        Carrito de compras Ecopipo
      </Typography>
      {packInCart && (
        <Box
          sx={{
            mb: 2,
            p: 2,
            borderRadius: 'md',
            border: '1px solid',
            borderColor: 'neutral.outlinedBorder',
            bgcolor: 'neutral.softBg',
          }}
        >
          <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1, mb: 2 }}>
            <Typography fontWeight="lg">{packInCart.pack.name}</Typography>
            <Chip size="sm" color="primary" variant="soft">Paquete especial</Chip>
            <Typography sx={{ ml: 'auto' }}>
              {packInCart.pack.priceDiscounted.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}
            </Typography>
          </Box>
          <Grid container spacing={1} direction="row" justifyContent="flex-end">
            <Button
              size="sm"
              variant="outlined"
              startDecorator={<Visibility />}
              onClick={() => setPackDetailsOpen(true)}
            >
              Detalles
            </Button>
            <Button
              size="sm"
              variant="outlined"
              startDecorator={<Edit />}
              onClick={handleEditarPack}
            >
              Editar
            </Button>
            <Button
              size="sm"
              variant="outlined"
              color="danger"
              startDecorator={<RemoveShoppingCart />}
              onClick={() => setRemovePackModal(true)}
            >
              Eliminar
            </Button>
          </Grid>
          <ConfirmationModal
            open={removePackModal}
            title="¿Quitar paquete?"
            message="El paquete especial se quitará del carrito. Podrás volver a elegirlo desde la página de packs."
            onCancel={() => setRemovePackModal(false)}
            onConfirm={() => {
              removePackFromCart()
              setRemovePackModal(false)
            }}
          />
        </Box>
      )}

      <Box
        sx={{
          overflowX: 'auto',
          border: '1px solid',
          borderColor: 'neutral.outlinedBorder',
          maxHeight: '70vh',
          minHeight: '230px',
        }}
      >
        <Table stickyHeader>
          {!isMobile && (
            <thead>
              <tr>
                {!isMobile && <th></th>}
                <th style={{ width: '150px' }}>Producto</th>
                {!isMobile && (
                  <>
                    <th>Cantidad</th>
                    <th>Precio</th>
                    <th>Total</th>
                  </>
                )}
                <th></th>
              </tr>
            </thead>
          )}
          <tbody>
            {cartItems.length === 0 ? (
              <tr>
                <td colSpan={6}>
                  <Typography sx={{ py: 2, textAlign: 'center' }}>
                    {packInCart ? 'No hay otros productos en el carrito.' : 'No hay productos en el carrito.'}
                  </Typography>
                </td>
              </tr>
            ) : (
              cartItems.map(({ product, quantity }) => {
                const price = getDiscountedPrice(product)
                return isMobile ? (
                  <tr key={product.id} style={{ width: '100%', marginBottom: '0' }}>
                    <td colSpan={6}>
                      <table style={{ width: '100%', borderBottom: '1px solid #e0e0e0' }}>
                        <tbody>
                          <tr>
                            <td colSpan={4} style={{ borderBottom: 'none' }}>
                              <img
                                src={product.images}
                                alt={product.name}
                                style={{
                                  width: 48,
                                  height: 48,
                                  borderRadius: '8px',
                                  marginRight: '10px',
                                  float: 'left',
                                }}
                              />
                              <Typography fontWeight="md" sx={{ marginTop: '10px' }}>
                                {product.name}
                              </Typography>
                            </td>
                          </tr>
                          <tr style={{ borderTop: 'none' }}>
                            <td>
                              <QuantitySelector product={product} simple />
                            </td>
                            <td>
                              <Typography>
                                {(price * quantity).toLocaleString('es-MX', {
                                  style: 'currency',
                                  currency: 'MXN',
                                })}
                              </Typography>
                            </td>
                            <td>
                              <IconButton
                                size="sm"
                                color="danger"
                                onClick={() => removeFromCart(product.id)}
                              >
                                <DeleteForever />
                              </IconButton>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                ) : (
                  <tr key={product.id}>
                    <td>
                      <Box
                        component="img"
                        src={product.images}
                        alt={product.name}
                        sx={{ width: 48, height: 48, borderRadius: 'md' }}
                      />
                    </td>
                    <td>
                      <Typography>{product.name}</Typography>
                    </td>
                    <td>
                      <QuantitySelector product={product} simple />
                    </td>
                    <td>
                      <Typography>
                        {price.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}
                      </Typography>
                    </td>
                    <td>
                      <Typography>
                        {(price * quantity).toLocaleString('es-MX', {
                          style: 'currency',
                          currency: 'MXN',
                        })}
                      </Typography>
                    </td>
                    <td>
                      <IconButton
                        size="sm"
                        color="danger"
                        onClick={() => removeFromCart(product.id)}
                      >
                        <DeleteForever />
                      </IconButton>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </Table>
      </Box>

      {hasAnything && (
        <Box sx={{ mt: 2 }}>
          {goingToWordpress && (
            <Alert color="primary" variant="soft" sx={{ mb: 2 }}>
              <Typography fontWeight="lg">Vas a ser redirigido para pagar.</Typography>
            </Alert>
          )}
          {!goingToWordpress && (
            <>
              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  flexDirection: { xs: 'column', sm: 'row' },
                }}
              >
                <Button
                  fullWidth
                  onClick={goToWordpress}
                  sx={{
                    minHeight: 44,
                    borderRadius: '12px',
                    bgcolor: BRAND_GREEN,
                    color: 'white',
                    fontWeight: 600,
                    boxShadow: '0 2px 8px rgba(137,179,41,0.3)',
                    '&:hover': {
                      bgcolor: BRAND_GREEN_HOVER,
                      transform: 'translateY(-1px)',
                    },
                  }}
                >
                  Ir a pagar:{' '}
                  {getTotal().toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => setClearCartModal(true)}
                  sx={{
                    minHeight: 44,
                    borderRadius: '12px',
                    borderColor: BRAND_PURPLE,
                    color: BRAND_PURPLE,
                    '&:hover': {
                      borderColor: BRAND_PURPLE_HOVER,
                      bgcolor: 'rgba(115,48,128,0.08)',
                    },
                  }}
                >
                  Limpiar carrito
                </Button>
              </Box>
              <Button
                startDecorator={<ArrowBack />}
                fullWidth
                variant="outlined"
                onClick={onClose}
                sx={{
                  mt: 2,
                  minHeight: 44,
                  borderRadius: '12px',
                  borderColor: 'neutral.outlinedBorder',
                  '&:hover': { bgcolor: 'neutral.softBg' },
                }}
              >
                Continuar comprando
              </Button>
              <Typography sx={{ fontSize: '12px', mt: 1 }}>
                *Precios de envío y descuentos adicionales se calculan en el siguiente paso.
              </Typography>
            </>
          )}
          <ConfirmationModal
            open={clearCartModal}
            title="¿Estás seguro?"
            message="Esto eliminará todos los productos y el paquete especial del carrito."
            onCancel={() => setClearCartModal(false)}
            onConfirm={() => {
              clearCart()
              setClearCartModal(false)
              onClose()
            }}
          />
        </Box>
      )}

      <Modal open={packDetailsOpen} onClose={() => setPackDetailsOpen(false)}>
        <ModalDialog sx={{ maxWidth: 440 }}>
          <ModalClose />
          <Typography level="h4" sx={{ mb: 0.5 }}>{packInCart?.pack.name ?? 'Paquete'}</Typography>
          <Typography level="h4" color="neutral" sx={{ mb: 2 }}>Contenido de tu paquete</Typography>
          {packInCart && (() => {
            const lisosGrouped = new Map<number, { product: ProductItem; count: number }>()
            packInCart.selectedLisos.forEach((p) => {
              const prev = lisosGrouped.get(p.id)
              if (prev) prev.count += 1
              else lisosGrouped.set(p.id, { product: p, count: 1 })
            })
            const estampadosGrouped = new Map<number, { product: ProductItem; count: number }>()
            packInCart.selectedEstampados.forEach((p) => {
              const prev = estampadosGrouped.get(p.id)
              if (prev) prev.count += 1
              else estampadosGrouped.set(p.id, { product: p, count: 1 })
            })
            const accent = packInCart.pack.color === 'green' ? BRAND_GREEN : BRAND_PURPLE
            return (
              <Box sx={{ px: 0.5 }}>
                {packInCart.selectedLisos.length > 0 && (
                  <>
                    <Typography level="body-md" sx={{ mb: 1, color: 'neutral.600' }}>
                      Lisos ({packInCart.selectedLisos.length})
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1, mb: 2 }}>
                      {Array.from(lisosGrouped.values()).map(({ product: p, count }) => (
                        <Badge
                          key={`liso-${p.id}`}
                          badgeContent={count > 1 ? count : undefined}
                          sx={{ '& .MuiBadge-badge': { fontSize: '0.7rem', minWidth: 18, height: 18, bgcolor: accent, color: 'white' } }}
                        >
                          <Box
                            component="img"
                            src={p.images || IMG_PLACEHOLDER}
                            alt={p.name}
                            sx={{ width: 56, height: 56, borderRadius: 8, objectFit: 'cover' }}
                          />
                        </Badge>
                      ))}
                    </Stack>
                  </>
                )}
                {packInCart.selectedEstampados.length > 0 && (
                  <>
                    <Typography level="body-md" sx={{ mb: 1, color: 'neutral.600' }}>
                      Estampados ({packInCart.selectedEstampados.length})
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1, mb: 2 }}>
                      {Array.from(estampadosGrouped.values()).map(({ product: p, count }) => (
                        <Badge
                          key={`estampado-${p.id}`}
                          badgeContent={count > 1 ? count : undefined}
                          sx={{ '& .MuiBadge-badge': { fontSize: '0.7rem', minWidth: 18, height: 18, bgcolor: accent, color: 'white' } }}
                        >
                          <Box
                            component="img"
                            src={p.images || IMG_PLACEHOLDER}
                            alt={p.name}
                            sx={{ width: 56, height: 56, borderRadius: 8, objectFit: 'cover' }}
                          />
                        </Badge>
                      ))}
                    </Stack>
                  </>
                )}
                {packInCart.selectedWetbag && (
                  <>
                    <Typography level="body-md" sx={{ mb: 1, color: 'neutral.600' }}>
                      Bolsa impermeable
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                      <Box
                        component="img"
                        src={packInCart.selectedWetbag.images || IMG_PLACEHOLDER}
                        alt={packInCart.selectedWetbag.name}
                        sx={{ width: 56, height: 56, borderRadius: 8, objectFit: 'cover' }}
                      />
                      <Typography level="body-md">{getDisplayName(packInCart.selectedWetbag)}</Typography>
                    </Stack>
                  </>
                )}
                <Typography level="body-md" sx={{ mb: 1, color: 'neutral.600' }}>
                  Filtro bambú y detergente
                </Typography>
                <Typography level="body-md" sx={{ mb: 2 }}>Incluidos en el pack</Typography>
                <Typography level="h4" sx={{ fontWeight: 700, color: accent }}>
                  Precio del pack: ${packInCart.pack.priceDiscounted.toLocaleString('es-MX')}
                </Typography>
              </Box>
            )
          })()}
        </ModalDialog>
      </Modal>

      {editWizardPack && (
        <PackWizard
          pack={editWizardPack}
          open={!!editWizardPack}
          onClose={() => setEditWizardPack(null)}
        />
      )}
    </>
  )
}
