"use client";
import * as React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  AppBar, Toolbar, Typography, Container, Box, Button,
  Menu, MenuItem, IconButton, Tooltip, Avatar, Badge
} from '@mui/material';
import ModalDueño from '@/components/modals/ModalDueno';
import ModalMascota from '@/components/modals/ModalMascota';
import ModalCita from '@/components/modals/ModalCita';
import ModalVacuna from '@/components/modals/ModalVacuna';
import ModalLogin from '@/components/modals/ModalLogin'; // Importamos el componente

function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const isExpedientePage = pathname === '/mascotas';

  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [isMenuUnlocked, setIsMenuUnlocked] = React.useState(false);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [userData, setUserData] = React.useState(null);
  const [showLoginButton, setShowLoginButton] = React.useState(true);

  const [openDuenoModal, setOpenDuenoModal] = React.useState(false);
  const [openMascotaModal, setOpenMascotaModal] = React.useState(false);
  const [openCitaModal, setOpenCitaModal] = React.useState(false);
  const [openVacunaModal, setOpenVacunaModal] = React.useState(false);
  const [openLoginModal, setOpenLoginModal] = React.useState(false);

  React.useEffect(() => {
    // Verificamos si el menú está desbloqueado
    const unlocked = localStorage.getItem('menuUnlocked') === 'true';
    setIsMenuUnlocked(unlocked);
    
    // Si el menú está desbloqueado, también ocultamos el botón de login
    if (unlocked) {
      setShowLoginButton(false);
    }
    
    // Verificamos si el usuario está logueado
    const token = localStorage.getItem('userToken');
    const storedUserData = localStorage.getItem('userData');
    
    if (token && storedUserData) {
      setIsLoggedIn(true);
      setShowLoginButton(false);
      try {
        setUserData(JSON.parse(storedUserData));
      } catch (e) {
        console.error("Error parsing user data:", e);
      }
    }
  }, []);

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  // Función para cerrar menú y bloquear acceso
  const handleCloseAndLockMenu = () => {
    setAnchorElUser(null);
    setIsMenuUnlocked(false);
    setShowLoginButton(true);
    localStorage.removeItem('menuUnlocked');
  };

  const handleLogout = () => {
    setAnchorElUser(null);
    setIsMenuUnlocked(false);
    setIsLoggedIn(false);
    setUserData(null);
    setShowLoginButton(true);
    localStorage.removeItem('menuUnlocked');
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
    router.push('/');
  };

  const handleLoginSuccess = (data) => {
    setIsLoggedIn(true);
    setUserData(data.user);
    setShowLoginButton(false);
    // También podríamos desbloquear el menú si el usuario es un administrador
    if (data.user?.role === 'admin') {
      setIsMenuUnlocked(true);
      localStorage.setItem('menuUnlocked', 'true');
    }
  };

  const openProtectedMenu = (event) => {
    if (isMenuUnlocked) {
      setAnchorElUser(event.currentTarget);
    } else {
      const password = prompt("🔒 Ingresa la contraseña para acceder al menú:");
      if (password === "1234") {
        setIsMenuUnlocked(true);
        setShowLoginButton(false); // Ocultar botón de login cuando se desbloquea el menú
        localStorage.setItem('menuUnlocked', 'true');
        setAnchorElUser(event.currentTarget);
      } else {
        alert("❌ Contraseña incorrecta. No puedes abrir el menú.");
      }
    }
  };

  return (
    <>
      <AppBar position="static" sx={{
        background: 'linear-gradient(90deg, #ce93d8 0%, #ab47bc 100%)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
      }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
            {/* Logo + nombre */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton href="/" disableRipple sx={{ p: 0, mr: 2 }}>
                <img
                  src="https://img.freepik.com/vector-premium/lindo-logo-gato-morado_1030945-15.jpg?w=2000"
                  alt="Logo Veterinaria Valeria"
                  style={{
                    width: 55,
                    height: 55,
                    borderRadius: '50%',
                    border: '3px solid white',
                    objectFit: 'cover',
                    transition: 'transform 0.3s',
                  }}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                />
              </IconButton>

              <Typography
                variant="h6"
                noWrap
                component="a"
                href="/"
                sx={{
                  fontFamily: '"Comic Sans MS", cursive',
                  fontWeight: 'bold',
                  color: '#4a148c',
                  textDecoration: 'none',
                  fontSize: '1.6rem',
                  letterSpacing: 1,
                }}
              >
                 Veterinaria Valeria
              </Typography>
            </Box>

            {/* Acciones de la barra */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {/* Botón de Registrarse en la barra de navegación (visible cuando NO están autenticados) */}
              {!isMenuUnlocked && !isLoggedIn && (
                <Button
                  onClick={() => setOpenDuenoModal(true)}
                  sx={{
                    color: "#fff",
                    backgroundColor: '#9c27b0',
                    fontWeight: 'bold',
                    textTransform: 'none',
                    borderRadius: '25px',
                    px: 3,
                    py: 1,
                    boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                    '&:hover': {
                      backgroundColor: '#7b1fa2',
                      transform: 'scale(1.05)',
                      transition: 'all 0.2s',
                    }
                  }}
                >
                  👨‍👩‍👧 Registrarse
                </Button>
              )}
              
              {/* Botón de Iniciar Sesión (visible solo cuando no está logueado Y showLoginButton es true) */}
              {!isLoggedIn && showLoginButton && (
                <Button
                  onClick={() => setOpenLoginModal(true)}
                  sx={{
                    color: "#fff",
                    backgroundColor: '#673ab7',
                    fontWeight: 'bold',
                    textTransform: 'none',
                    borderRadius: '25px',
                    px: 3,
                    py: 1,
                    boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                    '&:hover': {
                      backgroundColor: '#512da8',
                      transform: 'scale(1.05)',
                      transition: 'all 0.2s',
                    }
                  }}
                >
                  🔑 Iniciar Sesión
                </Button>
              )}
              
              {/* Mostrar el nombre del usuario si está logueado */}
              {isLoggedIn && userData && (
                <Typography
                  sx={{
                    color: '#fff',
                    fontWeight: 'bold',
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    borderRadius: '25px',
                    px: 2,
                    py: 1,
                  }}
                >
                  👤 Hola, {userData.Nombre || 'Usuario'}
                </Typography>
              )}
              
              {/* Botón de Cerrar Sesión (visible solo cuando está logueado) */}
              {isLoggedIn && (
                <Button
                  onClick={handleLogout}
                  sx={{
                    color: "#fff",
                    backgroundColor: '#8e24aa',
                    fontWeight: 'bold',
                    textTransform: 'none',
                    borderRadius: '25px',
                    px: 3,
                    py: 1,
                    boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                    '&:hover': {
                      backgroundColor: '#6a1b9a',
                      transform: 'scale(1.05)',
                      transition: 'all 0.2s',
                    }
                  }}
                >
                  ❌ Cerrar Sesión
                </Button>
              )}

              <Tooltip title="Opciones rápidas (protegido)">
                <IconButton onClick={openProtectedMenu}>
                  <Badge 
                    color="secondary" 
                    variant="dot" 
                    invisible={!isMenuUnlocked}
                  >
                    <Avatar sx={{
                      bgcolor: '#ba68c8',
                      width: 48,
                      height: 48,
                      fontSize: 28,
                      boxShadow: '0 3px 8px rgba(0,0,0,0.2)',
                      transition: 'all 0.3s',
                      '&:hover': {
                        transform: 'scale(1.1)',
                        boxShadow: '0 5px 12px rgba(0,0,0,0.3)',
                      }
                    }}>
                      🐾
                    </Avatar>
                  </Badge>
                </IconButton>
              </Tooltip>
            </Box>

            {/* Menú desplegable protegido */}
            <Menu
              sx={{ mt: '45px' }}
              anchorEl={anchorElUser}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              PaperProps={{
                sx: {
                  borderRadius: 4,
                  bgcolor: '#f3e5f5',
                  boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
                }
              }}
            >
              <MenuItem onClick={() => router.push('/')}>🏠 Ir a Inicio</MenuItem>
              <MenuItem onClick={() => router.push('/citas')}>📅 Ver Citas</MenuItem>
              <MenuItem onClick={() => router.push('/duenos')}>👤 Ver Dueños</MenuItem>
              <MenuItem onClick={() => router.push('/mascotas')}>🐶 Ver Mascotas</MenuItem>

              {!isExpedientePage && (
                <MenuItem onClick={() => setOpenMascotaModal(true)}>
                  🐾 Registrar Mascota
                </MenuItem>
              )}
              <MenuItem onClick={() => setOpenCitaModal(true)}>🗓️ Agendar Cita</MenuItem>
              <MenuItem onClick={() => setOpenVacunaModal(true)}>💉 Registrar Vacuna</MenuItem>
              {/* Cambiado para que cierre y bloquee el menú */}
              <MenuItem onClick={handleCloseAndLockMenu}>🔒 Cerrar y bloquear menú</MenuItem>
            </Menu>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Modales */}
      <ModalDueño open={openDuenoModal} onClose={() => setOpenDuenoModal(false)} />
      <ModalMascota open={openMascotaModal} onClose={() => setOpenMascotaModal(false)} />
      <ModalCita open={openCitaModal} onClose={() => setOpenCitaModal(false)} />
      <ModalVacuna open={openVacunaModal} onClose={() => setOpenVacunaModal(false)} />
      <ModalLogin 
        open={openLoginModal} 
        onClose={() => setOpenLoginModal(false)} 
        onLoginSuccess={handleLoginSuccess}
        setShowLoginButton={setShowLoginButton}
      />
    </>
  );
}

export default Navbar;