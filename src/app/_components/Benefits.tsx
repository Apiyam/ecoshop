import React from 'react';
import { Box, Typography, Grid } from '@mui/joy';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import OpacityIcon from '@mui/icons-material/Opacity';
import { EnergySavingsLeaf } from '@mui/icons-material';

const benefits = [
  {
    icon: <EnergySavingsLeaf sx={{ fontSize: 40, color: 'green' }} />,
    title: 'Materiales 100% ecológicos',
    description: 'Pañales y productos fabricados con materiales biodegradables y de origen natural.'
  },
  {
    icon: <LocalFloristIcon sx={{ fontSize: 40, color: 'green' }} />,
    title: 'Diseño cómodo y seguro',
    description: 'Diseños que aseguran confort, ajuste perfecto y seguridad para bebés y mujeres.'
  },
  {
    icon: <OpacityIcon sx={{ fontSize: 40, color: 'green' }} />,
    title: 'Cuidado lavable y reutilizable',
    description: 'Accesorios y productos para lavar, reutilizar y reducir el desperdicio.'
  },
];

const Benefits = () => {
  return (
    <Box
      component="section"
      sx={{ py: 12, px: 2 }}
    >
      <Typography level="h2" sx={{ mb: 4, textAlign: 'center' }}>
        ¿Por qué elegir Ecopipo?
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        {benefits.map((b) => (
          <Grid key={b.title} xs={12} sm={6} md={4}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                px: 2,
              }}
            >
              {b.icon}
              <Typography level="h3" sx={{ mt: 2, mb: 1 }}>
                {b.title}
              </Typography>
              <Typography level="body-md">
                {b.description}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Benefits;