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
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

type MysteryBoxModalProps = {
  open: boolean;
  onClose: () => void;
}

const features = [
  "Cada Mystery Box contiene pañales premium estampados de edición limitada seleccionados al azar.",
  "Los diseños son una sorpresa total — ¡nunca sabrás cuáles te tocarán hasta que abras tu caja!",
  "Puedes elegir el género (Niño, Niña o Unisex) y el tipo de cierre (Velcro o Broches).",
  "Perfecto para regalar o para comenzar tu colección Ecopipo con diseños únicos.",
];

const MysteryBoxModal = ({ open, onClose }: MysteryBoxModalProps) => {
  const red = "#C8102E";
  const green = "#228B22";
  const gold = "#D4AF37";

  return (
      <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="mystery-box-navideno"
      aria-describedby="promo-navideno-ecopipo"
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
          boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
          position: "relative",
          overflow: "hidden",
          background: `linear-gradient(135deg, #fff 0%, #FFF8F0 100%)`,
          border: `3px solid ${gold}`,
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
            color: "#666",
            zIndex: 10,
            "&:hover": { color: red },
          }}
        >
          <CloseIcon />
        </Box>

        <CardContent sx={{ p: 5, maxHeight: "80vh", overflowY: "auto" }}>
 

          <Stack spacing={2} alignItems="left">
          <Typography
            variant="h5"
            sx={{
              color: red,
              fontWeight: 800,
              mb: 2,
              display: "flex",
              gap: 1,
              textAlign: "center",
              justifyContent: "center",
            }}
          >
             ¿Qué Contiene la Mystery Box Navideña?
             <br />
             🎄
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: "#444",
              mb: 3,
              textAlign: "center",
              lineHeight: 1.7,
              fontSize: "1.05rem",
            }}
          >
            Cada caja es una sorpresa mágica llena de productos de edición limitada. ¡Descubre qué diseños únicos te tocarán!
          </Typography>

          <Stack spacing={1.5} sx={{ mb: 3 }} alignItems="left">
            {features.map((f, i) => (
              <Box key={i} sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                <CheckCircleIcon sx={{ color: green, mt: 0.5, flexShrink: 0 }} />
                <Typography sx={{ color: "#555", lineHeight: 1.7 }}>{f}</Typography>
              </Box>
            ))}
          </Stack>

          <Divider sx={{ my: 3, borderColor: gold, borderWidth: 2 }} />

          <Box
            sx={{
              bgcolor: "#FFF8F0",
              borderRadius: 2,
              p: 2,
              border: `2px solid ${gold}`,
            }}
          >
            <Typography
              sx={{
                color: red,
                fontStyle: "italic",
                fontWeight: 600,
                textAlign: "center",
                fontSize: "1.1rem",
              }}
            >
            ¡La Magia de la Sorpresa Ecopipo! <br /> ✨
            </Typography>
            <Typography
              sx={{
                color: "#666",
                textAlign: "center",
                mt: 1,
                fontSize: "0.95rem",
              }}
            >
              Ideal para regalar o para comenzar tu colección con diseños únicos de edición limitada
            </Typography>
          </Box>

          </Stack>

          <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Button
            variant="contained"
            sx={{
              mt: 4,
              backgroundColor: red,
              color: "white",
              fontWeight: 700,
              px: 4,
              py: 1.5,
              borderRadius: 3,
              fontSize: "1.1rem",
              boxShadow: "0 4px 12px rgba(200,16,46,0.3)",
              "&:hover": {
                backgroundColor: "#A00D25",
                transform: "translateY(-2px)",
                boxShadow: "0 6px 16px rgba(200,16,46,0.4)",
              },
              transition: "all 0.3s ease",
            }}
            onClick={onClose}
          >
            🎁 Ver Mystery Boxes
          </Button>
          </Box>
        </CardContent>
      </Card>
    </Modal>
  );
};

export default MysteryBoxModal;