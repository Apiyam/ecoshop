import * as React from 'react'
import { Box, Button, IconButton } from '@mui/joy'
import { ShoppingCart, Visibility } from '@mui/icons-material'
import { ProductItem } from '../lib/wooApi'
import QuantitySelector from './QuantitySelector'
import { useCart } from '../context/CartContext'
import { useEffect, useState } from 'react'
import Notification from './Notification'
import { BRAND_GREEN, BRAND_GREEN_HOVER, BRAND_PURPLE, BRAND_PURPLE_HOVER } from '@/lib/constants'

type ProductActionsProps = {
  onViewDetails: () => void,
  product: ProductItem
  overrideActions?: boolean
}

export default function ProductActions({ onViewDetails, product, overrideActions }: ProductActionsProps) {
  const { addToCart, updatedCart, setShouldDisplayCart } = useCart()
  const [addedToCart, setAddedToCart] = useState(false)
  useEffect(() => {
    if (updatedCart) {
      setAddedToCart(true)
    }
  }, [updatedCart])
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        borderTopLeftRadius: '12px',
        borderTopRightRadius: '12px',
        
        gap: 1,
      }}
    >
      <Box sx={{ display: 'flex', flexDirection:{xs: overrideActions ? 'column' : 'row', sm: 'row'}, justifyContent: 'flex-start', alignItems: 'flex-start', gap: 1 }}>
      {overrideActions ? 
      <QuantitySelector product={product} /> : (
        <Button
          startDecorator={<ShoppingCart />}
          variant="solid"
          disabled={product.stock === 0 || product.stock === null}
          onClick={() => {
            addToCart({ product: product, quantity: 1 })
            setAddedToCart(true)
            setShouldDisplayCart(true)
          }}
          sx={{
            width: '50%',
            minHeight: 44,
            borderRadius: '12px',
            bgcolor: BRAND_GREEN,
            color: 'white',
            fontWeight: 600,
            boxShadow: '0 2px 8px rgba(137,179,41,0.3)',
            transition: 'all 0.2s ease',
            '&:hover': {
              bgcolor: BRAND_GREEN_HOVER,
              transform: 'translateY(-1px)',
              boxShadow: '0 4px 12px rgba(137,179,41,0.4)',
            },
          }}
        >
          Comprar
        </Button>
      )}
      {/* addedToCart && (
        <Notification message="El carrito ha sido actualizado" open={addedToCart} onClose={() => setAddedToCart(false)} />
      ) */}
      <Button
        startDecorator={<Visibility />}
        variant="outlined"
        onClick={onViewDetails}
        sx={{
          width: { xs: overrideActions ? '100%' : '50%', sm: '50%' },
          minHeight: 44,
          borderRadius: '12px',
          borderColor: BRAND_PURPLE,
          color: BRAND_PURPLE,
          fontWeight: 600,
          '&:hover': {
            borderColor: BRAND_PURPLE_HOVER,
            bgcolor: 'rgba(115,48,128,0.08)',
            transform: 'translateY(-1px)',
          },
        }}
      >
        Detalles
      </Button>
      </Box>
    </Box>
  )
}