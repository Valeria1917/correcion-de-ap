"use client";
import * as React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  AppBar, Toolbar, Typography, Container, Box, Button,
  Menu, MenuItem, IconButton, Tooltip, Avatar
} from '@mui/material';
import ModalDueño from '@/components/modals/ModalDueno';
import ModalMascota from '@/components/modals/ModalMascota';
import ModalCita from '@/components/modals/ModalCita';
import ModalVacuna from '@/components/modals/ModalVacuna';

function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const isExpedientePage = pathname === '/mascotas';

  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [isMenuUnlocked, setIsMenuUnlocked] = React.useState(false);

  const [openDuenoModal, setOpenDuenoModal] = React.useState(false);
  const [openMascotaModal, setOpenMascotaModal] = React.useState(false);
  const [openCitaModal, setOpenCitaModal] = React.useState(false);
  const [openVacunaModal, setOpenVacunaModal] = React.useState(false);

  React.useEffect(() => {
    const unlocked = localStorage.getItem('menuUnlocked') === 'true';
    setIsMenuUnlocked(unlocked);
  }, []);

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    setIsMenuUnlocked(false);
    localStorage.removeItem('menuUnlocked');
    setAnchorElUser(null);
    router.push('/'); // Redirige al inicio después de cerrar sesión
  };

  const openProtectedMenu = (event) => {
    if (isMenuUnlocked) {
      setAnchorElUser(event.currentTarget);
    } else {
      const password = prompt("🔒 Ingresa la contraseña para acceder al menú:");
      if (password === "1234") {
        setIsMenuUnlocked(true);
        localStorage.setItem('menuUnlocked', 'true');
        setAnchorElUser(event.currentTarget);
      } else {
        alert("❌ Contraseña incorrecta. No puedes abrir el menú.");
      }
    }
  };

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: '#f8bbd0', boxShadow: '0 4px 10px rgba(0,0,0,0.2)' }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>

            {/* Logo + nombre */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton href="/" disableRipple sx={{ p: 0, mr: 2 }}>
                <img
                  src="https://static.vecteezy.com/system/resources/previews/007/223/865/original/veterinarian-with-cat-and-dog-cartoon-icon-illustration-people-profession-icon-concept-isolated-premium-vector.jpg"
                  alt="Logo Veterinaria Valeria"
                  style={{ width: 50, height: 50, borderRadius: '50%', objectFit: 'cover' }}
                />
              </IconButton>

              <Typography
                variant="h6"
                noWrap
                component="a"
                href="/"
                sx={{
                  fontFamily: 'Comic Sans MS, cursive',
                  fontWeight: 'bold',
                  color: '#880e4f',
                  textDecoration: 'none',
                  fontSize: '1.4rem',
                }}
              >
                🎀 Veterinaria Valeria
              </Typography>
            </Box>

            {/* Acciones de la barra */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {isMenuUnlocked && (
                <Button
                  onClick={handleLogout}
                  sx={{
                    color: "white",
                    backgroundColor: '#c2185b',
                    borderRadius: 3,
                    '&:hover': {
                      backgroundColor: '#ad1457'
                    }
                  }}
                >
                  ❌ Cerrar sesión
                </Button>
              )}

              <Tooltip title="Opciones rápidas (protegido)">
                <IconButton onClick={openProtectedMenu}>
                  <Avatar sx={{ bgcolor: '#f06292', width: 40, height: 40, fontSize: 24 }}>
                    🐾
                  </Avatar>
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
            >
              <MenuItem onClick={() => router.push('/')}>🏠 Ir a Inicio</MenuItem>
              <MenuItem onClick={() => router.push('/citas')}>📅 Ver Citas</MenuItem>
              <MenuItem onClick={() => router.push('/duenos')}>👤 Ver Dueños</MenuItem>
              {!isExpedientePage && (
                <MenuItem onClick={() => router.push('/mascotas')}>🐶 Ver Mascotas</MenuItem>
              )}
              {!isExpedientePage && (
                <MenuItem onClick={() => setOpenMascotaModal(true)}>
                  🐾 Registrar Mascota
                </MenuItem>
              )}
              <MenuItem onClick={() => setOpenDuenoModal(true)}>👨‍👩‍👧 Agregar Dueño</MenuItem>
              <MenuItem onClick={() => setOpenCitaModal(true)}>🗓️ Agendar Cita</MenuItem>
              <MenuItem onClick={() => setOpenVacunaModal(true)}>💉 Registrar Vacuna</MenuItem>
              <MenuItem onClick={handleCloseUserMenu}>❌ Cerrar menú</MenuItem>
            </Menu>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Modales */}
      <ModalDueño open={openDuenoModal} onClose={() => setOpenDuenoModal(false)} />
      <ModalMascota open={openMascotaModal} onClose={() => setOpenMascotaModal(false)} />
      <ModalCita open={openCitaModal} onClose={() => setOpenCitaModal(false)} />
      <ModalVacuna open={openVacunaModal} onClose={() => setOpenVacunaModal(false)} />
    </>
  );
}

export default Navbar;
