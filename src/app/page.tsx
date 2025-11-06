'use client';
import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Button,
  Card,
  CardContent,
  CardMedia,
  Stack,
  Divider,
  Select,
  MenuItem,
  Link,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import CelebrationIcon from "@mui/icons-material/Celebration";
import SixteenDescription from "./_components/SixteenDescription";
import MysteryBoxModal from "./_components/MysteryBoxModal";
import { ProductItem } from "@/lib/wooApi";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";


const DulcesDieciseis = () => {
  const purple = "#733080";
  const green = "#89b329";
  const [mysteryItem, setMysteryItem] = useState<any>(null);
  const router = useRouter();

  const mysteryBoxes = [
    {
      id: 1,
      title: "Paquete de 6 piezas",
      desc: "Arma tu paquete de 6 productos con descuento del 5%",
      price: "",
      goal: 6,
      discountText: "5% de descuento aplicado",
      image: "https://placehold.co/300x300",
    },
    {
      id: 2,
      title: "Paquete de 10 piezas",
      desc: "Arma tu paquete de 10 productos con descuento del 8%",
      price: "",
      goal: 10,
      discountText: "8% de descuento aplicado",
      image: "https://placehold.co/300x300",
    },
    {
      id: 3,
      title: "Paquete de 15 piezas",
      desc: "Arma tu paquete de 15 productos con descuento del 10%",
      price: "",
      goal: 15,
      discountText: "10% de descuento aplicado",
      image: "https://placehold.co/300x300",
    },
    {
      id: 4,
      title: "Paquete de 20 piezas",
      desc: "Arma tu paquete de 20 o más productos con descuento del 12%",
      price: "",
      goal: 20,
      discountText: "12% de descuento aplicado",
      image: "https://placehold.co/300x300",
    },
  ];

  const [showMysteryBoxModal, setShowMysteryBoxModal] = useState<boolean>(false);
  const { setGoalCustomPackage } = useCart()


  return (
    <Box sx={{ bgcolor: "#F8F8F8", minHeight: "100vh", color: "#333" }}>
      <img src="https://placehold.co/1300x400" alt="16" style={{ width: "100%", height: "auto" }} />
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: "#EFE9F1", py: 5, textAlign: "center"
        }}
      >
        <Container>
          <Typography
            variant="h3"
            sx={{ fontWeight: 800, mb: 2, letterSpacing: "-0.5px" }}
          >
           ¡APROVECHA EL PIPOFIN! <br /> 🎉🎉🎉
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
            ¡10% de descuento en todos nuestros productos! Arma tus paquetes personalizados y obtén aún más de descuento.
          </Typography>
          
          <br />
          <Stack
            direction={{"xs": "column", "md": "row"}}
            justifyContent="center"
            alignItems="center"
            spacing={1}
            sx={{ mb: 1 }}
          >
            <AccessTimeIcon sx={{ color: purple }} />
            <Typography variant="h6" sx={{ fontWeight: 600, color: purple }}>
              Promoción válida del 20 de noviembre al 30 de noviembre
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
              borderRadius: 3,
              px: 4,
              py: 1.5,
              ":hover": { bgcolor: "#7BA628" },
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
              borderRadius: 3,
              px: 4,
              py: 1.5,
              ":hover": { bgcolor: purple },
            }}
          >
            OFERTAS PIPOFIN
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
           ¡Escoge tu paquete personalizado con descuentos dobles!
           <br />
           💝 <br /><br />
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
              borderRadius: 3,
              px: 4,
              py: 1.5,
              ":hover": { bgcolor: purple },
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
                  width: "90%",
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
                    <LocalOfferIcon sx={{ color: "red" }} />
                    <Typography sx={{ color: "red", fontWeight: 600 }}>
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
                      borderRadius: 3,
                      ":hover": { bgcolor: "#7BA628" },
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
          Aprovecha el Pipofin y obtén descuentos dobles en tus paquetes personalizados 💚
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