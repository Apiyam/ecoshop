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
import Categories from './_components/Categories';
import Benefits from './_components/Benefits';
import Testimonials from './_components/Testimonials';
import CTASection from './_components/CTASection';
import EcopipoStory from './_components/EcopipoStory';
import BecomeDistributor from './_components/BecomeDistributor';
export default function HomePage() {

  return (
    <>
   <HeroMain />
   <Categories />
   <ProductsRow />
      <EcopipoStory />
      <Benefits />
      <BecomeDistributor />
      <Testimonials />
      <CTASection />
      <Footer />
    
    </>
  );
}