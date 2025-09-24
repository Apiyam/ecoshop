'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link, Modal, Sheet } from '@mui/joy';
import Masonry from 'react-masonry-css';

import slide1 from '../../../public/imgs/ecopipo1.png';
import slide2 from '../../../public/imgs/ecopipo2.png';
import slide3 from '../../../public/imgs/ecopipo3.jpg';
import slide4 from '../../../public/imgs/ecopipo3.jpg';

const images = [slide1, slide2, slide3, slide4];

const breakpointColumnsObj = {
  default: 3,
  1100: 2,
  700: 1,
};

function AnimatedDotsCanvas({ scrollYValue }: { scrollYValue: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dots = useRef<any[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    let width = (canvas.width = canvas.clientWidth * dpr);
    let height = (canvas.height = canvas.clientHeight * dpr);
    ctx.scale(dpr, dpr);

    const numDots = 60;
    dots.current = Array.from({ length: numDots }, () => {
      const y = Math.random() * (height / dpr);
      return {
        x: Math.random() * (width / dpr),
        y,
        baseY: y,
        radius: Math.random() * 1.5 + 4,
        speedX: (Math.random() - 0.5) * 0.15,
        speedY: (Math.random() - 0.5) * 0.15,
        alpha: Math.random() * 0.4 + 0.5,
      };
    });

    let animationFrameId: number;
    function animate() {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

      dots.current.forEach((dot) => {
        dot.x += dot.speedX;
        dot.y += dot.speedY;

        if (dot.x < 0 || dot.x > canvas.clientWidth) dot.speedX *= -1;
        if (dot.y < 0 || dot.y > canvas.clientHeight) dot.speedY *= -1;

        const scrollOffset = scrollYValue * 0.1;
        const yWithScroll = dot.baseY + scrollOffset;

        ctx.beginPath();
        ctx.arc(dot.x, yWithScroll, dot.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${dot.alpha})`;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(animate);
    }
    animate();

    const onResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.clientWidth * dpr;
      height = canvas.height = canvas.clientHeight * dpr;
      if (ctx) ctx.scale(dpr, dpr);
      dots.current.forEach((dot) => {
        dot.baseY = Math.min(dot.baseY, height / dpr);
      });
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [scrollYValue]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
}

export default function HeroMain() {
  const [showGuide, setShowGuide] = useState(false);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, -30]);

  const [scrollYValue, setScrollYValue] = React.useState(0);
  useEffect(() => {
    return scrollY.onChange((v) => setScrollYValue(v));
  }, [scrollY]);

  return (
    <Box sx={{ position: 'relative', overflow: 'hidden', pb: 20 }}>
      <img src="/imgs/ecopipo1.png" alt="Ecopipo" width={"100%"} />
      {/* Fondo */}
      <motion.div
        style={{
          y: y1,
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -1,
          background: 'linear-gradient(135deg, #A5D6A7, #66BB6A)',
        }}
      >
        <AnimatedDotsCanvas scrollYValue={scrollYValue} />
      </motion.div>

      {/* Contenido */}
      <Container
        maxWidth="md"
        sx={{
          pt: { xs: 10, md: 16 },
          pb: { xs: 10, md: 12 },
          textAlign: 'center',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Typography
            variant="h2"
            fontWeight="bold"
            gutterBottom
            color="#000"
          >
            Sustentabilidad en tu hogar
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ mb: 4, maxWidth: 720, mx: 'auto' }}
          >
            Pañales ecológicos, accesorios de lavado, productos femeninos y más.
            Cuida de tu familia y del planeta con soluciones reutilizables,
            cómodas y mexicanas.
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Link href="/tienda" underline="none">
              <Button
                variant="contained"
                size="large"
                sx={{
                  backgroundColor: '#388e3c',
                  '&:hover': { backgroundColor: '#2e7d32' },
                  fontSize: '1.1rem',
                }}
              >
                Ir a la tienda
              </Button>
            </Link>
            <Button
              onClick={() => {}}
              variant="contained"
              size="large"
              sx={{
                backgroundColor: '#8bc34a',
                '&:hover': { backgroundColor: '#689f38' },
                fontSize: '1.1rem',
              }}
            >
              Contacto
            </Button>
          </Box>
        </motion.div>

        {/* Modal guía */}
        {showGuide && (
          <Modal open={showGuide} onClose={() => setShowGuide(false)}>
            <Sheet
              sx={{
                width: { xs: '100%', sm: 600 },
                mx: 'auto',
                mt: '3vh',
                borderRadius: 'md',
                p: 4,
                boxShadow: 'lg',
                bgcolor: 'background.body',
                outline: 'none',
                textAlign: 'center',
              }}
            >
              <img
                src="/imgs/guia-ecopipo.jpg"
                alt="Guía Ecopipo"
                loading="lazy"
                style={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }}
              />
              <Button
                variant="outlined"
                color="success"
                onClick={() => setShowGuide(false)}
                sx={{ mt: 3 }}
              >
                Cerrar
              </Button>
            </Sheet>
          </Modal>
        )}

      </Container>

      {/* Curva inferior */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          lineHeight: 0,
          zIndex: 0,
        }}
      >
        <svg
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          style={{ display: 'block', width: '100%', height: '100px' }}
        >
          <path
            fill="#ffffff"
            d="M0,96L60,117.3C120,139,240,181,360,197.3C480,213,600,203,720,181.3C840,160,960,128,1080,133.3C1200,139,1320,181,1380,202.7L1440,224L1440,320L0,320Z"
          />
        </svg>
      </Box>
    </Box>
  );
}