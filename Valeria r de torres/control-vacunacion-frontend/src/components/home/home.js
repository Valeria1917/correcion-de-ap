import React from "react";
import Footer from "@/components/footer/footer";
import { Typography, Container, Box, Divider, Link, GlobalStyles } from "@mui/material";

export default function HomePage() {
  return (
    <>
      {/* Estilo global para animación de gradiente */}
      <GlobalStyles
        styles={{
          "@keyframes gradientShift": {
            "0%": { backgroundPosition: "0% 50%" },
            "50%": { backgroundPosition: "100% 50%" },
            "100%": { backgroundPosition: "0% 50%" },
          },
        }}
      />

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
            <Typography sx={animatedGradientTitle}>
              🐾 Bienvenido al Mundo de tus Mascotas 💗
            </Typography>
            <Typography sx={cuteSubTitle}>
              ¡Regístralas, vacúnalas y cuídalas como se merecen! 🐕🐈‍⬛
            </Typography>
          </Box>

          {/* Información general */}
          <Box sx={sectionStyle("#E1BEE7")}>
            <Typography variant="h5" sx={sectionTitle("#6A1B9A")}>
              ℹ️ Información Importante
            </Typography>
            <Typography sx={bodyText}>
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
                mt: 3,
              }}
            />
          </Box>

          {/* Expediente */}
          <Box sx={sectionStyle("#F3E5F5")}>
            <Typography variant="h5" sx={sectionTitle("#6A1B9A")}>
              📋 Expediente de la Veterinaria
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Typography sx={bodyText}>👩‍⚕️ <strong>Veterinaria:</strong> Valeria Guadalupe Calvillo Mendoza</Typography>
            <Typography sx={bodyText}>🕒 <strong>Horarios:</strong> Lunes a Viernes 9:00 a.m. - 6:00 p.m. / Sábados 9:00 a.m. - 2:00 p.m.</Typography>
            <Typography sx={bodyText}>📍 <strong>Dirección:</strong> Calle Garita 111, Col. Azteca, San Felipe, Gto</Typography>
            <Typography sx={bodyText}>
              📞 <strong>Teléfono:</strong>{" "}
              <Link href="tel:+524281234567" sx={{ color: "#6A1B9A", textDecoration: "none" }}>
                (428) 123 4567
              </Link>
            </Typography>
            <Typography sx={bodyText}>
              📧 <strong>Email:</strong>{" "}
              <Link href="mailto:valeria.veterinaria@gmail.com" sx={{ color: "#6A1B9A", textDecoration: "none" }}>
                valeria.veterinaria@gmail.com
              </Link>
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!3m2!1ses-419!2smx!4v1743742404257!5m2!1ses-419!2smx!6m8!1m7!1s9a1lkryVk8M0aTRK9lZyHg!2m2!1d21.47135329856726!2d-101.2229465099401!3f355.6328683994419!4f-79.77863695339956!5f0.7820865974627469"
                width="100%"
                height="450"
                style={{ border: 0, borderRadius: "12px" }}
                allowFullScreen
                loading="lazy"
              ></iframe>
            </Box>
          </Box>

          {/* Servicio a domicilio */}
          <Box sx={sectionStyle("#FFF3E0")}>
            <Typography variant="h5" sx={sectionTitle("#EF6C00")}>
              🚗 Servicio a Domicilio
            </Typography>
            <Typography sx={sectionText("#D84315")}>
              ¡Vamos por tu mascota! Solo llámanos y con gusto pasamos a recogerla para su atención veterinaria. 🐶🐱💼
            </Typography>
          </Box>

          {/* Cupones */}
          <Box sx={sectionStyle("#FFF0F5")}>
            <Typography variant="h5" sx={sectionTitle("#AD1457")}>
              💸 Cupones de Descuento
            </Typography>
            <Typography sx={sectionText("#6A1B9A")}>
              ¡Aprovecha nuestras promociones por tiempo limitado y dale lo mejor a tu mascota sin gastar de más! 🎁
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                gap: 3,
                justifyContent: "center",
                mt: 4,
              }}
            >
              {[
                {
                  titulo: "🧼 15% en baño y corte",
                  desc: "Consiente a tu mascota con estilo y frescura. Aplica de lunes a jueves.",
                  color: "#F8BBD0",
                },
                {
                  titulo: "💉 10% en vacunación completa",
                  desc: "Descuento válido en la aplicación del paquete de vacunas anual.",
                  color: "#B39DDB",
                },
                {
                  titulo: "🏥 Primera consulta GRATIS",
                  desc: "Si eres nuevo cliente, tu primer chequeo médico no tiene costo.",
                  color: "#80DEEA",
                },
              ].map((cupon, i) => (
                <Box
                  key={i}
                  sx={{
                    flex: 1,
                    backgroundColor: cupon.color,
                    borderRadius: 3,
                    p: 3,
                    boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
                    textAlign: "center",
                    transition: "transform 0.3s",
                    "&:hover": {
                      transform: "scale(1.05)",
                    },
                  }}
                >
                  <Typography sx={{ ...sectionTitle("#4A148C"), fontSize: "1.3rem" }}>
                    {cupon.titulo}
                  </Typography>
                  <Typography sx={bodyText}>{cupon.desc}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Container>
      </Box>

      <Footer />
    </>
  );
}

// 🌈 Estilos

const animatedGradientTitle = {
  fontFamily: "'Pacifico', cursive",
  fontSize: { xs: "2.5rem", sm: "3rem", md: "3.5rem" },
  fontWeight: "bold",
  background: "linear-gradient(-45deg, #FF80AB, #BA68C8, #81D4FA, #F8BBD0)",
  backgroundSize: "300% 300%",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  animation: "gradientShift 6s ease infinite",
  textAlign: "center",
  mb: 2,
};

const cuteSubTitle = {
  fontFamily: "'Comfortaa', cursive",
  color: "#81D4FA",
  fontSize: { xs: "1.2rem", sm: "1.4rem", md: "1.5rem" },
};

const bodyText = {
  fontFamily: "'Comfortaa', sans-serif",
  fontSize: "1.1rem",
  lineHeight: 1.6,
  color: "#4A148C",
  mb: 1,
};

const sectionStyle = (bg) => ({
  backgroundColor: bg,
  borderRadius: 4,
  p: 4,
  textAlign: "center",
  boxShadow: "0px 4px 12px rgba(0,0,0,0.08)",
  mb: 6,
});

const sectionTitle = (color) => ({
  fontWeight: "bold",
  color,
  mb: 2,
  fontFamily: "'Comfortaa', cursive",
});

const sectionText = (color) => ({
  color,
  fontSize: "1.1rem",
  fontFamily: "'Comfortaa', cursive",
});
