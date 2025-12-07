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
  Stack,
  Divider,
  Select,
  MenuItem,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import CelebrationIcon from "@mui/icons-material/Celebration";
import MysteryBoxModal from "../_components/MysteryBoxModal";
import { ProductItem } from "@/lib/wooApi";
import { useCart } from "@/context/CartContext";

const mappBox = [
  {
    "cierre": "velcro",
    "box": "3",
    "tipo": "unisex",
    "name": "Super Box Navideña 10 pack Velcro Unisex",
    "id": "28144"
  },
  {
    "cierre": "velcro",
    "box": "3",
    "tipo": "niña",
    "name": "Super Box Navideña 10 pack Velcro Niña",
    "id": "28142"
  },
  {
    "cierre": "velcro",
    "box": "3",
    "tipo": "niño",
    "name": "Super Box Navideña 10 pack Velcro Niño",
    "id": "28140"
  },
  {
    "cierre": "broches",
    "box": "3",
    "tipo": "unisex",
    "name": "Super Box Navideña 10 pack Broches Unisex",
    "id": "28138"
  },
  {
    "cierre": "broches",
    "box": "3",
    "tipo": "niña",
    "name": "Super Box Navideña 10 pack Broches Niña",
    "id": "28136"
  },
  {
    "cierre": "broches",
    "box": "3",
    "tipo": "niño",
    "name": "Super Box Navideña 10 pack Broches Niño",
    "id": "28134"
  },
  {
    "cierre": "broches",
    "box": "2",
    "tipo": "unisex",
    "name": "Super Box Navideña 6 pack Broches Unisex",
    "id": "28132"
  },
  {
    "cierre": "broches",
    "box": "2",
    "tipo": "niña",
    "name": "Super Box Navideña 6 pack Broches Niña",
    "id": "28130"
  },
  {
    "cierre": "broches",
    "box": "2",
    "tipo": "niño",
    "name": "Super Box Navideña 6 pack Broches Niño",
    "id": "28128"
  },
  {
    "cierre": "broches",
    "box": "1",
    "tipo": "unisex",
    "name": "Super Box Navideña 3 pack Broches Unisex",
    "id": "28126"
  },
  {
    "cierre": "broches",
    "box": "1",
    "tipo": "niña",
    "name": "Super Box Navideña 3 pack Broches Niña",
    "id": "28124"
  },
  {
    "cierre": "broches",
    "box": "1",
    "tipo": "niño",
    "name": "Super Box Navideña 3 pack Broches Niño",
    "id": "28122"
  },
  {
    "cierre": "velcro",
    "box": "2",
    "tipo": "unisex",
    "name": "Super Box Navideña 6 pack Velcro Unisex",
    "id": "28120"
  },
  {
    "cierre": "velcro",
    "box": "2",
    "tipo": "niña",
    "name": "Super Box Navideña 6 pack Velcro Niña",
    "id": "28118"
  },
  {
    "cierre": "velcro",
    "box": "2",
    "tipo": "niño",
    "name": "Super Box Navideña 6 pack Velcro Niño",
    "id": "28116"
  }
]

const MysteryBoxNavideno = () => {
  const red = "#C8102E"; // Rojo navideño
  const green = "#228B22"; // Verde navideño
  const gold = "#D4AF37"; // Dorado navideño

  useEffect(() => {
    
  }, []);

  const mysteryBoxes = [
    {
      id: 1,
      title: "MysteryBox Navideña Ecopipo de 3 Pañales",
      desc: "Caja sorpresa con 3 pañales premium estampados de edición limitada. ¡Diseños que cuando se acaben... se acaban!",
      price: "984",
      originalPrice: "1230",
      discountText: "20% de descuento",
      savings: "246",
      image: "/imgs/3box.jpg",
    },
    {
      id: 2,
      title: "MysteryBox Navideña Ecopipo de 6 Pañales",
      desc: "Caja sorpresa con 6 pañales premium estampados de edición limitada. ¡Más magia, más ahorro!",
      price: "1722",
      originalPrice: "2460",
      discountText: "30% de descuento",
      savings: "738",
      image: "/imgs/6box.jpg",
    },
    {
      id: 3,
      title: "SuperBox Navideña (10 pañales + 1 filtro)",
      desc: "La caja más completa: 10 pañales premium estampados de edición limitada + 1 filtro de bambú. ¡El mejor regalo!",
      price: "2573",
      originalPrice: "4289",
      discountText: "40% de descuento",
      savings: "1716",
      image: "/imgs/6box.jpg",
    },
  ];

  const [selectedBoxPack6, setSelectedBoxPack6] = useState<string>("");
  const [selectedBoxPack3, setSelectedBoxPack3] = useState<string>("");
  const [selectedBoxPack10, setSelectedBoxPack10] = useState<string>("");
  const [selectedSizePack6, setSelectedSizePack6] = useState<string>("");
  const [selectedSizePack3, setSelectedSizePack3] = useState<string>("");
  const [selectedSizePack10, setSelectedSizePack10] = useState<string>("");
  const [showMysteryBoxModal, setShowMysteryBoxModal] = useState<boolean>(false);
  const { addToCart, setShouldDisplayCart } = useCart()

  const validateMysteryBox = (id: number) => {
    if(id === 1){
      if(selectedBoxPack6 === "" || selectedSizePack6 === ""){
        alert("Por favor, selecciona una opción para el paquete y el tamaño");
        return;
      }
    }
    if(id === 2){
      if(selectedBoxPack3 === "" || selectedSizePack3 === ""){
        alert("Por favor, selecciona una opción para el paquete y el tamaño");
        return;
      }
    }
    if(id === 3){
      if(selectedBoxPack10 === "" || selectedSizePack10 === ""){
        alert("Por favor, selecciona una opción para el paquete y el tamaño");
        return;
      }
    }
    let selectedItem 
    console.log(selectedBoxPack6, selectedSizePack6, selectedBoxPack3, selectedSizePack3, selectedBoxPack10, selectedSizePack10)
    if(id === 1){
      selectedItem = mappBox.find((item) => item.box === "1" && item.tipo === selectedBoxPack6 && item.cierre === selectedSizePack6);
    }
    if(id === 2){
      selectedItem = mappBox.find((item) => item.box === "2" && item.tipo === selectedBoxPack3 && item.cierre === selectedSizePack3);
    }
    if(id === 3){
      selectedItem = mappBox.find((item) => item.box === "3" && item.tipo === selectedBoxPack10 && item.cierre === selectedSizePack10);
    }
    console.log(id, selectedItem)

    const product: ProductItem = {
      sku: selectedItem?.id ?? "",
      id: parseInt(selectedItem?.id ?? "0"),
      parent: 0,
      parent_name: "",
      name: selectedItem?.name ?? "",
      public_price: id == 1 ? "984" : id == 2 ? "1722" : "2573",
      cedis_universo: "",
      cedis_galaxia: "",
      cedis_constelacion: "",
      cedis_sol: "",
      mayorista_luna: "",
      mayorista_estrella: "",
      minorista_nebulosa: "",
      promotora_cometa: "",
      sat: "",
      categories: "",
      images: id == 1 ? "/imgs/3box.jpg" : id == 2 ? "/imgs/6box.jpg" : "/imgs/10box.jpg",
      stock: 100,
      description: id == 1 ? "Paquete misterioso con 3 pañales premium estampados." : id == 2 ? "Paquete misterioso con 6 pañales premium estampados." : "Paquete misterioso con 10 pañales premium estampados y 1 filtro de bambú.",
    }

    console.log(product)
  
      addToCart({ product: product, quantity: 1 })
      setShouldDisplayCart(true)

  }

  return (
    <Box sx={{ bgcolor: "#FFF8F0", minHeight: "100vh", color: "#333" }}>
      {/* Hero Section */}
      <img src="/imgs/popup.jpg" alt="Hero" style={{ width: "100%", height: "auto" }} />
      <Box
        sx={{
          background: `linear-gradient(135deg, ${green} 0%, ${green} 100%)`,
          py: 6,
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
          marginTop: "-10px",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "30px 30px",
            opacity: 0.3,
          }
        }}
      >
        <Container sx={{ position: "relative", zIndex: 1 }}>
          <Typography
            variant="h3"
            sx={{ 
              fontWeight: 800, 
              mb: 2, 
              letterSpacing: "-0.5px",
              color: "white",
              textShadow: "2px 2px 4px rgba(0,0,0,0.3)"
            }}
          >
           🎄 La Magia de la Sorpresa Ecopipo 🎄
          </Typography>
          <Typography
            variant="h5"
            sx={{
              maxWidth: 800,
              mx: "auto",
              color: "white",
              lineHeight: 1.6,
              mb: 4,
              textShadow: "1px 1px 2px rgba(0,0,0,0.3)"
            }}
          >
            ¡Llegaron las Mystery Boxes Navideñas de Ecopipo! 🎁 Cajas sorpresa llenas de magia, valor y diseños de edición limitada que ¡Cuando se acaben... se acaban!
          </Typography>
          
          <Stack
            direction={{"xs": "column", "md": "row"}}
            justifyContent="center"
            alignItems="center"
            spacing={1}
            sx={{ mb: 3 }}
          >
            <AccessTimeIcon sx={{ color: gold, fontSize: 28 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, color: "white", textShadow: "1px 1px 2px rgba(0,0,0,0.3)" }}>
              Promoción válida del 10 al 26 de diciembre
            </Typography>
          </Stack>
          <Box>
          <a href="#mystery-boxes" style={{ textDecoration: "none" }}>
          <Button
            variant="contained"
            className="btn-responsive"
            size="large"
            sx={{
              bgcolor: red,
              color: "white",
              fontWeight: 700,
              borderRadius: 3,
              px: 4,
              py: 1.5,
              fontSize: "1.1rem",
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
              ":hover": { 
                bgcolor: "#F4D03F",
                transform: "translateY(-2px)",
                boxShadow: "0 6px 16px rgba(0,0,0,0.4)",
              },
              transition: "all 0.3s ease",
            }}
          >
            🎁 VER MYSTERY BOXES
          </Button>
          </a>
          </Box>
        </Container>
      </Box>

      {/* Descripción de la campaña */}
      <Container sx={{ py: 6 }}>
        <Box
          sx={{
            bgcolor: "white",
            borderRadius: 4,
            p: 4,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            border: `3px solid ${gold}`,
          }}
        >
          <Typography
            variant="h4"
            sx={{
              color: red,
              fontWeight: 800,
              mb: 3,
              textAlign: "center",
              letterSpacing: "-0.5px",
            }}
          >
            🎁 Mystery Box Navideña Ecopipo
          </Typography>

          <Typography sx={{ mb: 2, color: "#444", lineHeight: 1.8, textAlign: "center", fontSize: "1.1rem" }}>
            Un concepto que mezcla sorpresa, diversión y edición limitada navideña. Cada caja es un regalo inesperado lleno de valor y productos que pronto se despiden, convirtiéndola en un tesoro especial.
          </Typography>

          <Typography sx={{ mb: 3, color: "#444", lineHeight: 1.8, textAlign: "center", fontSize: "1.1rem" }}>
            <strong>¡Déjate sorprender!</strong> Elige tu Mystery Box y recibe diseños misteriosos de edición limitada. Cada caja es una experiencia única — <strong>¡nunca sabrás cuáles te tocarán hasta que la abras!</strong> Perfecto para regalar o para comenzar tu colección Ecopipo. 🎄✨
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Button
              onClick={() => setShowMysteryBoxModal(true)}
              variant="outlined"
              size="large"
              sx={{
                borderColor: red,
                color: red,
                fontWeight: 600,
                borderRadius: 3,
                px: 4,
                py: 1.5,
                borderWidth: 2,
                ":hover": { 
                  borderColor: red,
                  bgcolor: red,
                  color: "white",
                  borderWidth: 2,
                },
              }}
            >
              ¿Qué Contiene la Mystery Box?
            </Button>
          </Box>
        </Box>
      </Container>

      {/* Mystery Box Section */}
      <Container sx={{ py: 10 }} id="mystery-boxes">
        <Typography
          variant="h4"
          textAlign="center"
          sx={{ mb: 2, color: red, fontWeight: 800 }}
        >
           ¡Escoge ya tu Mystery Box Navideña! 🎄
        </Typography>
        <Typography
          variant="h6"
          textAlign="center"
          sx={{ mb: 6, color: "#666", fontWeight: 500 }}
        >
           Edición limitada • Existencias limitadas
        </Typography>
        


        <Box sx={{ display: 'grid', gridTemplateColumns: {'xs': 'repeat(1, 1fr)', 'md': 'repeat(3, 1fr)'}, gap: 4 }}>
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
                  <Typography sx={{ fontWeight: 700, color: red, fontSize: "1.4rem", mb: 1 }}>
                    {box.title}
                  </Typography>
                  <Typography sx={{ mt: 1, mb: 2, color: "#444", lineHeight: 1.6 }}>
                    {box.desc}
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                    <LocalOfferIcon sx={{ color: green }} />
                    <Typography sx={{ color: green, fontWeight: 700, fontSize: "1rem" }}>
                      {box.discountText}
                    </Typography>
                  </Stack>
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="body2" sx={{ color: "#999", textDecoration: "line-through", mb: 0.5 }}>
                      ${box.originalPrice} MXN
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: red }}>
                      ${box.price} MXN
                    </Typography>
                    <Typography variant="body2" sx={{ color: green, fontWeight: 600 }}>
                      Ahorras ${box.savings} MXN
                    </Typography>
                  </Box>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="body2" sx={{ fontWeight: 700, color: red, mb: 1 }}>Género</Typography>
                  <Select 
                    value={box.id === 1 ? selectedBoxPack6 : box.id === 2 ? selectedBoxPack3 : selectedBoxPack10} 
                    onChange={(e) => box.id === 1 ? setSelectedBoxPack6(e.target.value) : box.id === 2 ? setSelectedBoxPack3(e.target.value) : setSelectedBoxPack10(e.target.value)} 
                    fullWidth
                    sx={{ mb: 2 }}
                  >
                    <MenuItem value="">Selecciona una opción</MenuItem>
                    <MenuItem value="unisex">Unisex</MenuItem>
                    <MenuItem value="nino">Niño</MenuItem>
                    <MenuItem value="nina">Niña</MenuItem>
                  </Select>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: red, mb: 1 }}>Tipo de cierre</Typography>
                  <Select 
                    value={box.id === 1 ? selectedSizePack6 : box.id === 2 ? selectedSizePack3 : selectedSizePack10} 
                    onChange={(e) => box.id === 1 ? setSelectedSizePack6(e.target.value) : box.id === 2 ? setSelectedSizePack3(e.target.value) : setSelectedSizePack10(e.target.value)} 
                    fullWidth
                    sx={{ mb: 2 }}
                  >
                    <MenuItem value="">Selecciona una opción</MenuItem>
                    <MenuItem value="velcro">Velcro</MenuItem>
                    <MenuItem value="broches">Broches</MenuItem>
                  </Select>
                  <Typography variant="caption" sx={{ color: "#999", fontStyle: "italic", display: "block", mb: 2, textAlign: "center" }}>
                    *Diseños sorpresa, no se pueden elegir
                  </Typography>
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{
                      mt: 1,
                      bgcolor: red,
                      color: "white",
                      fontWeight: 700,
                      borderRadius: 3,
                      py: 1.5,
                      fontSize: "1.1rem",
                      boxShadow: "0 4px 12px rgba(200,16,46,0.3)",
                      ":hover": { 
                        bgcolor: "#A00D25",
                        transform: "translateY(-2px)",
                        boxShadow: "0 6px 16px rgba(200,16,46,0.4)",
                      },
                      transition: "all 0.3s ease",
                    }}
                    onClick={() => {
                      validateMysteryBox(box.id)
                    }}
                  >
                    🎁 Añadir al carrito
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Box>
      </Container>


      {/* Footer */}
      <Box sx={{ 
        background: `linear-gradient(135deg, #1F4F2E 0%, #1F4F2E 100%)`,
        py: 6, 
        textAlign: "center", 
        color: "white",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "30px 30px",
          opacity: 0.3,
        }
      }}>
        <Box sx={{ position: "relative", zIndex: 1 }}>
          <img src="/imgs/Ecopipo-llsm.png" alt="Footer" style={{ width: "100px", height: "auto" }} /> 
          <Typography variant="h5" sx={{ fontWeight: 700, mt: 1, textShadow: "1px 1px 2px rgba(0,0,0,0.3)" }}>
            Navidad y Año Nuevo con Ecopipo 🎄✨
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.95, mt: 2, textShadow: "1px 1px 2px rgba(0,0,0,0.2)" }}>
            Ecopipo® 2025 — Celebrando contigo con dulzura y sustentabilidad 💚
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.8, mt: 2, fontStyle: "italic" }}>
            Existencias limitadas
          </Typography>
        </Box>
      </Box>
      <MysteryBoxModal open={showMysteryBoxModal} onClose={() => setShowMysteryBoxModal(false)} />
    </Box>
  );
};

export default MysteryBoxNavideno;