'use client';
import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Stack,
  Link,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import CelebrationIcon from "@mui/icons-material/Celebration";
import MysteryBoxModal from "../_components/MysteryBoxModal";
import { BRAND_PURPLE, BRAND_GREEN, BRAND_GREEN_HOVER, BRAND_PURPLE_HOVER } from "@/lib/constants";
import { PACKS } from "./types";
import PackWizard from "./PackWizard";

const DulcesDieciseis = () => {
  const purple = BRAND_PURPLE;
  const green = BRAND_GREEN;

  const [showMysteryBoxModal, setShowMysteryBoxModal] = useState<boolean>(false);
  const [wizardPack, setWizardPack] = useState<typeof PACKS[0] | null>(null);


  return (
    <Box sx={{ bgcolor: "#F8F8F8", minHeight: "100vh", color: "#333", pb: { xs: 6, sm: 0 } }}>
      {/* Hero Section  
      
       */}
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
            Pack Inteligente, Tranquilidad o Libertad: elige tu pack Expo, selecciona tus pañales lisos, estampados y bolsa. Incluye filtro bambú y detergente. Precio especial en cada pack.
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
              Elige tu pack y personaliza tus productos
            </Typography>
          </Stack>
          <Box>
          <a href="#packs-expo">
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
            VER PACKS EXPO
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

      {/* Packs Expo Section */}
      <Container sx={{ py: 10 }} id="packs-expo">
        <Typography variant="h4" textAlign="center" sx={{ mb: 2, color: purple, fontWeight: 800 }}>
          Escoge tu pack Expo
        </Typography>
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Button
            onClick={() => setShowMysteryBoxModal(true)}
            variant="outlined"
            size="medium"
            sx={{
              borderColor: purple,
              color: purple,
              fontWeight: 600,
              "&:hover": { borderColor: BRAND_PURPLE_HOVER, bgcolor: "rgba(115,48,128,0.04)" },
            }}
          >
            ¿Cómo funcionan los packs?
          </Button>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 4 }}>
          {PACKS.map((pack) => {
            const isGreen = pack.color === 'green';
            const accent = isGreen ? green : purple;
            const accentHover = isGreen ? BRAND_GREEN_HOVER : BRAND_PURPLE_HOVER;
            const content = [
              `${pack.lisos} pañales lisos`,
              `${pack.estampados} pañales estampados`,
              pack.wetbag ? '1 bolsa impermeable' : null,
              '1 filtro bambú',
              '1 detergente',
            ].filter(Boolean).join(' · ');
            return (
              <Box key={pack.id}>
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
                  <Box
                    component="img"
                    src="/imgs/placeholder.png"
                    alt={pack.name}
                    onError={(e) => {
                      const t = e.target as HTMLImageElement;
                      t.src = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="240" viewBox="0 0 400 240"><rect fill="%23EFE9F1" width="400" height="240"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23733080" font-family="sans-serif" font-size="18">' + pack.name + '</text></svg>');
                    }}
                    sx={{ width: "100%", height: 200, objectFit: "cover", bgcolor: "#EFE9F1" }}
                  />
                  <CardContent>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: accent }}>
                      {pack.name}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1, mb: 2, color: "#444" }}>
                      {content}
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2, flexWrap: "wrap" }}>
                      <LocalOfferIcon sx={{ color: green }} />
                      <Typography sx={{ color: purple, fontWeight: 600 }}>
                        De ${pack.priceOriginal.toLocaleString('es-MX')} → ${pack.priceDiscounted.toLocaleString('es-MX')}
                      </Typography>
                    </Stack>
                    <Button
                      variant="contained"
                      fullWidth
                      sx={{
                        mt: 1,
                        bgcolor: accent,
                        color: "white",
                        fontWeight: 600,
                        borderRadius: 2,
                        minHeight: 44,
                        boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
                        "&:hover": {
                          bgcolor: accentHover,
                          transform: "translateY(-2px)",
                          boxShadow: "0 6px 18px rgba(0,0,0,0.2)",
                        },
                      }}
                      onClick={() => setWizardPack(pack)}
                    >
                      Elegir pack
                    </Button>
                  </CardContent>
                </Card>
              </Box>
            );
          })}
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
      {wizardPack && (
        <PackWizard
          pack={wizardPack}
          open={!!wizardPack}
          onClose={() => setWizardPack(null)}
        />
      )}
    </Box>
  );
};

export default DulcesDieciseis;
