'use client'
import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardCover, CardContent, Grid, Button, Container } from '@mui/joy';
import CategoryGrid from '@/components/CategoryGrid';
import { CategoryItem, getCategories } from '@/lib/wooApi';
import LoadingIndicator from '@/components/LoadingIndicator';
import 'keen-slider/keen-slider.min.css'
import { useRouter } from 'next/navigation';
import CategoryButton from '@/components/CategoryButton';
const categories = [
  {
    title: 'Pañales Ecológicos',
    image: '/images/categorias/panales.jpg',
    link: '#'
  },
  {
    title: 'Accesorios de Lavado',
    image: '/images/categorias/lavado.jpg',
    link: '#'
  },
  {
    title: 'Accesorios para Mujer',
    image: '/images/categorias/mujer.jpg',
    link: '#'
  },
  {
    title: 'Toallas Femeninas',
    image: '/images/categorias/toallas.jpg',
    link: '#'
  },
];

const Categories = () => {
  const [categories, setCategories] = useState<CategoryItem[]>([])
  const router = useRouter();
  useEffect(() => {
    getCategories().then((categories) => setCategories(categories))
}, [])
if (categories.length === 0) return <LoadingIndicator />
  return (
    <Box
      component="section"
      id="categories"
      sx={{  px: 2 }}
    >
      <Typography level="h2" sx={{ mb: 4, textAlign: 'center' }}>
        Nuestras Categorías
      </Typography>
      <Grid container spacing={2}>
        {categories.filter((category) => category.name!="Promocionales").map((category) => (
          <Grid xs={12} sm={6} md={4} lg={3} key={category.slug}>
            <CategoryButton category={category} onClick={() => {
              router.push(`/tienda/${category.slug}`)
            }} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Categories;