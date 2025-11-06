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
} from "@mui/material";
import CelebrationIcon from "@mui/icons-material/Celebration";
import CloseIcon from "@mui/icons-material/Close";
import StarIcon from "@mui/icons-material/Star";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { LinearProgress } from "@mui/joy";
import confetti from "canvas-confetti";
import { useCart } from "@/context/CartContext";

const discountGoals = [
  { minProducts: 6, discount: 5 },
  { minProducts: 10, discount: 8 },
  { minProducts: 15, discount: 10 },
  { minProducts: 20, discount: 12 },
];

const GoalProgress = () => {
  const purple = "#733080";
  const green = "#89b329";
  const gradient = "rgb(89 118 24)";
  const { goalCustomPackage = 15, cartItems = [], setGoalCustomPackage } = useCart();

  const [openModal, setOpenModal] = useState(false);
  const [currentGoal, setCurrentGoal] = useState(discountGoals[0]);
  const [nextGoal, setNextGoal] = useState(discountGoals[1]);

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const progress = Math.min((totalItems / currentGoal.minProducts) * 100, 100);
  const remaining = currentGoal.minProducts - totalItems;

  useEffect(() => {
    const reachedGoal = totalItems >= currentGoal.minProducts;
    if (reachedGoal) {
      confetti({
        particleCount: 200,
        spread: 90,
        startVelocity: 35,
        origin: { y: 0.6 },
      });
      setOpenModal(true);

      const next = discountGoals.find(g => g.minProducts > currentGoal.minProducts);
      if (next) setNextGoal(next);
    }
  }, [totalItems]);

  const message =
    totalItems >= currentGoal.minProducts
      ? `🎉 ¡Lograste la meta de ${currentGoal.minProducts} productos!`
      : remaining > 0
      ? `🔥 Te faltan solo ${remaining} producto${remaining > 1 ? "s" : ""} para alcanzar ${currentGoal.discount}% de descuento`
      : "¡Sigue agregando productos para más recompensas!";

  return (
    <Box
      sx={{
        width: "100%",
        mb: 3,
        mt: 1,
        position: "fixed",
        margin: 0,
        left: 0,
        zIndex: 1000,
      }}
    >
      <Card
        sx={{
          overflow: "hidden",
          boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
          background: gradient,
          color: "#fff",
        }}
      >
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
            <Stack direction="row" spacing={1} alignItems="center">
             
              <Typography fontWeight="bold" sx={{ fontSize: "1.1rem" }}>
               {message}
              </Typography>
            </Stack>
            <Typography fontWeight="bold">{progress.toFixed(0)}%</Typography>
          </Stack>

          <LinearProgress
            determinate
            value={progress}
           
          />

          <Typography variant="body2" sx={{ mt: 1.5, textAlign: "center" }}>
            
          </Typography>
        </CardContent>
      </Card>

      {/* Modal de celebración */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 380,
            bgcolor: "#fff",
            borderRadius: 4,
            boxShadow: 24,
            p: 4,
            textAlign: "center",
          }}
        >
          <CelebrationIcon sx={{ fontSize: 70, color: green }} />
          <Typography variant="h6" fontWeight="bold" color={purple} mt={2}>
            ¡Felicidades! 🎉
          </Typography>
          <Typography sx={{ mt: 1, color: "#000" }}>
            Alcanzaste la meta de {currentGoal.minProducts} productos
            y obtuviste un <b>{currentGoal.discount}%</b> de descuento.
          </Typography>

          {nextGoal && (
            <>
              <Divider sx={{ my: 2 }} />
              <Typography sx={{ fontSize: 15, color: "#000" }}>
                🚀 ¡Sigue agregando productos para desbloquear aún más!
              </Typography>
              <Typography sx={{ fontWeight: "bold", color: "red", mt: 0.5 }}>
                Siguiente meta: {nextGoal.discount}% por {nextGoal.minProducts} productos.
              </Typography>
            </>
          )}

          <Button
            onClick={() => {
              setGoalCustomPackage(nextGoal?.minProducts || 6);
              setOpenModal(false);
             
            }}
            variant="contained"
            sx={{
              mt: 3,
              backgroundColor: purple,
              ":hover": { backgroundColor: "#5b2470" },
              px: 3,
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