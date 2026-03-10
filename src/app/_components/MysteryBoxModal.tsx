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
import { BRAND_PURPLE, BRAND_GREEN, BRAND_PURPLE_HOVER, BRAND_GREEN_HOVER } from "@/lib/constants";

type MysteryBoxModalProps = {
  open: boolean;
  onClose: () => void;
};

const PACKS_SECTION_ID = "packs-expo";

const MysteryBoxModal = ({ open, onClose }: MysteryBoxModalProps) => {
  const handleVerPacks = () => {
    onClose();
    document.getElementById(PACKS_SECTION_ID)?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-paquetes-title"
      aria-describedby="modal-paquetes-desc"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
        backdropFilter: "blur(4px)",
      }}
    >
      <Card
        sx={{
          width: { xs: "100%", sm: 560 },
          maxHeight: "75vh",
          borderRadius: 3,
          boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
          position: "relative",
          overflow: "hidden",
          border: `2px solid ${BRAND_PURPLE}`,
          background: "linear-gradient(180deg, #fff 0%, #EFE9F1 100%)",
        }}
      >
        <Box
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            cursor: "pointer",
            color: BRAND_PURPLE,
            zIndex: 10,
            "&:hover": { color: BRAND_PURPLE_HOVER },
          }}
        >
          <CloseIcon />
        </Box>

        <CardContent sx={{ p: 2, pt: 4, maxHeight: "85vh", overflowY: "auto" }}>
          <Typography
            id="modal-paquetes-title"
            variant="h5"
            sx={{
              color: BRAND_PURPLE,
              fontWeight: 800,
              mb: 1,
              textAlign: "center",
            }}
          >
            ¿Cómo funcionan los packs Expo?
          </Typography>
          <Typography
            id="modal-paquetes-desc"
            variant="body1"
            sx={{
              color: "#444",
              mb: 3,
              textAlign: "center",
              lineHeight: 1.6,
            }}
          >
            En cuatro pasos: eliges pack, tus lisos, tus estampados, tu bolsa (si aplica) y pagas.
          </Typography>

          <Stack spacing={2.5} component="ol" sx={{ pl: 2.5, listStyle: "none", counterReset: "step" }}>
            <Box component="li" sx={{ display: "flex", alignItems: "flex-start", gap: 1.5, "&::before": { counterIncrement: "step", content: "counter(step) \".-\" \" \"", fontWeight: 700, color: BRAND_PURPLE } }}>
              <Box>
                <Typography sx={{ fontWeight: 700, color: BRAND_PURPLE, fontSize: "1rem" }}>
                  Elige tu pack
                </Typography>
                <Typography component="span" sx={{ color: "#555", lineHeight: 1.7, fontSize: "0.95rem", display: "block" }}>
                  Pack Inteligente (4 lisos + 4 estampados), Pack Tranquilidad (5 lisos + 10 estampados + bolsa) o Pack Libertad (8 lisos + 12 estampados + bolsa). Todos incluyen filtro bambú y detergente.
                </Typography>
              </Box>
            </Box>
            <Box component="li" sx={{ display: "flex", alignItems: "flex-start", gap: 1.5, "&::before": { counterIncrement: "step", content: "counter(step) \".-\" \" \"", fontWeight: 700, color: BRAND_PURPLE } }}>
              <Box>
                <Typography sx={{ fontWeight: 700, color: BRAND_PURPLE, fontSize: "1rem" }}>
                  Elige tus lisos
                </Typography>
                <Typography sx={{ color: "#555", lineHeight: 1.7, fontSize: "0.95rem" }}>
                  Selecciona los pañales premium lisos que quieres. La cantidad depende del pack que elegiste.
                </Typography>
              </Box>
            </Box>
            <Box component="li" sx={{ display: "flex", alignItems: "flex-start", gap: 1.5, "&::before": { counterIncrement: "step", content: "counter(step) \".-\" \" \"", fontWeight: 700, color: BRAND_PURPLE } }}>
              <Box>
                <Typography sx={{ fontWeight: 700, color: BRAND_PURPLE, fontSize: "1rem" }}>
                  Elige tus estampados
                </Typography>
                <Typography sx={{ color: "#555", lineHeight: 1.7, fontSize: "0.95rem" }}>
                  Elige tus pañales estampados favoritos. Puedes repetir diseños o mezclar según el pack.
                </Typography>
              </Box>
            </Box>
            <Box component="li" sx={{ display: "flex", alignItems: "flex-start", gap: 1.5, "&::before": { counterIncrement: "step", content: "counter(step) \".-\" \" \"", fontWeight: 700, color: BRAND_PURPLE } }}>
              <Box>
                <Typography sx={{ fontWeight: 700, color: BRAND_PURPLE, fontSize: "1rem" }}>
                  Bolsa y resumen
                </Typography>
                <Typography sx={{ color: "#555", lineHeight: 1.7, fontSize: "0.95rem" }}>
                  En Pack Tranquilidad y Libertad elige tu bolsa impermeable (wetbag). Revisa tu resumen y al dar «Pagar» se agrega todo al carrito al precio del pack.
                </Typography>
              </Box>
            </Box>
            <Divider sx={{ my: 3, borderColor: BRAND_PURPLE, opacity: 0.5 }} />

<Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
  <Button
    variant="contained"
    onClick={handleVerPacks}
    sx={{
      bgcolor: BRAND_GREEN,
      color: "white",
      fontWeight: 700,
      px: 4,
      py: 1.5,
      minHeight: 44,
      borderRadius: 2,
      fontSize: "1rem",
      boxShadow: "0 4px 14px rgba(137,179,41,0.35)",
      transition: "all 0.2s ease",
      "&:hover": {
        bgcolor: BRAND_GREEN_HOVER,
        transform: "translateY(-2px)",
        boxShadow: "0 6px 18px rgba(137,179,41,0.45)",
      },
    }}
  >
    ENTENDIDO VER PACKS
  </Button>
</Box>
          </Stack>

         
        </CardContent>
      </Card>
    </Modal>
  );
};

export default MysteryBoxModal;
