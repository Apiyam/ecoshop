import React from 'react';
import { Box, Typography, Link, Stack, Divider } from '@mui/joy';

const Footer = () => {
  return (
    <Box component="footer" sx={{ py: 6, px: 2, backgroundColor: '#8ab32b' }}>
      <Stack spacing={2} alignItems="center">
        <img src="/imgs/Ecopipo-llsm.png" alt="Ecopipo" width={120} />
        <Stack direction="row" spacing={2} >
          <Link href="#" sx={{ color: 'text.primary' }} >Nosotros</Link>
          <Link href="#" sx={{ color: 'text.primary' }} >Contacto</Link>
          <Link href="#" sx={{ color: 'text.primary' }} >Términos & Condiciones</Link>
          <Link href="#" sx={{ color: 'text.primary' }} >Política de Privacidad</Link>
        </Stack>
        <Typography level="body2" sx={{ color: 'text.secondary' }}>
          &copy; {new Date().getFullYear()} Ecopipo. Todos los derechos reservados.
        </Typography>
      </Stack>
    </Box>
  );
};

export default Footer;