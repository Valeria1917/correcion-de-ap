import React from "react";
import Footer from "@/components/footer/footer";
import { Typography, Container, Box, Divider, Link } from "@mui/material";

export default function HomePage() {
  return (
    <>
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "#FFF8FB",
          paddingBottom: "80px",
        }}
      >
        <Container
          maxWidth="lg"
          sx={{
            padding: { xs: 2, sm: 4, md: 6 },
            backgroundColor: "white",
            borderRadius: 4,
            mt: 6,
            boxShadow: "0px 8px 30px rgba(0,0,0,0.05)",
          }}
        >
          {/* Encabezado */}
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <Typography
              variant="h3"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: "bold",
                color: "#BA68C8",
                fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
                fontFamily: "'Poppins', cursive",
              }}
            >
              🐾 Bienvenido al Mundo de tus Mascotas 💗
            </Typography>
            <Typography
              variant="h6"
              component="p"
              sx={{
                color: "#81D4FA",
                fontSize: { xs: "1.1rem", sm: "1.3rem", md: "1.4rem" },
                fontFamily: "'Poppins', cursive",
              }}
            >
              ¡Regístralas, vacúnalas y cuídalas como se merecen! 🐕🐈‍⬛
            </Typography>
          </Box>

          {/* Información general */}
          <Box
            sx={{
              mt: 6,
              mb: 6,
              textAlign: "center",
              backgroundColor: "#E1BEE7",
              borderRadius: 4,
              p: 4,
              boxShadow: "0px 4px 12px rgba(0,0,0,0.08)",
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
                color: "#6A1B9A",
                mb: 2,
                fontFamily: "'Poppins', cursive",
              }}
            >
              ℹ️ Información Importante
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "#4A148C",
                fontSize: "1.1rem",
                mb: 3,
                fontFamily: "'Poppins', cursive",
                maxWidth: "800px",
                margin: "0 auto",
              }}
            >
              La salud de tu mascota es nuestra prioridad. Contamos con servicio de urgencias, revisiones preventivas, vacunación completa y orientación profesional para cada etapa de su vida. ¡No dudes en visitarnos!
            </Typography>
            <Box
              component="img"
              src="https://th.bing.com/th/id/R.470c36369ae1dba9dfffd95ea86b160f?rik=uZiZ8qZkRALUlg&riu=http%3a%2f%2f4.bp.blogspot.com%2f-acWBxpmT85w%2fU4KfdZaDY6I%2fAAAAAAAABYw%2fPBIHkuxEpHU%2fs1600%2fconhecimemnto-1024.jpg&ehk=zOgSEmIYpz0AcUy1LBjkOhQ1R3Gb%2fRrlQdg9EqsTM24%3d&risl=&pid=ImgRaw&r=0"
              alt="Veterinaria"
              sx={{
                width: "100%",
                maxWidth: "600px",
                borderRadius: "16px",
                boxShadow: "0px 4px 20px rgba(0,0,0,0.1)",
              }}
            />
          </Box>

          {/* Expediente de la veterinaria */}
          <Box
            sx={{
              backgroundColor: "#F3E5F5",
              borderRadius: 4,
              p: 4,
              mb: 6,
              boxShadow: "0px 4px 12px rgba(0,0,0,0.08)",
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
                color: "#6A1B9A",
                mb: 2,
                fontFamily: "'Poppins', cursive",
                textAlign: "center",
              }}
            >
              📋 Expediente de la Veterinaria
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Typography
              variant="body1"
              sx={{
                fontSize: "1.1rem",
                color: "#4A148C",
                mb: 1,
                fontFamily: "'Poppins', cursive",
              }}
            >
              👩‍⚕️ <strong>Nombre de la Veterinaria:</strong> Valeria Guadalupe Calvillo Mendoza
            </Typography>

            <Typography
              variant="body1"
              sx={{
                fontSize: "1.1rem",
                color: "#4A148C",
                mb: 1,
                fontFamily: "'Poppins', cursive",
              }}
            >
              🕒 <strong>Horarios de Atención:</strong> Lunes a Viernes de 9:00 a.m. a 6:00 p.m. <br />
              Sábados de 9:00 a.m. a 2:00 p.m.
            </Typography>

            <Typography
              variant="body1"
              sx={{
                fontSize: "1.1rem",
                color: "#4A148C",
                mb: 1,
                fontFamily: "'Poppins', cursive",
              }}
            >
              📍 <strong>Dirección:</strong> Calle Garita 111, Col. Azteca, San Felipe, Gto
            </Typography>

            <Typography
              variant="body1"
              sx={{
                fontSize: "1.1rem",
                color: "#4A148C",
                mb: 1,
                fontFamily: "'Poppins', cursive",
              }}
            >
              📞 <strong>Teléfono:</strong>{" "}
              <Link href="tel:+524281234567" sx={{ color: "#6A1B9A", textDecoration: "none" }}>
                (428) 123 4567
              </Link>
            </Typography>

            <Typography
              variant="body1"
              sx={{
                fontSize: "1.1rem",
                color: "#4A148C",
                mb: 3,
                fontFamily: "'Poppins', cursive",
              }}
            >
              📧 <strong>Correo electrónico:</strong>{" "}
              <Link href="mailto:valeria.veterinaria@gmail.com" sx={{ color: "#6A1B9A", textDecoration: "none" }}>
                valeria.veterinaria@gmail.com
              </Link>
            </Typography>

            {/* Mapa */}
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!3m2!1ses-419!2smx!4v1743742404257!5m2!1ses-419!2smx!6m8!1m7!1s9a1lkryVk8M0aTRK9lZyHg!2m2!1d21.47135329856726!2d-101.2229465099401!3f355.6328683994419!4f-79.77863695339956!5f0.7820865974627469"
                width="100%"
                height="450"
                style={{ border: 0, borderRadius: "12px" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </Box>
          </Box>

          {/* Servicio a domicilio */}
          <Box
            sx={{
              backgroundColor: "#FFF3E0",
              borderRadius: 4,
              p: 4,
              textAlign: "center",
              boxShadow: "0px 4px 12px rgba(0,0,0,0.08)",
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
                color: "#EF6C00",
                mb: 2,
                fontFamily: "'Poppins', cursive",
              }}
            >
              🚗 Servicio a Domicilio
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "#D84315",
                fontSize: "1.1rem",
                fontFamily: "'Poppins', cursive",
              }}
            >
              ¡Vamos por tu mascota! Solo llámanos y con gusto pasamos a recogerla para su atención veterinaria. 🐶🐱💼
            </Typography>
          </Box>
        </Container>
      </Box>

      <Footer />
    </>
  );
}

