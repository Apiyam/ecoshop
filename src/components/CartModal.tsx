'use client'

import {
  Modal, ModalDialog, Typography, Table, ModalClose, Box,
  IconButton, Button, Alert
} from '@mui/joy'
import { useEffect, useState } from 'react'
import { ArrowBack, DeleteForever } from '@mui/icons-material'
import QuantitySelector from './QuantitySelector'
import { useCart } from '../context/CartContext'
import { CategoryItem, getCategories, ProductItem } from '../lib/wooApi'
import ConfirmationModal from './ConfirmationModal'
import GoalProgress from '@/app/_components/ProgressGoal'

export default function CartModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { cartItems, removeFromCart, clearCart } = useCart()
  const [categories, setCategories] = useState<CategoryItem[]>([])
  const [clearCartModal, setClearCartModal] = useState(false)
  const [goingToWordpress, setGoingToWordpress] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const { currentDiscount } = useCart();
  useEffect(() => {
    getCategories().then((categories) => setCategories(categories))
    if (typeof window !== 'undefined') {
      setIsMobile(window.innerWidth < 600)
    }
  }, [])

  const getDiscountedPrice = (product: ProductItem) => {
    let discount = currentDiscount;
    
    if(product.name.includes("Tanga")) {
      discount = 50;
    }
    if(product.name.includes("Mystery")) {
      discount = 0;
    }
    if(product.name.includes("Leggings")) {
        discount = 70;
    }
    if(product.name.includes("Pañoleta")) {
        discount = 70;
    }
    if(product.name.includes("Mochila")) {
        discount = 40;
    }
    if(product.name.includes("Lonchera")) {
        discount = 35;
    }

    

    return parseFloat(product.public_price) * (1 - discount / 100)
  }

  const getTotal = () => cartItems.reduce((acc, item) =>
    acc + getDiscountedPrice(item.product) * item.quantity, 0)

  const goToWordpress = () => {
    setGoingToWordpress(true)
    const data = encodeURIComponent(JSON.stringify(cartItems.map(i => ({ id: i.product.id, quantity: i.quantity }))))
    window.location.href = `https://ecopipo.com/matriz/?redirect=ecopipo&items=${data}`
  }

  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog size="lg" sx={{ maxWidth: 1200, width: '98%', height: '65vh', marginTop: '20px' }}>
        <ModalClose />
        <Typography level="h4">Carrito de compras Ecopipo</Typography>
        <Box sx={{ overflowX: 'auto', border: '1px solid', borderColor: 'neutral.outlinedBorder', 
          maxHeight: '100vh', my: 2, minHeight: '300px' }}>
          <Table stickyHeader>
            {
              !isMobile && (
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
              )
            }
            <tbody>
              {cartItems.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <Typography sx={{ py: 2, textAlign: 'center' }}>No hay productos en el carrito.</Typography>
                  </td>
                </tr>
              ) : cartItems.map(({ product, quantity }) => {
                const price = getDiscountedPrice(product)
                return (
                  isMobile ? (
                    <tr key={product.id} style={{ width: '100%', marginBottom: '0' }}>
                      <table style={{ width: '100%' }}>
                        <tr>
                          <td colSpan={4}>
                            <img 
                            src={product.images}
                             alt={product.name} 
                             style={{ width: 48, height: 48, borderRadius: 'md', marginRight: '10px', float: 'left' }} />
                            
                            <Typography fontWeight="md" style={{ marginTop: '10px' }}>{product.name}</Typography>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <QuantitySelector product={product} simple />
                          </td>
                          <td>
                            <Typography>{(price * quantity).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</Typography>
                          </td>
                          <td>
                            <IconButton size="sm" color="danger" onClick={() => removeFromCart(product.id)}>
                              <DeleteForever />
                            </IconButton>
                          </td>
                        </tr>
                      </table>
                      
                      
                    </tr>
                  ) : (
                    <tr key={product.id}>
                    <td>
                        <Box component="img" src={product.images} alt={product.name} sx={{ width: 48, height: 48, borderRadius: 'md' }} />
                      </td>
                        <td><QuantitySelector product={product} simple /></td>
                        <td>
                        <Typography>{price.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</Typography>
                      </td>
                    
                    <td>
                      <Typography>{(price * quantity).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</Typography>
                    </td>
                    <td>
                      <IconButton size="sm" color="danger" onClick={() => removeFromCart(product.id)}>
                        <DeleteForever />
                      </IconButton>
                    </td>
                  </tr>
              )
                )
              })}
            </tbody>
          </Table>
        </Box>

        {cartItems.length > 0 && (
          <div>
            {goingToWordpress && (
              <Alert color="primary" variant="soft">
                <Typography fontWeight="lg">Vas a ser redirigido para pagar.</Typography>
              </Alert>
            )}
            {!goingToWordpress && (
              <div>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button fullWidth color="primary" onClick={goToWordpress}>
                  Ir a pagar: {getTotal().toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}
                </Button>
                <Button fullWidth variant="outlined" onClick={() => setClearCartModal(true)}>
                  Limpiar carrito
                </Button>
                
              </Box>
              <Button startDecorator={<ArrowBack />} sx={{ mt: 2 }} color="danger" fullWidth variant="outlined" onClick={() => onClose()}>
                  Continuar comprando
                </Button>
              <Typography sx={{ fontSize: '12px' }}>*Precios de envío y descuentos adicionales se calculan en el siguiente paso.</Typography>
              </div>
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
          </div>
        )}
      </ModalDialog>
    </Modal>
  )
}