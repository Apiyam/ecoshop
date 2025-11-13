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
  "Tu paquete no necesita tener el mismo tamaño, estampado, color, etc",
  "Obtienes un descuento del 5% cuando añades al menos 6 productos iguales o diferentes.",
  "Obtienes un descuento del 8% cuando añades al menos 10 productos iguales o diferentes.",
  "Obtienes un descuento del 10% cuando añades al menos 15 productos iguales o diferentes.",
  "Obtienes un descuento del 12% cuando añades a partir de 20 productos iguales o diferentes.",
  "Además, recibe 10% de descuento adicional en tu compra total usando el cupón PIPOFIN.",
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
          width: { xs: "90%", sm: 700 },
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
            ✨ ¿Cómo armo mi paquete personalizado?
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
            💚 Ideal para quienes quieren ampliar su colección Ecopipo con diseños únicos 😍
          </Typography>

          </Stack>

          <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Button
            variant="contained"
            sx={{
              mt: 4,
              backgroundColor: purple,
              color: "white",
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
            ¡Ir a armar mi paquete!
          </Button>
          </Box>
        </CardContent>
      </Card>
    </Modal>
  );
};

export default MysteryBoxModal;