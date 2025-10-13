'use client';
import React from "react";
import { Box, Typography, Container, Stack, Card, CardContent, Divider } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const SixteenDescription = () => {
  const purple = "#733080";
  const green = "#89b329";

  const features = [
    "Incluye 3 o 6 pañales estampados misteriosos (según la opción elegida).",
    "Puedes elegir la categoría: niño, niña o unisex.",
    "Unitalla: se ajusta al crecimiento de tu bebé.",
    "Doble barrera antiescurrimiento para máxima protección.",
    "Telas certificadas, suaves y seguras para la piel sensible.",
    "Cierres ajustables con broches o velcro.",
    "Fáciles de lavar y reutilizar, cuidando el planeta y tu bolsillo.",
  ];

  return (
    <Container sx={{ py: 6 }}>
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
            💝 Mistery Box Ecopipo
          </Typography>

          <Typography sx={{ mb: 2, color: "#444", lineHeight: 1.7 }}>
            Nuestra <strong>Mistery Box Ecopipo</strong> incluye un paquete de{" "}
            <strong>3 o 6 pañales premium estampados</strong> que se eligen de manera
            misteriosa (¡al azar!). Tú decides si prefieres diseños para{" "}
            <strong>niño, niña o unisex</strong>, y nosotros nos encargamos del resto.
          </Typography>

          <Typography sx={{ mb: 3, color: "#444", lineHeight: 1.7 }}>
            Cada pañal es <strong>unitalla</strong>, crece con tu bebé y está elaborado con{" "}
            <strong>telas certificadas, libres de químicos tóxicos</strong>, con{" "}
            <strong>doble barrera antiescurrimiento</strong>, ajuste con{" "}
            <strong>broches o velcro</strong> y <strong>absorbentes lavables</strong> que
            garantizan comodidad, protección y sustentabilidad.
          </Typography>

          <Divider sx={{ my: 3 }} />

          <Typography
            variant="h5"
            sx={{
              color: purple,
              fontWeight: 700,
              mb: 2,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            ✨ Características principales:
          </Typography>

          <Stack spacing={1.5} sx={{ mb: 3 }}>
            {features.map((f, i) => (
              <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <CheckCircleIcon sx={{ color: green }} />
                <Typography sx={{ color: "#555", lineHeight: 1.5 }}>{f}</Typography>
              </Box>
            ))}
          </Stack>

          <Divider sx={{ my: 3 }} />

          <Typography
            sx={{
              color: green,
              fontStyle: "italic",
              fontWeight: 500,
              textAlign: "center",
              fontSize: "1.1rem",
            }}
          >
            💚 Ideal para quienes aman la emoción de la sorpresa y quieren ampliar su
            colección Ecopipo con diseños únicos 😍
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

export default SixteenDescription;