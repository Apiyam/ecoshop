'use client';
import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Button,
  Card,
  CardContent,
  Stack,
  Link,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import CelebrationIcon from "@mui/icons-material/Celebration";
import MysteryBoxModal from "./_components/MysteryBoxModal";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { BRAND_PURPLE, BRAND_GREEN, BRAND_GREEN_HOVER, BRAND_PURPLE_HOVER } from "@/lib/constants";

const DulcesDieciseis = () => {
  const purple = BRAND_PURPLE;
  const green = BRAND_GREEN;
  const router = useRouter();

  const mysteryBoxes = [
    {
      id: 1,
      title: "Paquete de 6 piezas",
      desc: "Arma tu paquete de 6 productos con descuento del 5%",
      price: "",
      goal: 6,
      discountText: "5% de descuento aplicado",
      image: "/imgs/paq6.JPG",
    },
    {
      id: 2,
      title: "Paquete de 10 piezas",
      desc: "Arma tu paquete de 10 productos con descuento del 8%",
      price: "",
      goal: 10,
      discountText: "8% de descuento aplicado",
      image: "/imgs/paq10.JPG",
    },
    {
      id: 3,
      title: "Paquete de 15 piezas",
      desc: "Arma tu paquete de 15 productos con descuento del 10%",
      price: "",
      goal: 15,
      discountText: "10% de descuento aplicado",
      image: "/imgs/paq15.JPG",
    },
    {
      id: 4,
      title: "Paquete de 20 piezas",
      desc: "Arma tu paquete de 20 o más productos con descuento del 12%",
      price: "",
      goal: 20,
      discountText: "12% de descuento aplicado",
      image: "/imgs/paq20.JPG",
    },
  ];

  const [showMysteryBoxModal, setShowMysteryBoxModal] = useState<boolean>(false);
  const { setGoalCustomPackage } = useCart()


  return (
    <Box sx={{ bgcolor: "#F8F8F8", minHeight: "100vh", color: "#333", pb: { xs: 6, sm: 0 } }}>
      {/* Hero Section  
       */}
      <img src="/imgs/ecopipo.jpeg" alt="Promoción Amor Propio 10%" style={{ width: "100%", height: "auto" }} />
      <Box
        sx={{
          bgcolor: "#EFE9F1", py: 5, textAlign: "center"
        }}
      >
        <Container>
          <Typography
            variant="h4"
            sx={{ fontWeight: 800, mb: 2, letterSpacing: "-0.5px" }}
          >
            Más para tu bebé, más ahorro para ti
          </Typography>
          <Typography
            variant="h6"
            sx={{
              maxWidth: 700,
              mx: "auto",
              opacity: 0.9,
              lineHeight: 1.6,
              mb: 4,
            }}
          >
            Elige los productos que necesitas y arma tu paquete desde 6 piezas. Entre más sumes, más descuento: hasta 12% en paquetes de 20 piezas. Cuidado con amor, sin dejar de cuidar tu bolsillo.
          </Typography>

          <Stack
            direction={{ xs: "column", md: "row" }}
            justifyContent="center"
            alignItems="center"
            spacing={1}
            sx={{ mb: 1 }}
          >
            <AccessTimeIcon sx={{ color: purple }} />
            <Typography variant="h6" sx={{ fontWeight: 600, color: purple }}>
              Acumula descuentos de forma progresiva
            </Typography>
          </Stack>
          <Box>
          <a href="#mystery-boxes">
          <Button
            variant="contained"
            className="btn-responsive"
            size="large"
            sx={{
              bgcolor: green,
              color: "white",
              fontWeight: 600,
              borderRadius: 2,
              px: 4,
              py: 1.5,
              minHeight: 44,
              boxShadow: "0 4px 14px rgba(137,179,41,0.35)",
              transition: "all 0.2s ease",
              "&:hover": {
                bgcolor: BRAND_GREEN_HOVER,
                transform: "translateY(-2px)",
                boxShadow: "0 6px 18px rgba(137,179,41,0.45)",
              },
            }}
          >
            QUIERO ARMAR MI PAQUETE
          </Button>
          </a>
          <Link href="/tienda" underline="none">
          <Button
            variant="contained"
            className="btn-responsive"
            size="large"
            sx={{
              marginLeft: "10px",
              bgcolor: purple,
              color: "white",
              fontWeight: 600,
              borderRadius: 2,
              px: 4,
              py: 1.5,
              minHeight: 44,
              boxShadow: "0 4px 14px rgba(115,48,128,0.35)",
              transition: "all 0.2s ease",
              "&:hover": {
                bgcolor: BRAND_PURPLE_HOVER,
                transform: "translateY(-2px)",
                boxShadow: "0 6px 18px rgba(115,48,128,0.45)",
              },
            }}
          >
            TIENDA ECOPIPO
          </Button>
          </Link>
          </Box>
        </Container>
      </Box>

      {/* Mystery Box Section */}
      <Container sx={{ py: 10 }} id="mystery-boxes">
        <Typography
          variant="h4"
          textAlign="center"
          sx={{ mb: 6, color: purple, fontWeight: 800 }}
        >
          Escoge tu paquete personalizado con descuentos
          <br /><br />
           <Button
            onClick={() => setShowMysteryBoxModal(true)}
            variant="contained"
            className="btn-responsive"
            size="large"
            sx={{
              marginLeft: "10px",
              marginBottom: "10px",
              bgcolor: purple,
              color: "white",
              fontWeight: 600,
              borderRadius: 2,
              px: 4,
              py: 1.5,
              minHeight: 44,
              boxShadow: "0 4px 14px rgba(115,48,128,0.35)",
              transition: "all 0.2s ease",
              "&:hover": {
                bgcolor: BRAND_PURPLE_HOVER,
                transform: "translateY(-2px)",
                boxShadow: "0 6px 18px rgba(115,48,128,0.45)",
              },
            }}
          >
            ¿Cómo funciona mi paquete personalizado?
          </Button>
        </Typography>
        


        <Box sx={{ display: 'grid', gridTemplateColumns: {'xs': 'repeat(1, 1fr)', 'md': 'repeat(2, 1fr)'}, gap: 4 }}>
          {mysteryBoxes.map((box, idx) => (
            <Grid  key={idx}>
              <Card
                sx={{
                  borderRadius: 4,
                  overflow: "hidden",
                  boxShadow: 3,
                  width: "100%",
                  transition: "all 0.3s ease",
                  ":hover": { boxShadow: 6, transform: "translateY(-4px)" },
                }}
              >
                <img src={box.image} alt={box.title} style={{ width: "100%", height: "auto" }} />
               
                <CardContent>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: purple }}>
                    {box.title}
                  </Typography>
                  <Typography sx={{ mt: 1, mb: 2, color: "#444" }}>
                    {box.desc}
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                    <LocalOfferIcon sx={{ color: green }} />
                    <Typography sx={{ color: purple, fontWeight: 600 }}>
                      {box.discountText}
                    </Typography>
                  </Stack>
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{
                      mt: 3,
                      bgcolor: green,
                      color: "white",
                      fontWeight: 600,
                      borderRadius: 2,
                      minHeight: 44,
                      boxShadow: "0 4px 14px rgba(137,179,41,0.35)",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        bgcolor: BRAND_GREEN_HOVER,
                        transform: "translateY(-2px)",
                        boxShadow: "0 6px 18px rgba(137,179,41,0.45)",
                      },
                    }}
                    onClick={() => {
                      setGoalCustomPackage(box.goal);
                      router.push("/tienda");
                    }}
                  >
                    Ir a armar mi paquete
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Box>
      </Container>


      {/* Footer */}
      <Box sx={{ bgcolor: purple, py: 6, textAlign: "center", color: "white" }}>
        <CelebrationIcon sx={{ color: green, fontSize: 40 }} />
        <Typography variant="h6" sx={{ fontWeight: 600, mt: 1 }}>
          Paquetes personalizados, ecológicos y sustentables para tu familia
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.8 }}>
          Ecopipo® 2025 — Empresa 100% mexicana.
        </Typography>
      </Box>
      <MysteryBoxModal open={showMysteryBoxModal} onClose={() => setShowMysteryBoxModal(false)} />
    </Box>
  );
};

export default DulcesDieciseis;
