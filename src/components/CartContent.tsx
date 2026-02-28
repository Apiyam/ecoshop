'use client'

import {
  Typography,
  Table,
  Box,
  IconButton,
  Button,
  Alert,
} from '@mui/joy'
import { useEffect, useState } from 'react'
import { ArrowBack, DeleteForever } from '@mui/icons-material'
import QuantitySelector from './QuantitySelector'
import { useCart } from '../context/CartContext'
import { ProductItem } from '../lib/wooApi'
import ConfirmationModal from './ConfirmationModal'
import { BRAND_GREEN, BRAND_GREEN_HOVER, BRAND_PURPLE, BRAND_PURPLE_HOVER } from '@/lib/constants'

type CartContentProps = {
  onClose: () => void
}

export default function CartContent({ onClose }: CartContentProps) {
  const { cartItems, removeFromCart, clearCart, currentDiscount } = useCart()
  const [clearCartModal, setClearCartModal] = useState(false)
  const [goingToWordpress, setGoingToWordpress] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

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

  const getTotal = () =>
    cartItems.reduce((acc, item) => acc + getDiscountedPrice(item.product) * item.quantity, 0)

  const goToWordpress = () => {
    setGoingToWordpress(true)
    const data = encodeURIComponent(
      JSON.stringify(cartItems.map((i) => ({ id: i.product.id, quantity: i.quantity })))
    )
    window.location.href = `https://ecopipo.com/matriz/?redirect=ecopipo&items=${data}`
  }

  return (
    <>
      <Typography level="h4" m={0}>
        Carrito de compras Ecopipo
      </Typography>
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
                    No hay productos en el carrito.
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

      {cartItems.length > 0 && (
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
            message="Esto eliminará todos los productos del carrito."
            onCancel={() => setClearCartModal(false)}
            onConfirm={() => {
              clearCart()
              setClearCartModal(false)
              onClose()
            }}
          />
        </Box>
      )}
    </>
  )
}
