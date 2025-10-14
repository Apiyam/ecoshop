'use client';
import React from "react";
import { Box, Typography, Container, Stack, Card, CardContent, Divider } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const SixteenDescription = () => {
  const purple = "#733080";
  const green = "#89b329";


  {
    /*
    <Stack spacing={1.5} sx={{ mb: 3 }}>
            {features.map((f, i) => (
              <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <CheckCircleIcon sx={{ color: green }} />
                <Typography sx={{ color: "#555", lineHeight: 1.5 }}>{f}</Typography>
              </Box>
            ))}
          </Stack>
    */
  }

  return (
    <Container sx={{ py: 6 }} >
      <Card
        elevation={3}
        sx={{
          borderRadius: 4,
          overflow: "hidden",
          bgcolor: "#fff",
          px: { xs: 3, md: 6 },
          py: { xs: 4, md: 6 },
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        }}
      >
        <CardContent>
          <Typography
            variant="h4"
            sx={{
              color: purple,
              fontWeight: 800,
              mb: 3,
              textAlign: "center",
              letterSpacing: "-0.5px",
            }}
          >
            💝 Mystery Box Ecopipo
          </Typography>

          <Typography sx={{ mb: 2, color: "#444", lineHeight: 1.7, textAlign: "center", fontSize: "1.2rem" }}>
          ¡Hasta 37% de descuento! Ideal para quienes aman la sorpresa y quieren vivir la emoción de no saber qué diseño les tocará 😍
          </Typography>

          <Typography sx={{ mb: 3, color: "#444", lineHeight: 1.7, textAlign: "center", fontSize: "1.2rem" }}>
          ¡Déjate sorprender con nuestras Mystery Box Ecopipo! 🎁 Elige un paquete de 3 o 6 pañales premium estampados y recibe diseños misteriosos, seleccionados completamente al azar según la categoría que prefieras: niño, niña o unisex. Cada caja es una experiencia única — <strong>¡nunca sabrás cuáles te tocarán hasta que la abras!</strong>
          </Typography>

          <Divider sx={{ my: 3 }} />

        </CardContent>
      </Card>
    </Container>
  );
};

export default SixteenDescription;