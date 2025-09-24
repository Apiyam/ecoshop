"use client";

import { Box, Typography, Button, Card, CardContent } from "@mui/joy";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import { motion } from "framer-motion";

export default function EcopipoStory() {
  return (
    <Box
      component="section"
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
        gap: 4,
        alignItems: "center",
        py: { xs: 6, md: 10 },
        px: { xs: 2, md: 8 },
        background:
          "linear-gradient(135deg, #f9fafb 0%, #f0fdfa 100%)",
      }}
    >
      {/* Video */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Card
          variant="outlined"
          sx={{
            borderRadius: "2xl",
            overflow: "hidden",
            boxShadow: "lg",
          }}
        >
          <iframe height="450" src="https://www.youtube.com/embed/esyQXuOc81M" title="Creó un Negocio Millonario vendiendo pañales reutilizables | Ecopipo 👶" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
        </Card>
      </motion.div>

      {/* Texto narrativo */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <Card
          variant="soft"
          sx={{
            borderRadius: "2xl",
            backgroundColor: "white",
            p: 3,
            boxShadow: "md",
          }}
        >
          <CardContent>
            <Box 
            sx={{
              background: "url(https://static.vecteezy.com/system/resources/previews/023/811/227/non_2x/the-sweet-pink-color-of-garland-bunting-flags-banner-background-baby-girl-valentine-party-wedding-greeting-party-marry-me-birthday-valentine-s-day-concepts-vector.jpg)",
              width: "100%",
              height: "90px",
              objectFit: "cover",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              borderRadius: "inherit",

            }}
            ></Box>
            <Typography
              level="h2"
              sx={{
                fontWeight: "bold",
                mb: 2,
                fontSize: { xs: "xl", md: "2xl" },
              }}
            >
              Diseñado por una mamá que ha trascendido fronteras
            </Typography>

            <Typography level="body-md" sx={{ mb: 2 }}>
              Ecopipo es una marca mexicana hecha por mamás para mamás. Surgió
              en 2009 con el nacimiento del primer bebé de Ixchel Anaya,
              fundadora de Ecopipo, quien vio la necesidad de ofrecer pañales
              ecológicos, prácticos y reutilizables que cuidaran la piel de los
              bebés, ayudaran a ahorrar a las familias y evitaran la generación
              masiva de contaminantes.
            </Typography>

            <Typography level="body-md" sx={{ mb: 2 }}>
              Con un propósito claro de cuidar al medio ambiente y empoderar a
              las mujeres, Ecopipo ha construido una red de más de{" "}
              <b>1,900 distribuidoras en 19 países</b>, apoyando a miles de
              mamás en su crianza y fomentando un espíritu emprendedor y
              sustentable.
            </Typography>

            <Button
              startDecorator={<PlayCircleOutlineIcon />}
              color="success"
              size="lg"
              sx={{ mt: 2 }}
            >
              Conoce más
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </Box>
  );
}