'use client';
import React from "react";
import {
  Box,
  Typography,
  Modal,
  Card,
  CardContent,
  Button,
  Divider,
  Stack,
} from "@mui/material";
import CelebrationIcon from "@mui/icons-material/Celebration";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

type MysteryBoxModalProps = {
  open: boolean;
  onClose: () => void;
}

const features = [
  "Incluye 3 o 6 pañales estampados misteriosos (según la opción elegida).",
  "Puedes elegir la categoría: niño, niña o unisex.",
  "Unitalla: se ajusta al crecimiento de tu bebé.",
  "Doble barrera antiescurrimiento para máxima protección.",
  "Telas certificadas, suaves y seguras para la piel sensible.",
  "Cierres ajustables con broches o velcro.",
  "Fáciles de lavar y reutilizar, cuidando el planeta y tu bolsillo.",
];

const MysteryBoxModal = ({ open, onClose }: MysteryBoxModalProps) => {
  const purple = "#733080";
  const green = "#89b329";

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="dulces-dieciseis"
      aria-describedby="promo-ecopipo"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backdropFilter: "blur(4px)",
      }}
    >
      <Card
        sx={{
          width: { xs: "90%", sm: 500 },
          borderRadius: 4,
          boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
          position: "relative",
          overflow: "hidden",
          background: `#eee`,
          color: "white",
          textAlign: "left",
          animation: "fadeIn 0.6s ease-out",
        }}
      >
        {/* Botón de cierre */}
        <Box
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            cursor: "pointer",
            color: "#fff9",
            "&:hover": { color: "#fff" },
          }}
        >
          <CloseIcon />
        </Box>

        <CardContent sx={{ p: 5, maxHeight: "80vh", overflowY: "auto" }}>
 

          <Stack spacing={2} alignItems="left">
          <Typography
            variant="h5"
            sx={{
              color: purple,
              fontWeight: 700,
              mb: 2,
              display: "flex",
              gap: 1,
            }}
          >
            ✨ ¡Esto contiene tu Mystery Box!
          </Typography>

          <Stack spacing={1.5} sx={{ mb: 3 }} alignItems="left">
            {features.map((f, i) => (
              <Box key={i} sx={{ display: "flex", alignItems: "left", gap: 1.5 }}>
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

          </Stack>

          <Button
            variant="contained"
            sx={{
              mt: 4,
              backgroundColor: "white",
              color: purple,
              fontWeight: "bold",
              px: 4,
              py: 1.2,
              borderRadius: 3,
              "&:hover": {
                backgroundColor: "#a5cc40",
                transform: "scale(1.03)",
              },
              transition: "all 0.2s ease",
            }}
            onClick={onClose}
          >
            ¡Ir a comprar ahora!
          </Button>
        </CardContent>
      </Card>
    </Modal>
  );
};

export default MysteryBoxModal;