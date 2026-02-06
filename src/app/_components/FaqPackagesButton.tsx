'use client'

import React, { useState } from 'react'
import {
  IconButton,
  Modal,
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import CloseIcon from '@mui/icons-material/Close'
import { BRAND_PURPLE, BRAND_GREEN, BRAND_PURPLE_HOVER, BRAND_GREEN_HOVER } from '@/lib/constants'

const faqItems = [
  {
    title: '¿Qué son los paquetes de 6, 10, 15 y 20 piezas?',
    body: 'Son paquetes que tú armas eligiendo los productos que quieras en la tienda. Puedes mezclar pañales, absorbentes, ropa y accesorios. Al sumar 6, 10, 15 o 20 piezas en tu carrito, se aplica automáticamente un descuento mayor.',
  },
  {
    title: '¿Cómo funcionan los descuentos?',
    body: 'Los descuentos son progresivos: 6 piezas = 5% de descuento, 10 piezas = 8%, 15 piezas = 10% y 20 piezas o más = 12%. Entre más productos sumes a tu paquete, más ahorras. El descuento se aplica en el carrito al ir a pagar.',
  },
  {
    title: '¿Cómo armo mi paquete?',
    body: 'Elige tu meta (por ejemplo "Paquete de 10 piezas") en la página principal y te llevamos a la tienda. Agrega al carrito los productos que quieras hasta alcanzar esa cantidad. Verás una barra de progreso que te indica cuántas piezas llevas y cuántas faltan para el siguiente descuento.',
  },
]

export default function FaqPackagesButton() {
  const [open, setOpen] = useState(false)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <>
      <IconButton
        onClick={() => setOpen(true)}
        aria-label="Preguntas frecuentes sobre paquetes"
        sx={{
          position: 'fixed',
          bottom: isMobile ? 80 : 16,
          left: 16,
          zIndex: 1000,
          width: 48,
          height: 48,
          minWidth: 44,
          minHeight: 44,
          backgroundColor: BRAND_PURPLE,
          color: 'white',
          boxShadow: '0 4px 12px rgba(115,48,128,0.35)',
          '&:hover': {
            backgroundColor: BRAND_PURPLE_HOVER,
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 16px rgba(115,48,128,0.4)',
          },
          transition: 'all 0.2s ease',
        }}
      >
        <HelpOutlineIcon />
      </IconButton>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2,
          backdropFilter: 'blur(4px)',
        }}
        aria-labelledby="faq-paquetes-title"
      >
        <Card
          sx={{
            width: '100%',
            maxWidth: isMobile ? '100%' : 520,
            maxHeight: '90vh',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            border: `2px solid ${BRAND_PURPLE}`,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 2,
              borderBottom: `1px solid ${BRAND_PURPLE}`,
              bgcolor: '#EFE9F1',
            }}
          >
            <Typography
              id="faq-paquetes-title"
              variant="h6"
              sx={{ fontWeight: 700, color: BRAND_PURPLE }}
            >
              Preguntas frecuentes – Paquetes
            </Typography>
            <IconButton
              onClick={() => setOpen(false)}
              aria-label="Cerrar"
              sx={{ color: BRAND_PURPLE }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
          <CardContent sx={{ overflowY: 'auto', flex: 1, py: 2 }}>
            {faqItems.map((item, i) => (
              <Box key={i} sx={{ mb: 3 }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 700,
                    color: BRAND_PURPLE,
                    mb: 1,
                    fontSize: '1rem',
                  }}
                >
                  {item.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: '#444', lineHeight: 1.7 }}
                >
                  {item.body}
                </Typography>
              </Box>
            ))}
          </CardContent>
          <Box sx={{ p: 2, borderTop: '1px solid #eee' }}>
            <Button
              fullWidth
              variant="contained"
              onClick={() => setOpen(false)}
              sx={{
                bgcolor: BRAND_GREEN,
                color: 'white',
                fontWeight: 600,
                borderRadius: 2,
                py: 1.5,
                '&:hover': { bgcolor: BRAND_GREEN_HOVER },
              }}
            >
              Entendido
            </Button>
          </Box>
        </Card>
      </Modal>
    </>
  )
}
