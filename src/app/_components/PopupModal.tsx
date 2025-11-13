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
import { useCart } from "@/context/CartContext";

type PopupModalProps = {
  open: boolean;
  onClose: () => void;
}
const PopupModal = ({ open, onClose }: PopupModalProps) => {
  const purple = "#733080";
  const green = "#89b329";
  const { goalCustomPackage } = useCart()
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
          background: `#531f5e`,
          color: "white",
          textAlign: "center",
          animation: "fadeIn 0.6s ease-out",
          maxHeight: "80vh",
          overflowY: "auto",
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

        <CardContent sx={{ p: 5 }}>
          <CelebrationIcon sx={{ fontSize: 48, color: green, mb: 1 }} />
          <Typography
            id="dulces-dieciseis"
            variant="h5"
            fontWeight="bold"
            sx={{ mb: 1 }}
          >
             🎉 ¡Arma tu paquete personalizado!
          </Typography>

          <Typography variant="body1" sx={{ mb: 2 }}>
          Obtén 10% de descuento en toda la tienda usando el código 🟩 PIPOFIN.
<br />
Además, disfruta descuentos adicionales en paquetes de 6, 10, 15 y 20 piezas. ✨ Entre más productos elijas, ¡más ahorras! 😍
          </Typography>

          <Divider
            sx={{
              my: 2,
              borderColor: "rgba(255,255,255,0.2)",
            }}
          />

          <Stack spacing={2} alignItems="center">
            <Typography variant="body1">
              Aprovecha{" "}
              <strong style={{ color: green, fontSize: "1.2em" }}>
                10% de descuento
              </strong>{" "}
              en toda la tienda ✨
            </Typography>

            <Typography variant="body1">
              Entre más productos elijas,{" "}
              <strong>más descuento obtienes 🤩</strong>
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

export default PopupModal;