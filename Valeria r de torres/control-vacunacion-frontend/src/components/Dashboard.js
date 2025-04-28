"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Box,
  Tabs,
  Tab,
  Card,
  CardContent,
  Grid,
  Chip,
  Divider,
  Avatar,
  Button,
  Alert,
  CircularProgress
} from '@mui/material';

// TabPanel component for tab content
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`dashboard-tabpanel-${index}`}
      aria-labelledby={`dashboard-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function Dashboard() {
  const [value, setValue] = useState(0);
  const [userData, setUserData] = useState(null);
  const [mascotas, setMascotas] = useState([]);
  const [citas, setCitas] = useState([]);
  const [vacunas, setVacunas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const loadUserData = () => {
      const storedUserData = localStorage.getItem('userData');
      if (storedUserData) {
        try {
          const userData = JSON.parse(storedUserData);
          console.log("Loaded user data:", userData);
          setUserData(userData);
          return userData;
        } catch (e) {
          console.error("Error parsing user data:", e);
          setError("Error al cargar información del usuario");
          return null;
        }
      }
      return null;
    };

    const fetchUserData = async () => {
      setLoading(true);
      try {
        const userData = loadUserData();
        if (!userData || !userData.Nombre) {
          setError("No se encontró información del usuario");
          setLoading(false);
          return;
        }

        // Fetch mascotas
        const mascotasResponse = await axios.get(`${API_URL}/consultas/${userData.Nombre}`);
        console.log("Mascotas:", mascotasResponse.data);
        setMascotas(mascotasResponse.data);

        // Fetch todas las citas del usuario
        const citasResponse = await axios.get(`${API_URL}/citas/${userData.Nombre}`);
        console.log("Citas:", citasResponse.data);
        setCitas(citasResponse.data);

        // Inicializar array de vacunas
        let todasLasVacunas = [];

        // Para cada mascota, obtener sus vacunas
        if (mascotasResponse.data && mascotasResponse.data.length > 0) {
          for (const mascota of mascotasResponse.data) {
            if (mascota._id) {
              try {
                const vacunasResponse = await axios.get(`${API_URL}/mascota/${mascota._id}/vacunas`);
                // Añadir el nombre de la mascota a cada vacuna
                const vacunasConMascota = vacunasResponse.data.map(vacuna => ({
                  ...vacuna,
                  nombreMascota: mascota.nombre
                }));
                todasLasVacunas = [...todasLasVacunas, ...vacunasConMascota];
              } catch (err) {
                console.error(`Error al obtener vacunas para mascota ${mascota.nombre}:`, err);
              }
            }
          }
        }
        
        console.log("Todas las vacunas:", todasLasVacunas);
        setVacunas(todasLasVacunas);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Error al cargar los datos. Por favor intenta nuevamente.");
        setLoading(false);
      }
    };

    fetchUserData();
  }, [API_URL]);

  // Maneja el cambio de pestañas
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // Formato de fecha para mostrar
  const formatDate = (dateString) => {
    if (!dateString) return "No disponible";
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Determina el color del chip según el estado de la cita
  const getStatusColor = (status) => {
    switch (status) {
      case 'Pendiente': return { color: 'warning', icon: '⏳' };
      case 'Completada': return { color: 'success', icon: '✅' };
      case 'Cancelada': return { color: 'error', icon: '❌' };
      default: return { color: 'default', icon: '❓' };
    }
  };

  // Determina si una vacuna está próxima a vencer (en los próximos 30 días)
  const isVacunaProximaAVencer = (fechaProxima) => {
    if (!fechaProxima) return false;
    
    const hoy = new Date();
    const fechaVencimiento = new Date(fechaProxima);
    const diferenciaDias = Math.ceil((fechaVencimiento - hoy) / (1000 * 60 * 60 * 24));
    
    return diferenciaDias > 0 && diferenciaDias <= 30;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
        <CircularProgress sx={{ color: '#ab47bc' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Button 
            variant="contained" 
            onClick={() => window.location.href = '/'}
            sx={{
              backgroundColor: '#ab47bc',
              '&:hover': {
                backgroundColor: '#9c27b0'
              }
            }}
          >
            Volver al inicio
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Box sx={{ 
        p: 3, 
        mb: 4, 
        borderRadius: 4, 
        bgcolor: '#f3e5f5',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        textAlign: 'center'
      }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ 
          color: '#6a1b9a', 
          fontWeight: 'bold',
          fontFamily: '"Comic Sans MS", cursive'
        }}>
          🎀 Mi Portal de Mascotas 🎀
        </Typography>
        
        {userData && (
          <Typography variant="h6" sx={{ 
            color: '#8e24aa',
            fontFamily: '"Comic Sans MS", cursive'
          }}>
            ¡Bienvenido/a, {userData.Nombre}!
          </Typography>
        )}
      </Box>

      <Box sx={{ width: '100%', bgcolor: 'background.paper', borderRadius: 4, overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={value} 
            onChange={handleChange} 
            variant="fullWidth"
            sx={{
              '& .MuiTab-root': { 
                fontWeight: 'bold',
                fontSize: '1rem',
                fontFamily: '"Comic Sans MS", cursive',
                color: '#9c27b0'
              },
              '& .Mui-selected': {
                color: '#6a1b9a',
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#6a1b9a',
              }
            }}
          >
            <Tab label="🐶 Mis Mascotas" id="dashboard-tab-0" />
            <Tab label="📅 Mis Citas" id="dashboard-tab-1" />
            <Tab label="💉 Vacunas" id="dashboard-tab-2" />
          </Tabs>
        </Box>
        
        {/* Panel de Mascotas */}
        <TabPanel value={value} index={0}>
          {mascotas.length === 0 ? (
            <Alert severity="info" sx={{ mb: 2 }}>
              No tienes mascotas registradas. ¡Registra una nueva mascota!
            </Alert>
          ) : (
            <Grid container spacing={3}>
              {mascotas.map((mascota) => (
                <Grid item xs={12} sm={6} md={4} key={mascota._id}>
                  <Card sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 4,
                    overflow: 'hidden',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
                    }
                  }}>
                    <Box sx={{ height: 140, overflow: 'hidden', position: 'relative', bgcolor: '#f3e5f5' }}>
                      <Avatar
                        sx={{
                          width: 100,
                          height: 100,
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          fontSize: 40,
                          bgcolor: '#ab47bc',
                          border: '4px solid white'
                        }}
                      >
                        {mascota.especie === 'Perro' ? '🐶' : 
                         mascota.especie === 'Gato' ? '🐱' :
                         mascota.especie === 'Ave' ? '🦜' :
                         mascota.especie === 'Conejo' ? '🐰' : '🐾'}
                      </Avatar>
                    </Box>
                    <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                      <Typography variant="h5" component="h2" gutterBottom sx={{ 
                        fontWeight: 'bold', 
                        color: '#6a1b9a',
                        fontFamily: '"Comic Sans MS", cursive'
                      }}>
                        {mascota.nombre}
                      </Typography>
                      
                      <Box sx={{ mb: 1.5 }}>
                        <Chip 
                          label={mascota.especie} 
                          size="small" 
                          sx={{ bgcolor: '#e1bee7', fontWeight: 'bold', mr: 1 }}
                        />
                        <Chip 
                          label={mascota.raza || 'No especificada'} 
                          size="small"
                          sx={{ bgcolor: '#f3e5f5' }}
                        />
                      </Box>
                      
                      <Divider sx={{ my: 1.5 }} />
                      
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        <strong>Edad:</strong> {mascota.edad || 'No especificada'}
                      </Typography>
                      
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        <strong>Peso:</strong> {mascota.peso ? `${mascota.peso} kg` : 'No especificado'}
                      </Typography>
                      
                      {mascota.observaciones && (
                        <Typography variant="body2" color="text.secondary">
                          <strong>Observaciones:</strong> {mascota.observaciones}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </TabPanel>
        
        {/* Panel de Citas */}
        <TabPanel value={value} index={1}>
          {citas.length === 0 ? (
            <Alert severity="info" sx={{ mb: 2 }}>
              No tienes citas programadas. ¡Agenda una nueva cita!
            </Alert>
          ) : (
            <Grid container spacing={3}>
              {citas.map((cita) => {
                const statusInfo = getStatusColor(cita.estado);
                return (
                  <Grid item xs={12} sm={6} key={cita._id}>
                    <Card sx={{
                      borderRadius: 4,
                      overflow: 'hidden',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      border: cita.estado === 'Pendiente' ? '2px solid #ffb74d' : 
                             cita.estado === 'Completada' ? '2px solid #81c784' : '2px solid #e57373',
                      '&:hover': {
                        boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
                      }
                    }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                          <Typography variant="h6" component="h2" sx={{ 
                            fontWeight: 'bold',
                            color: '#6a1b9a',
                            fontFamily: '"Comic Sans MS", cursive'
                          }}>
                            Cita para {cita.nombreMascota}
                          </Typography>
                          
                          <Chip 
                            label={`${statusInfo.icon} ${cita.estado}`}
                            color={statusInfo.color}
                            size="small"
                          />
                        </Box>
                        
                        <Divider sx={{ mb: 2 }} />
                        
                        <Typography variant="body1" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                          <span style={{ marginRight: '8px', fontSize: '1.2rem' }}>📅</span>
                          <strong>Fecha:</strong> {formatDate(cita.fechaCita)}
                        </Typography>
                        
                        {cita.motivo && (
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            <strong>Motivo:</strong> {cita.motivo}
                          </Typography>
                        )}
                        
                        {cita.diagnostico && (
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            <strong>Diagnóstico:</strong> {cita.diagnostico}
                          </Typography>
                        )}
                        
                        {cita.tratamiento && (
                          <Typography variant="body2" color="text.secondary">
                            <strong>Tratamiento:</strong> {cita.tratamiento}
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </TabPanel>
        
        {/* Panel de Vacunas */}
        <TabPanel value={value} index={2}>
          {vacunas.length === 0 ? (
            <Alert severity="info" sx={{ mb: 2 }}>
              No hay vacunas registradas para tus mascotas.
            </Alert>
          ) : (
            <Grid container spacing={3}>
              {vacunas.map((vacuna, index) => {
                const proximaAVencer = isVacunaProximaAVencer(vacuna.proximaAplicacion);
                
                return (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card sx={{
                      borderRadius: 4,
                      overflow: 'hidden',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      border: proximaAVencer ? '2px solid #ffb74d' : 'none',
                      '&:hover': {
                        boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
                      }
                    }}>
                      <Box sx={{ bgcolor: '#e1bee7', p: 1.5, textAlign: 'center' }}>
                        <Typography variant="h6" sx={{ 
                          fontWeight: 'bold',
                          color: '#6a1b9a',
                          fontFamily: '"Comic Sans MS", cursive'
                        }}>
                          💉 {vacuna.nombreVacuna}
                        </Typography>
                      </Box>
                      
                      <CardContent>
                        <Typography variant="body1" sx={{ mb: 1, fontWeight: '500' }}>
                          Mascota: {vacuna.nombreMascota}
                        </Typography>
                        
                        <Divider sx={{ my: 1.5 }} />
                        
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          <strong>Aplicada:</strong> {formatDate(vacuna.fechaAplicacion)}
                        </Typography>
                        
                        {vacuna.vacunaUnica ? (
                          <Chip 
                            label="Vacuna Única" 
                            size="small"
                            color="success"
                            sx={{ mt: 1 }}
                          />
                        ) : (
                          <>
                            <Typography variant="body2" sx={{ mb: 1 }}>
                              <strong>Próxima dosis:</strong> {formatDate(vacuna.proximaAplicacion)}
                            </Typography>
                            
                            {proximaAVencer && (
                              <Alert severity="warning" sx={{ mt: 1 }}>
                                ¡Próxima a vencer!
                              </Alert>
                            )}
                          </>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </TabPanel>
      </Box>
    </Container>
  );
}