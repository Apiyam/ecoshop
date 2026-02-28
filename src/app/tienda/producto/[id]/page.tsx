'use client'

import { useParams, useRouter } from 'next/navigation'
import { ProductProvider, useProducts } from '@/context/ProductContext'
import {
  Box,
  Typography,
  AspectRatio,
  Sheet,
  Chip,
  Button,
  Container,
} from '@mui/joy'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import { ProductItem } from '@/lib/wooApi'
import { BRAND_PURPLE } from '@/lib/constants'
import LoadingIndicator from '@/components/LoadingIndicator'
import QuantitySelector from '@/components/QuantitySelector'
import { checkDiscount } from '@/lib/productDiscount'

function ProductDetailContent() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id != null ? Number(params.id) : NaN
  const { products, loaded } = useProducts()
  const product = loaded && products ? products.find((p: ProductItem) => p.id === id) : undefined
  const discount = product ? checkDiscount(product) : 0

  if (!loaded || !products) return <LoadingIndicator isFullScreen />
  if (!product) {
    return (
      <Container sx={{ py: 4, textAlign: 'center' }}>
        <Typography level="h4">Producto no encontrado</Typography>
        <Button
          startDecorator={<ArrowBackIosNewIcon />}
          variant="outlined"
          onClick={() => router.back()}
          sx={{ mt: 2 }}
        >
          Volver
        </Button>
      </Container>
    )
  }

  const { name, images, public_price, description, stock } = product

  return (
    <Container sx={{ py: 2, pb: 6 }}>
      <Button
        startDecorator={<ArrowBackIosNewIcon />}
        variant="plain"
        color="neutral"
        onClick={() => router.back()}
        sx={{ mb: 2 }}
      >
        Volver
      </Button>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3 }}>
        <Box sx={{ position: 'relative', flex: 1 }}>
          {discount > 0 && (
            <Box
              sx={{
                position: 'absolute',
                top: 8,
                left: 8,
                backgroundColor: BRAND_PURPLE,
                color: '#fff',
                px: 1.5,
                py: 0.5,
                borderRadius: 'md',
                fontSize: 'sm',
                fontWeight: 'bold',
                zIndex: 1,
              }}
            >
              -{discount}%
            </Box>
          )}
          <AspectRatio ratio="1" sx={{ minWidth: 280, borderRadius: 'lg', overflow: 'hidden' }}>
            <img src={images} alt={name} />
          </AspectRatio>
        </Box>

        <Sheet variant="plain" sx={{ flex: 2 }}>
          <Typography level="h3" sx={{ mb: 1 }}>
            {name}
          </Typography>
          <Chip color={stock === 0 || stock === null ? 'danger' : 'success'} sx={{ mb: 2 }}>
            {stock} {stock === 1 ? 'disponible' : 'disponibles'}
          </Chip>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            {discount > 0 && (
              <Typography sx={{ textDecoration: 'line-through', color: 'text.secondary' }}>
                {Number(public_price).toLocaleString('es-MX', {
                  style: 'currency',
                  currency: 'MXN',
                })}
              </Typography>
            )}
            <Typography level="title-lg">
              {Number(
                discount > 0 ? parseFloat(public_price) * (1 - discount / 100) : parseFloat(public_price)
              ).toLocaleString('es-MX', {
                style: 'currency',
                currency: 'MXN',
              })}
            </Typography>
          </Box>

          <QuantitySelector product={product} />

          <Box sx={{ overflow: 'auto', maxHeight: 300, mt: 2 }}>
            <Typography level="body-sm" sx={{ my: 1 }}>
              {description}
            </Typography>
          </Box>
        </Sheet>
      </Box>
    </Container>
  )
}

export default function ProductDetailPage() {
  return (
    <ProductProvider>
      <ProductDetailContent />
    </ProductProvider>
  )
}
