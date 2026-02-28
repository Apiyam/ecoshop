import * as React from 'react'
import { Box, Button, IconButton } from '@mui/joy'
import { ShoppingCart, Visibility } from '@mui/icons-material'
import { ProductItem } from '../lib/wooApi'
import QuantitySelector from './QuantitySelector'
import { useCart } from '../context/CartContext'
import { useEffect, useState } from 'react'
import { BRAND_GREEN, BRAND_GREEN_HOVER, BRAND_PURPLE, BRAND_PURPLE_HOVER } from '@/lib/constants'

type ProductActionsProps = {
  onViewDetails: () => void
  product: ProductItem
  overrideActions?: boolean
}

export default function ProductActions({ onViewDetails, product, overrideActions }: ProductActionsProps) {
  const { addToCart, updatedCart } = useCart()
  const [addedToCart, setAddedToCart] = useState(false)
  useEffect(() => {
    if (updatedCart) setAddedToCart(true)
  }, [updatedCart])

  const addOne = () => {
    addToCart({ product, quantity: 1 })
    setAddedToCart(true)
  }

  if (overrideActions) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
        <QuantitySelector product={product} />
        <Button
          size="sm"
          variant="outlined"
          onClick={onViewDetails}
          startDecorator={<Visibility />}
          sx={{
            py: 0.5,
            px: 1,
            minHeight: 32,
            borderRadius: 'md',
            borderColor: BRAND_PURPLE,
            color: BRAND_PURPLE,
            fontSize: '0.8rem',
            '&:hover': { borderColor: BRAND_PURPLE_HOVER, bgcolor: 'rgba(115,48,128,0.08)' },
          }}
        >
          Ver más
        </Button>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 0.5,
        mt: 0.5,
        pt: 0.5,
        borderTop: '1px solid',
        borderColor: 'neutral.outlinedBorder',
      }}
    >
      <IconButton
        aria-label="Añadir al carrito"
        variant="solid"
        color="neutral"
        disabled={product.stock === 0 || product.stock === null}
        onClick={addOne}
        sx={{
          width: 36,
          height: 36,
          borderRadius: '50%',
          bgcolor: BRAND_GREEN,
          color: 'white',
          '&:hover': { bgcolor: BRAND_GREEN_HOVER },
        }}
      >
        <ShoppingCart sx={{ fontSize: 18 }} />
      </IconButton>
      <IconButton
        aria-label="Ver detalles del producto"
        size="sm"
        variant="outlined"
        color="neutral"
        onClick={onViewDetails}
        sx={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          borderColor: BRAND_PURPLE,
          color: BRAND_PURPLE,
          '&:hover': { borderColor: BRAND_PURPLE_HOVER, bgcolor: 'rgba(115,48,128,0.1)' },
        }}
      >
        <Visibility sx={{ fontSize: 16 }} />
      </IconButton>
    </Box>
  )
}