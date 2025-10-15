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
  Link,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import CelebrationIcon from "@mui/icons-material/Celebration";
import SixteenDescription from "./_components/SixteenDescription";
import MysteryBoxModal from "./_components/MysteryBoxModal";

const DulcesDieciseis = () => {
  const purple = "#733080";
  const green = "#89b329";

  const mysteryBoxes = [
    {
      id: 1,
      title: "Mystery Box Ecopipo 3 pañales",
      desc: "Paquete misterioso con 3 pañales premium estampados. ¡Doble descuento aniversario!",
      price: "836",
      discountText: "32% de descuento aplicado",
      image: "/imgs/3box.jpg",
    },
    {
      id: 2,
      title: "Mystery Box Ecopipo 6 pañales",
      desc: "Paquete misterioso con 6 pañales premium estampados. ¡Triple descuento aniversario!",
      price: "1550",
      discountText: "37% de descuento aplicado",
      image: "/imgs/6box.jpg",
    },
  ];

  const [selectedBoxPack6, setSelectedBoxPack6] = useState<string>("unisex");
  const [selectedBoxPack3, setSelectedBoxPack3] = useState<string>("unisex");
  const [selectedSizePack6, setSelectedSizePack6] = useState<string>("velcro");
  const [selectedSizePack3, setSelectedSizePack3] = useState<string>("velcro");
  const [showMysteryBoxModal, setShowMysteryBoxModal] = useState<boolean>(false);
  return (
    <Box sx={{ bgcolor: "#F8F8F8", minHeight: "100vh", color: "#333" }}>
      <img src="/imgs/popup.jpg" alt="16" style={{ width: "100%", height: "auto" }} />
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
           Dulces Dieciséis Ecopipo <br /> 🎉🎉🎉
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
            16 días de promociones y sorpresas para celebrar nuestro aniversario. ¡Aprovecha 16% en todos nuestros productos y descuentos dobles en nuestras Mystery Boxes Ecopipo!
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
              Promoción válida del 15 al 31 de octubre
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
            MYSTERY BOX ANIVERSARIO
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
            OFERTAS ANIVERSARIO
          </Button>
          </Link>
          </Box>
        </Container>
      </Box>

      <SixteenDescription />

      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '80%', margin: '0 auto' }}>
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
            ¿Qué Contiene la Mystery Box?
          </Button>
      </Box>

      {/* Mystery Box Section */}
      <Container sx={{ py: 10 }} id="mystery-boxes">
        <Typography
          variant="h4"
          textAlign="center"
          sx={{ mb: 6, color: purple, fontWeight: 800 }}
        >
           ¡Escoge ya tu Mystery Box Ecopipo! ¡Por tiempo limitado!
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
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h4" sx={{ fontWeight: 800, color: purple }}>
                    ${box.price} MXN
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#777" }}>
                    *Precio redondeado para tu comodidad.
                  </Typography>
                  <br />
                  <Typography variant="body2" sx={{ fontWeight: 800, color: purple }}>Género</Typography>
                  <Select value={box.id === 1 ? selectedBoxPack6 : selectedBoxPack3} onChange={(e) => box.id === 1 ? setSelectedBoxPack6(e.target.value) : setSelectedBoxPack3(e.target.value)} fullWidth>
                    <MenuItem value="unisex">Unisex</MenuItem>
                    <MenuItem value="nino">Niño</MenuItem>
                    <MenuItem value="nina">Niña</MenuItem>
                  </Select>
                  <Typography variant="body2" sx={{ fontWeight: 800, color: purple }}>Tipo cierre</Typography>
                  <Select value={box.id === 1 ? selectedSizePack6 : selectedSizePack3} onChange={(e) => box.id === 1 ? setSelectedSizePack6(e.target.value) : setSelectedSizePack3(e.target.value)} fullWidth>
                    <MenuItem value="velcro">Velcro</MenuItem>
                    <MenuItem value="broches">Broches</MenuItem>
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
      <MysteryBoxModal open={showMysteryBoxModal} onClose={() => setShowMysteryBoxModal(false)} />
    </Box>
  );
};

export default DulcesDieciseis;