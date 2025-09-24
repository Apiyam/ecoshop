import React from 'react';
import { Box, Typography, Button } from '@mui/joy';

const CTASection = () => {
  return (
    <Box
      component="section"
      sx={{
        py: 10,
        px: 2,
        textAlign: 'center',
        backgroundSize: 'cover !important',
        color: '#ffffff',
        background: 'url(https://png.pngtree.com/thumb_back/fh260/background/20250423/pngtree-eco-friendly-abstract-background-with-green-leaves-and-sustainability-icons-image_17209446.jpg) no-repeat center center ',
      }}
    >
      
      <Typography level="h2" sx={{ mb: 3 }}>
        Únete al movimiento verde
      </Typography>
      <Typography level="body-md" sx={{ mb: 4, maxWidth: 600, mx: 'auto'   }}>
        Descubre cómo Ecopipo puede convertir tu día a día en algo más sostenible. Ofertas especiales disponibles por tiempo limitado.
      </Typography>
      <Button size="lg" variant="solid" color="primary">
        Comprar ahora
      </Button>
    </Box>
  );
};

export default CTASection;