// src/components/Testimonials.jsx
import React from 'react';
import { Box, Typography, Card, CardContent, Avatar, Grid } from '@mui/joy';

const testimonials = [
  {
    name: 'María López',
    text: 'Los pañales de Ecopipo son suaves, ecológicos y súper cómodos. Me encanta que sean reutilizables y que se vean lindos.',
    avatar: '/images/testimonials/maria.jpg'
  },
  {
    name: 'Ana Gómez',
    text: 'Los accesorios de lavado hacen que todo el proceso sea fácil. Y las toallas femeninas tienen gran absorción sin irritar.',
    avatar: '/images/testimonials/ana.jpg'
  },
  {
    name: 'Lucía Fernández',
    text: 'Desde que uso estos productos me siento más tranquila sabiendo que cuido el planeta y mi familia.',
    avatar: '/images/testimonials/lucia.jpg'
  },
];

const Testimonials = () => {
  return (
    <Box
      component="section"
      sx={{ py: 8, px: 2, backgroundColor: 'neutral.softBg' }}
    >
      <Typography level="h2" sx={{ mb: 4, textAlign: 'center' }}>
        Lo que dicen nuestros clientes
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        {testimonials.map((t) => (
          <Grid key={t.name} xs={12} sm={6} md={4}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 4 }}>
                <Avatar src={t.avatar} size="lg" sx={{ mb: 2 }} />
                <Typography level="body-md" sx={{ mb: 2, fontStyle: 'italic', textAlign: 'center' }}>
                  “{t.text}”
                </Typography>
                <Typography level="body-md" sx={{ fontWeight: 600 }}>
                  {t.name}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Testimonials;