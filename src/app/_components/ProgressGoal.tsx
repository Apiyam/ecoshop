'use client';

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Modal,
  Card,
  CardContent,
  Button,
  Divider,
  Stack,
  LinearProgress,
} from "@mui/material";
import CelebrationIcon from "@mui/icons-material/Celebration";
import StarIcon from "@mui/icons-material/Star";
import { useCart } from "@/context/CartContext";
import { BRAND_PURPLE, BRAND_GREEN, BRAND_PURPLE_HOVER } from "@/lib/constants";

const MILESTONES = [6, 10, 15, 20];

type GoalProgressProps = {
  onHeader?: boolean;
};

const GoalProgress = ({ onHeader = false }: GoalProgressProps) => {
  const purple = BRAND_PURPLE;
  const green = BRAND_GREEN;
  const [isTopGoal, setIsTopGoal] = useState(false);
  const {
    cartItems = [],
    currentGoal,
    nextGoal,
    setCurrentGoal,
    setNextGoal,
    discountGoals,
    currentDiscount,
  } = useCart();
  const { setCurrentDiscount } = useCart();
  const [openModal, setOpenModal] = useState(false);

  const unlockScroll = () => {
    requestAnimationFrame(() => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    });
  };

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const progress = Math.min(
    (totalItems / currentGoal.minProducts) * 100,
    100
  );
  const remaining = Math.max(currentGoal.minProducts - totalItems, 0);

  useEffect(() => {
    const reachedGoal = totalItems >= currentGoal.minProducts;
    if (reachedGoal && !isTopGoal) {
      setOpenModal(true);
      setCurrentDiscount(currentGoal.discount);
    }
    if (totalItems >= 20) {
      setIsTopGoal(true);
    }
  }, [totalItems, currentGoal.minProducts, currentGoal.discount, isTopGoal, setCurrentDiscount]);

  return (
    <Box
      sx={{
        width: "100%",
        mb: 0,
        mt: 1,
        position: onHeader ? "fixed" : "relative",
        margin: 0,
        left: 0,
        zIndex: 10000,
      }}
    >
      <Card
        sx={{
          overflow: "hidden",
          background: `linear-gradient(135deg, ${purple} 0%, ${BRAND_PURPLE_HOVER} 100%)`,
          color: "#fff",
          borderRadius: 0,
          boxShadow: "0 2px 8px rgba(115,48,128,0.25)",
        }}
      >
        <CardContent sx={{ py: 1.5, px: 2 }}>
          <Stack spacing={1.5}>
            {/* Número grande: X / Y piezas */}
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              flexWrap="wrap"
              gap={1}
            >
              <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.5 }}>
                <Typography
                  component="span"
                  sx={{
                    fontSize: { xs: "1.5rem", sm: "1.75rem" },
                    fontWeight: 800,
                    lineHeight: 1.2,
                  }}
                >
                  {totalItems}
                </Typography>
                <Typography
                  component="span"
                  sx={{
                    fontSize: { xs: "1rem", sm: "1.1rem" },
                    opacity: 0.95,
                  }}
                >
                  / {currentGoal.minProducts} piezas
                </Typography>
              </Box>
              {remaining > 0 && totalItems < 20 && (
                <Typography
                  sx={{
                    fontSize: { xs: "0.8rem", sm: "0.85rem" },
                    opacity: 0.95,
                  }}
                >
                  Faltan {remaining} para {currentGoal.discount}% dto.
                </Typography>
              )}
              {totalItems >= currentGoal.minProducts && currentDiscount > 0 && (
                <Typography
                  sx={{
                    fontSize: { xs: "0.8rem", sm: "0.85rem" },
                    fontWeight: 700,
                    bgcolor: "rgba(255,255,255,0.25)",
                    px: 1,
                    py: 0.25,
                    borderRadius: 1,
                  }}
                >
                  Tu descuento: {currentDiscount}%
                </Typography>
              )}
              {totalItems >= currentGoal.minProducts && !isTopGoal && nextGoal && (
                <Typography
                  sx={{
                    fontSize: { xs: "0.8rem", sm: "0.85rem" },
                    fontWeight: 600,
                  }}
                >
                  Siguiente: {nextGoal.minProducts} piezas = {nextGoal.discount}%
                </Typography>
              )}
              {isTopGoal && (
                <Typography sx={{ fontSize: "0.9rem", fontWeight: 600 }}>
                  Máximo descuento aplicado
                </Typography>
              )}
            </Stack>

            {/* Barra de progreso con hitos 6, 10, 15, 20 */}
            <Box sx={{ position: "relative" }}>
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{
                  height: 10,
                  borderRadius: 2,
                  bgcolor: "rgba(255,255,255,0.25)",
                  "& .MuiLinearProgress-bar": {
                    bgcolor: green,
                    borderRadius: 2,
                    transition: "transform 0.3s ease",
                  },
                }}
              />
              {/* Marcas de hitos */}
              <Stack
                direction="row"
                justifyContent="space-between"
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: 0,
                  right: 0,
                  transform: "translateY(-50%)",
                  px: 0.5,
                  pointerEvents: "none",
                }}
              >
                {MILESTONES.map((m) => (
                  <Box
                    key={m}
                    sx={{
                      width: 4,
                      height: 14,
                      borderRadius: 1,
                      bgcolor:
                        totalItems >= m
                          ? green
                          : "rgba(255,255,255,0.5)",
                    }}
                  />
                ))}
              </Stack>
            </Box>
            <Stack
              direction="row"
              justifyContent="space-between"
              sx={{ mt: 0.5 }}
            >
              {MILESTONES.map((m) => (
                <Typography
                  key={m}
                  sx={{
                    fontSize: "0.7rem",
                    opacity: totalItems >= m ? 1 : 0.8,
                    fontWeight: totalItems >= m ? 700 : 500,
                  }}
                >
                  {m}
                </Typography>
              ))}
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {/* Modal de celebración */}
      <Modal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
          unlockScroll();
        }}
        disableScrollLock
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 380,
            maxWidth: "95vw",
            bgcolor: "#fff",
            borderRadius: 4,
            boxShadow: 24,
            p: 4,
            textAlign: "center",
          }}
        >
          <CelebrationIcon sx={{ fontSize: 70, color: green }} />
          <Typography variant="h6" fontWeight="bold" sx={{ color: purple }} mt={2}>
            ¡Felicidades!
          </Typography>
          <Typography sx={{ mt: 1, color: "#000" }}>
            Alcanzaste la meta de {currentGoal.minProducts} productos y obtuviste
            un <b>{currentGoal.discount}%</b> de descuento.
          </Typography>

          {nextGoal && !isTopGoal && (
            <>
              <Divider sx={{ my: 2 }} />
              <Typography sx={{ fontSize: 15, color: "#000" }}>
                Sigue agregando productos para desbloquear aún más.
              </Typography>
              <Typography
                sx={{
                  fontWeight: "bold",
                  color: purple,
                  mt: 0.5,
                }}
              >
                Siguiente meta: {nextGoal.discount}% por {nextGoal.minProducts}{" "}
                productos.
              </Typography>
            </>
          )}

          <Button
            onClick={() => {
              if (currentGoal.minProducts === 20) {
                setOpenModal(false);
                setIsTopGoal(true);
                unlockScroll();
                return;
              }
              setCurrentGoal(nextGoal);
              setNextGoal(
                discountGoals.find((g) => g.minProducts > nextGoal.minProducts) ||
                  discountGoals[0]
              );
              setOpenModal(false);
              setIsTopGoal(false);
              unlockScroll();
            }}
            variant="contained"
            sx={{
              mt: 3,
              backgroundColor: purple,
              "&:hover": { backgroundColor: BRAND_PURPLE_HOVER },
              px: 3,
              borderRadius: 2,
            }}
            startIcon={<StarIcon />}
          >
            ¡Seguir Comprando!
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default GoalProgress;
