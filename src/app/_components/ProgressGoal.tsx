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

type GoalProgressProps = {
  onHeader?: boolean
}

const GoalProgress = ({ onHeader = false }: GoalProgressProps) => {
  const purple = "#733080";
  const green = "#89b329";
  const gradient = "rgb(89 118 24)";
  const [isTopGoal, setIsTopGoal] = useState(false);
  const { cartItems = [], currentGoal, nextGoal, setCurrentGoal, setNextGoal, discountGoals } = useCart();
  const { setCurrentDiscount, currentDiscount } = useCart();
  const [openModal, setOpenModal] = useState(false);
 
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const progress = Math.min((totalItems / currentGoal.minProducts) * 100, 100);
  const remaining = currentGoal.minProducts - totalItems;

  useEffect(() => {
    const reachedGoal = totalItems >= currentGoal.minProducts;
    if (reachedGoal && !isTopGoal) {
      setOpenModal(true);
      setCurrentDiscount(currentGoal.discount);
    }
    if(totalItems >= 20) {
      setIsTopGoal(true);
    }
  }, [totalItems]);

  const message =
    totalItems >= currentGoal.minProducts
      ? `🎉 ¡Lograste la meta de ${currentGoal.discount}% de descuento!`
      : remaining > 0
      ? `🔥 ${remaining} producto${remaining > 1 ? "s" : ""} más para un ${currentGoal.discount}% de descuento (actual: ${currentDiscount}%)` 
      : "¡Sigue agregando productos para más recompensas! ";

  return (
    <Box
      sx={{
        width: "100%",
        mb: 0,
        mt: 1,
        position: onHeader ? "fixed" : "relative",
        margin: 0,
        left: 0,
        zIndex: 10000 ,
      }}
    >
      <Card
        sx={{
          overflow: "hidden",
          background: gradient,
          color: "#fff",
          borderRadius: 0,
        }}
      >
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
            <Stack direction="row"  alignItems="center">
             
              <Typography  sx={{ fontSize: "0.8rem", padding: '0' }}>
               {message}
              </Typography>
            </Stack>
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

          {nextGoal && !isTopGoal && (
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
              if(currentGoal.minProducts === 20) {
                setOpenModal(false);
                setIsTopGoal(true);
                return;
              }
              console.log(nextGoal);
              setCurrentGoal(nextGoal);
              setNextGoal(discountGoals.find(g => g.minProducts > nextGoal.minProducts) || discountGoals[0]);
              setOpenModal(false);
              setIsTopGoal(false);
             
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