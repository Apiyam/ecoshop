'use client';

import {
  Box,
  Typography,
  Button,
  Container,
} from '@mui/material';
import HeroMain from './_components/HeroMain';
import BenefitCards from './_components/BenefitCards';
import BenefitsIcons from './_components/BenefitsIcons';
import ProductsRow from './_components/ProductsRow';
import AboutContact from './_components/AboutContact';
import Footer from './_components/Footer';
import { Link } from '@mui/joy';

export default function HomePage() {

  return (
    <>
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center',  height: '100vh' }}>
      <Typography sx={{ textAlign: 'center', color: '#9e71a7', fontSize: '4rem', fontWeight: 'bold', mt: 10 }}>
        En construcción
      </Typography>
      <Link href="/tienda">
        <Button variant="outlined" color="primary" >
          Ir a la tienda
        </Button>
      </Link>
    </Box>
    
    </>
  );
}