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
import { BRAND_PURPLE, BRAND_GREEN, BRAND_PURPLE_HOVER, BRAND_GREEN_HOVER } from "@/lib/constants";

type MysteryBoxModalProps = {
  open: boolean;
  onClose: () => void;
};

const steps = [
  {
    title: "Elige tu pack",
    body: "Pack Inteligente (4 lisos + 4 estampados), Pack Tranquilidad (5 lisos + 10 estampados + bolsa) o Pack Libertad (8 lisos + 12 estampados + bolsa). Todos incluyen filtro bambú y detergente.",
  },
  {
    title: "Elige tus lisos",
    body: "Selecciona los pañales premium lisos que quieres. La cantidad depende del pack que elegiste.",
  },
  {
    title: "Elige tus estampados",
    body: "Elige tus pañales estampados favoritos. Puedes repetir diseños o mezclar según el pack.",
  },
  {
    title: "Bolsa y resumen",
    body: "En Pack Tranquilidad y Libertad elige tu bolsa impermeable (wetbag). Revisa tu resumen y al dar «Pagar» se agrega todo al carrito al precio del pack.",
  },
];

const MysteryBoxModal = ({ open, onClose }: MysteryBoxModalProps) => {
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
          maxHeight: "90vh",
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

        <CardContent sx={{ p: 3, pt: 4, maxHeight: "85vh", overflowY: "auto" }}>
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

          <Stack spacing={2}>
            {steps.map((step, i) => (
              <Box
                key={i}
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 1.5,
                }}
              >
                <CheckCircleIcon
                  sx={{ color: BRAND_GREEN, mt: 0.3, flexShrink: 0 }}
                />
                <Box>
                  <Typography
                    sx={{
                      fontWeight: 700,
                      color: BRAND_PURPLE,
                      fontSize: "1rem",
                    }}
                  >
                    {step.title}
                  </Typography>
                  <Typography
                    sx={{ color: "#555", lineHeight: 1.7, fontSize: "0.95rem" }}
                  >
                    {step.body}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Stack>

          <Divider sx={{ my: 3, borderColor: BRAND_PURPLE, opacity: 0.5 }} />

          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Button
              variant="contained"
              onClick={onClose}
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
              Entendido, ver packs
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Modal>
  );
};

export default MysteryBoxModal;
