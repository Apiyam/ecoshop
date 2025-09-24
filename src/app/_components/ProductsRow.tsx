'use client';

import { ShoppingCart, StarBorderPurple500Outlined } from '@mui/icons-material';
import { Box, Typography, Button, Link, Card, CardCover, CardContent, Sheet } from '@mui/joy';
import { motion } from 'framer-motion';

const products = [
  {
    title: 'Calzón menstrual',
    description: 'Reutilizable, cómodo y anatómico. Perfecto para tu día a día sin preocupaciones.',
    cta: 'Quiero mi Calzón',
    img: '/imgs/calzon.png',
    icon: <StarBorderPurple500Outlined/>,
    slug: 'calzon-menstrual',
  },
  {
    title: 'Toalla Femenina Regular',
    description: 'Impermeable, transpirable y con capas absorbentes de microfibra. Diseño anatómico.',
    cta: 'Quiero mi Toalla Regular',
    img: '/imgs/regular.png',
    icon: <StarBorderPurple500Outlined/>,
    slug: 'toalla-femenina-regular',
  },
  {
    title: 'Pantiprotector',
    description: 'Protección ligera para los días con poco flujo. Cuida tu salud y el planeta.',
    cta: 'Quiero mi Pantiprotector',
    img: '/imgs/pantiprotector.png',
    icon: <StarBorderPurple500Outlined/>,
    slug: 'pantiprotector',
  },
];

export default function ProductsRowPro() {
  return (
    <Box sx={{ mx: 'auto', py: 10, mt: 10, px: 2, 
    background: 'url(https://png.pngtree.com/thumb_back/fw800/background/20220630/pngtree-baby-cute-background-with-white-clouds-on-green-background-and-hanging-image_1416215.jpg)'
    ,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed',
    backgroundBlendMode: 'multiply',
    backgroundColor: 'rgba(255,255,255,0.5)',
    }}>
      <Typography level="h2" sx={{ mb: 4, textAlign: 'center'}}>
        ¡Nuestros productos destacados!
      </Typography>

      <Box sx={{ maxWidth: 1400, mx: 'auto', display: 'grid', gap: 6, gridTemplateColumns: { xs: '1fr', md: 'repeat(3,1fr)' } }}>
        {products.map((product, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.03 }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.2 }}
          >
            <Card
              variant="outlined"
              sx={{
                borderRadius: '2xl',
                overflow: 'hidden',
                cursor: 'pointer',
                boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              
               

              <CardContent
                sx={{
                  p: 4,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  flexGrow: 1,
                  bgcolor: '#fff',
                }}
              >
                 <img
                  src={product.img}
                  alt={product.title}
                  style={{ width: '100%', maxHeight: '220px', objectFit: 'cover' }}
                  loading="lazy"
                />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {product.icon}
                    <Typography level="h3" sx={{ fontWeight: 'xl' }}>
                    {product.title}
                  </Typography>
                </Box>
                <Typography level="body-md" sx={{ color: 'text.secondary', mb: 2 }}>{product.description}</Typography>
                <Link href={`/tienda/${product.slug}`} underline="none" sx={{ mt: 'auto' }}>
                  <Button
                    variant="solid"
                    color="primary"
                    sx={{
                      bgcolor: '#d81b60',
                      '&:hover': { bgcolor: '#ad1457' },
                      fontWeight: 'xl',
                      width: '100%',
                    }}
                  >
                    {product.cta}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </Box>
    </Box>
  );
}
