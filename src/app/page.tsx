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
  CardMedia,
  Stack,
  Divider,
  Select,
  MenuItem,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import CelebrationIcon from "@mui/icons-material/Celebration";
import SixteenDescription from "./_components/SixteenDescription";

const DulcesDieciseis = () => {
  const purple = "#733080";
  const green = "#89b329";

  const mysteryBoxes = [
    {
      title: "Mystery Box Ecopipo 3 pañales",
      desc: "Paquete misterioso con 3 pañales premium estampados. ¡Doble descuento aniversario!",
      price: "836",
      discountText: "32% de descuento aplicado",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQ4R7SVY19Ve_tL8LZ3Pj75FDnTEThyFgy4g&s",
    },
    {
      title: "Mystery Box Ecopipo 6 pañales",
      desc: "Paquete misterioso con 6 pañales premium estampados. ¡Triple descuento aniversario!",
      price: "1550",
      discountText: "37% de descuento aplicado",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQ4R7SVY19Ve_tL8LZ3Pj75FDnTEThyFgy4g&s",
    },
  ];

  const [selectedBox, setSelectedBox] = useState<string>("unisex");

  return (
    <Box sx={{ bgcolor: "#F8F8F8", minHeight: "100vh", color: "#333" }}>
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
            🎉 Dulces Dieciséis Ecopipo 🎉
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
            16 días de promociones y sorpresas para celebrar nuestro aniversario.
            ¡Aprovecha descuentos dobles en nuestras Mystery Boxes y vive la magia
            de Ecopipo!
          </Typography>
          <Button
            variant="contained"
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
            Ver ofertas
          </Button>
          <br /> <br />
          <Stack
            direction={{"xs": "column", "md": "row"}}
            justifyContent="center"
            alignItems="center"
            spacing={1}
            sx={{ mb: 1 }}
          >
            <AccessTimeIcon sx={{ color: purple }} />
            <Typography variant="h6" sx={{ fontWeight: 600, color: purple }}>
              Promoción válida del 15 al 31 de octubre
            </Typography>
          </Stack>
        </Container>
      </Box>

      <SixteenDescription />

      {/* Mystery Box Section */}
      <Container sx={{ py: 10 }}>
        <Typography
          variant="h4"
          textAlign="center"
          sx={{ mb: 6, color: purple, fontWeight: 800 }}
        >
           ¡Escoge ya tu mystery box Ecopipo! ¡Por tiempo limitado!
           <br />
           💝
        </Typography>

        <Box sx={{ display: 'grid', gridTemplateColumns: {'xs': 'repeat(1, 1fr)', 'md': 'repeat(2, 1fr)'}, gap: 4 }}>
          {mysteryBoxes.map((box, idx) => (
            <Grid  key={idx}>
              <Card
                sx={{
                  borderRadius: 4,
                  overflow: "hidden",
                  boxShadow: 3,
                  transition: "all 0.3s ease",
                  ":hover": { boxShadow: 6, transform: "translateY(-4px)" },
                }}
              >
                <CardMedia
                  component="img"
                  height="400"
                  image={box.image}
                  alt={box.title}
                  sx={{ objectFit: "cover", backgroundColor: "#F0F0F0" }}
                />
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
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h4" sx={{ fontWeight: 800, color: purple }}>
                    ${box.price} MXN
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#777" }}>
                    *Precio redondeado para tu comodidad.
                  </Typography>
                  <br />
                  <Select value={selectedBox} onChange={(e) => setSelectedBox(e.target.value)} fullWidth>
                    <MenuItem value="unisex">Unisex</MenuItem>
                    <MenuItem value="nino">Niño</MenuItem>
                    <MenuItem value="nina">Niña</MenuItem>
                  </Select>
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
                  >
                    Añadir al carrito
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
          16 días de amor, sorpresas y descuentos 💚
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.8 }}>
          Ecopipo® 2025 — Celebrando contigo con dulzura y sustentabilidad.
        </Typography>
      </Box>
    </Box>
  );
};

export default DulcesDieciseis;