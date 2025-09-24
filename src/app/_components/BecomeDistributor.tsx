'use client';

import { Box, Typography, Button, Card, CardContent } from '@mui/joy';
import { motion } from 'framer-motion';
import { GifTwoTone, AirplaneTicket, People, StarBorder } from '@mui/icons-material';

export default function BecomeDistributor() {
  return (
    <Box
      component={motion.section}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      sx={{
        py: 12,
        px: 3,
        textAlign: 'center',
        background: '#733080 url(https://ecopipo.com/matriz/wp-content/uploads/2022/06/Ecopipo_Footer_70.png?id=2131) !important',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        borderRadius: 'xl',
        boxShadow: 'lg',
        mx: 'auto',
      }}
    >
      <Typography level="h2" sx={{ color: '#fff', fontWeight: '100', mb: 2 }}>
        ¿Te gustaría ser distribuidora?
      </Typography>
      <Typography level="body-lg" sx={{ mb: 6, maxWidth: 700, mx: 'auto', color: '#fff' }}>
        ¿Eres una mujer emprendedora que quiere lograr más?  
        <br />
        <strong>
          Tú puedes ser una distribuidora ECOPIPO. ¡Ganarás premios, viajes y toda una experiencia
          para ti y tu familia!
        </strong>
        <br />
        Además de la gran satisfacción de convivir, trabajar y crecer con mujeres tan valiosas como tú.
      </Typography>

      {/* Iconos de beneficios */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 4,
          justifyContent: 'center',
          mb: 6,
        }}
      >
        {[
          { icon: <GifTwoTone  />, label: 'Premios' },
          { icon: <AirplaneTicket  />, label: 'Viajes' },
          { icon: <People  />, label: 'Comunidad' },
          { icon: <StarBorder />, label: 'Reconocimiento' },
        ].map((item, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.1, rotate: -2 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <Card
              variant="soft"
              sx={{
                height: "150px",
                width: "150px",
                borderRadius: 'lg',
                boxShadow: '0',
                textAlign: 'center',
                bgcolor: 'transparent',
              }}
            >
              <CardContent sx={{ 
                display: 'flex', 
                flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center',
                
               
                backgroundColor: '#f8bbd0',
                borderRadius: '100%',
              }}>
                {item.icon}
                <Typography level="body-sm" sx={{ mt: 1, fontWeight: 'md' }}>
                  {item.label}
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </Box>

      <motion.div whileHover={{ scale: 1.05 }}>
        <Button
          size="lg"
          variant="solid"
          sx={{
            bgcolor: '#d81b60',
            color: 'white',
            px: 6,
            py: 2,
            fontSize: 'lg',
            borderRadius: 'xl',
            fontWeight: 'xl',
            '&:hover': { bgcolor: '#ad1457' },
          }}
        >
          ¡ÚNETE!
        </Button>
      </motion.div>
    </Box>
  );
}