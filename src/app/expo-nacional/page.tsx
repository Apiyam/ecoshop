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
} from "@mui/material";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import CelebrationIcon from "@mui/icons-material/Celebration";
import Link from "next/link";
import { BRAND_PURPLE, BRAND_GREEN, BRAND_GREEN_HOVER, BRAND_PURPLE_HOVER } from "@/lib/constants";
import { PACKS } from "./types";
import PackWizard from "./PackWizard";

const DulcesDieciseis = () => {
  const purple = BRAND_PURPLE;
  const green = BRAND_GREEN;

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
          <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
            <iframe
              width="360"
              height="203"
              src="https://www.youtube.com/embed/CxC8gIuPOOA?rel=0&modestbranding=1&controls=0"
              title="Ecopipo - Expo Nacional"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              style={{ borderRadius: 12, maxWidth: "100%" }}
            />
          </Box>
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, color: purple }}
          >
            Paquetes especiales Ecopipo🤩
          </Typography>
          <Typography
            variant="body1"
            sx={{ fontWeight: 400, color: "#444", marginTop: 2 }}
          >
            Todo lo que necesitas para empezar. <br /> Elige el tuyo y aprovecha la promoción de Expo Nacional.
          </Typography>
          <Box sx={{ textAlign: "center", marginTop: 2 }}>
          <Button
            component={Link}
            href="/expo-nacional/como-funcionan"
            variant="outlined"
            size="medium"
            sx={{
              borderColor: purple,
              color: purple,
              fontWeight: 600,
              textDecoration: "none",
              "&:hover": { borderColor: BRAND_PURPLE_HOVER, bgcolor: "rgba(115,48,128,0.04)" },
            }}
          >
            ¿Cómo funcionan los packs?
          </Button>
        </Box>
        </Container>
      </Box>

      {/* Packs Expo Section */}
      <Container sx={{ py: 4}} id="packs-expo">
        <Typography variant="h4" textAlign="center" sx={{ mb: 2, color: purple, fontWeight: 800 }}>
          Escoge tu pack Expo
        </Typography>
        

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
                    src={`/imgs/${pack.id}.jpg`}
                    alt={pack.name}
                    sx={{ width: "100%", height: 500, objectFit: "cover", bgcolor: "#EFE9F1" }}
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

        <Typography variant="h6" sx={{ fontWeight: 600, mt: 1.5, textAlign: "center" }}>
          Tienes dudas? Envia un mensaje a nuestro WhatsApp <Link href="https://wa.me/5215545485352" style={{ color: green }} target="_blank">CLICK AQUÍ</Link>
        </Typography>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 2,
          mt: 3,
          flexWrap: "wrap",
          flexDirection: { xs: "column", sm: "row" },
          width: "100%",
        }}
      >
        <Button
          variant="contained"
          sx={{
            width: { xs: "100%", sm: "auto" },
            bgcolor: green,
            color: "white",
            fontWeight: 600,
            borderRadius: 2,
            minHeight: 44,
            px: 3,
            "&:hover": {
              borderColor: BRAND_PURPLE,
              color: BRAND_PURPLE_HOVER,
              bgcolor: "#f5f5f5",
            },
          }}
          href="/expo-nacional#packs-expo"
        >
          Ver packs expo
        </Button>
        <Button
          variant="contained"
          color="secondary"
          sx={{
            width: { xs: "100%", sm: "auto" },
            bgcolor: BRAND_PURPLE,
            color: "white",
            fontWeight: 600,
            borderRadius: 2,
            minHeight: 44,
            px: 3,
            boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
            "&:hover": {
              bgcolor: BRAND_PURPLE_HOVER,
              transform: "translateY(-2px)",
              boxShadow: "0 6px 18px rgba(0,0,0,0.2)",
            },
          }}
          href="/tienda"
        >
          Tienda Ecopipo
        </Button>
      </Box>
      </Container>


      {/* Footer */}
      <Box
        component="footer"
        sx={{
          bgcolor: purple,
          py: 6,
          px: 2,
          color: "white",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <Container maxWidth="sm" sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <CelebrationIcon sx={{ color: green, fontSize: 48, mb: 1.5 }} />
          <Typography variant="h6" sx={{ fontWeight: 600, lineHeight: 1.4, maxWidth: 420, mx: "auto" }}>
            Paquetes personalizados, ecológicos y sustentables para tu familia
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9, mt: 1.5 }}>
            Ecopipo® 2026 — Empresa 100% mexicana.
          </Typography>
        </Container>
      </Box>
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
