import { Card, Typography, AspectRatio, Chip, Box } from '@mui/joy'
import { ProductItem } from '../lib/wooApi'
import ProductActions from './ProductActions'
import { BRAND_GREEN } from '@/lib/constants'
import { useRouter } from 'next/navigation'

/** Nombre corto para variaciones: quita el nombre del padre/categoría para no repetir "Pañal Liso..." en cada card */
function getShortDisplayName(product: ProductItem): string {
  let n = product.name.replaceAll('6 Meses - 6 Años', '').trim()
  const parent = (product.parent_name || '').replace(/^Privado:\s*/i, '').trim()
  if (parent && n.toLowerCase().startsWith(parent.toLowerCase())) {
    n = n.slice(parent.length).replace(/^[\s\-–]+/, '').trim()
  }
  if (!n) return product.name.replaceAll('6 Meses - 6 Años', '').trim()
  return n
}

type ProductCardProps = {
  product: ProductItem
  viewMode: 'grid' | 'list'
  discount: number
  simple?: boolean
}

export default function ProductCard({ product, viewMode, discount, simple }: ProductCardProps) {
  const { name, images, public_price, stock, description } = product
  const router = useRouter()
  const displayName = getShortDisplayName(product)

  const goToDetailPage = () => {
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem('tienda_scroll', String(window.scrollY))
      } catch (_) {}
    }
    router.push(`/tienda/producto/${product.id}`)
  }

  if (viewMode === 'list') {
    return (
      <Box sx={{ width: '100%', position: 'relative' }}>
  {/* Globo de descuento */}
  {discount > 0 && (
    <Box
      sx={{
        position: 'absolute',
        top: 8,
        left: 8,
        backgroundColor: BRAND_GREEN,
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

  <Card
    variant="outlined"
    sx={{
      display: 'flex',
      flexDirection: { xs: 'column', sm: 'row' },
      gap: 1.5,
      width: '100%',
      p: 1.5,
      alignItems: 'flex-start',
    }}
  >
    <Box onClick={goToDetailPage} sx={{ cursor: 'pointer', flexShrink: 0 }}>
      <AspectRatio
        ratio="1"
        sx={{ width: { xs: '100%', sm: 120 }, borderRadius: 'md', overflow: 'hidden', '& img': { objectFit: 'contain' } }}
      >
        <img src={images} alt={name} loading="lazy" width={120} height={120} />
      </AspectRatio>
    </Box>

    <Box sx={{ flexGrow: 1 }}>
      <Typography level="title-md" onClick={goToDetailPage} sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
        {displayName}
      </Typography>
      {!simple && (
        <Typography level="body-sm" sx={{ my: 1 }}>
          {description.slice(0, 250)}...
        </Typography>
      )}
      <Chip
        variant="solid"
        color={stock > 0 ? 'success' : 'danger'}
        size="sm"
        sx={{ mb: 1 }}
      >
        {stock} {stock === 1 ? 'disponible' : 'disponibles'}
      </Chip>

      {/* Precios con descuento */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {discount > 0 && (
          <Typography sx={{ textDecoration: 'line-through', color: 'text.secondary' }}>
            {Number(public_price).toLocaleString('es-MX', {
              style: 'currency',
              currency: 'MXN',
            })}
          </Typography>
        )}
        <Typography fontWeight="lg">
          {Number(discount > 0 ? parseFloat(public_price) * (1 - discount / 100) : public_price).toLocaleString('es-MX', {
            style: 'currency',
            currency: 'MXN',
          })}
        </Typography>
      </Box>

      <Box sx={{ mt: 1 }}>
        <ProductActions onViewDetails={goToDetailPage} product={product} overrideActions />
      </Box>
    </Box>
  </Card>
</Box>
    )
  }

  // Vista grid: card compacta, foto completa, nombre corto, clic en nombre/foto va a detalle
  return (
    <Card
      variant="outlined"
      sx={{
        width: { xs: '100%', sm: 280 },
        position: 'relative',
        overflow: 'visible',
        p: 1,
        borderRadius: 2,
      }}
    >
      {discount > 0 && (
        <Box
          sx={{
            position: 'absolute',
            top: 4,
            right: 4,
            backgroundColor: BRAND_GREEN,
            color: '#fff',
            px: 1,
            py: 0.25,
            borderRadius: 'md',
            fontSize: 'xs',
            fontWeight: 'bold',
            zIndex: 1,
          }}
        >
          -{discount}%
        </Box>
      )}

      <Box
        onClick={goToDetailPage}
        sx={{ cursor: 'pointer', '&:hover': { opacity: 0.9 } }}
      >
        <Typography level="title-sm" sx={{ mb: 0.5, px: 0.5 }} noWrap title={name}>
          {displayName}
        </Typography>
        <Chip variant="solid" color={stock > 0 ? 'success' : 'danger'} size="sm" sx={{ mb: 0.5 }}>
          {stock} {stock === 1 ? 'disponible' : 'disponibles'}
        </Chip>
        <AspectRatio ratio="1" sx={{ borderRadius: 'md', overflow: 'hidden', bgcolor: 'neutral.100' }}>
          <img
            src={images}
            alt={name}
            loading="lazy"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </AspectRatio>
      </Box>

      <Box sx={{ px: 0.5, pt: 0.5 }}>
        <Typography level="body-xs">Precio:</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'wrap' }}>
          {discount > 0 && (
            <Typography sx={{ textDecoration: 'line-through', color: 'text.secondary', fontSize: '0.75rem' }}>
              {Number(public_price).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}
            </Typography>
          )}
          <Typography sx={{ fontSize: '0.9rem', fontWeight: 600 }}>
            {Number(parseFloat(public_price) * (1 - discount / 100)).toLocaleString('es-MX', {
              style: 'currency',
              currency: 'MXN',
            })}
          </Typography>
        </Box>
      </Box>

      <ProductActions onViewDetails={goToDetailPage} product={product} />
    </Card>
  )
  
}