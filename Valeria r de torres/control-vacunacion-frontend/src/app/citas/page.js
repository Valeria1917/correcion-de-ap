"use client";
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Grid,
  CircularProgress,
  Alert,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import { Search, Event, Refresh, Add, Edit, Delete } from '@mui/icons-material';
import axios from 'axios';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import ModalCita from '@/components/modals/ModalCita';
import ModalEditarCita from '@/components/modals/ModalEditarCita';
import Navbar from '@/components/navbar/navbar';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function CitasPage() {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useState({
    estado: '',
    fechaInicio: '',
    fechaFin: ''
  });
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [citaToDelete, setCitaToDelete] = useState(null);
  const [currentCita, setCurrentCita] = useState(null);

  useEffect(() => {
    fetchCitas();
  }, []);

  const fetchCitas = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/cita`);
      setCitas(response.data);
    } catch (error) {
      console.error("Error al obtener citas:", error);
      setError("Error al cargar las citas");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchByStatus = async () => {
    if (!searchParams.estado) {
      setError("Por favor seleccione un estado");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/consultas/citas/estado/${searchParams.estado}`);
      setCitas(response.data);
    } catch (error) {
      console.error("Error al buscar citas por estado:", error);
      setError("Error al buscar citas por estado");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchByDateRange = async () => {
    if (!searchParams.fechaInicio || !searchParams.fechaFin) {
      setError("Por favor seleccione ambas fechas");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${API_URL}/consultas/citas/rango-fechas/${searchParams.fechaInicio}/${searchParams.fechaFin}`
      );
      setCitas(response.data);
    } catch (error) {
      console.error("Error al buscar citas por rango de fechas:", error);
      setError("Error al buscar citas por rango de fechas");
    } finally {
      setLoading(false);
    }
  };

  const handleResetSearch = () => {
    setSearchParams({
      estado: '',
      fechaInicio: '',
      fechaFin: ''
    });
    fetchCitas();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleOpenAddModal = () => {
    setOpenAddModal(true);
  };

  const handleOpenEditModal = (cita) => {
    setCurrentCita(cita);
    setOpenEditModal(true);
  };

  const handleCloseAddModal = (refresh = false) => {
    setOpenAddModal(false);
    if (refresh) fetchCitas();
  };

  const handleCloseEditModal = (refresh = false) => {
    setOpenEditModal(false);
    setCurrentCita(null);
    if (refresh) fetchCitas();
  };

  const handleOpenDeleteDialog = (cita) => {
    setCitaToDelete(cita);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setCitaToDelete(null);
  };

  const handleDeleteCita = async () => {
    if (!citaToDelete) return;

    setLoading(true);
    try {
      await axios.delete(`${API_URL}/cita/${citaToDelete._id}`);
      fetchCitas();
      handleCloseDeleteDialog();
    } catch (error) {
      console.error("Error al eliminar cita:", error);
      setError("Error al eliminar la cita");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'PPPp', { locale: es });
  };

  return (
    <Box>
      <Navbar />
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
          Gestión de Citas
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Buscar Citas
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleOpenAddModal}
            >
              Nueva Cita
            </Button>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Estado</InputLabel>
                <Select
                  name="estado"
                  value={searchParams.estado}
                  onChange={handleChange}
                  label="Estado"
                >
                  <MenuItem value="Pendiente">Pendiente</MenuItem>
                  <MenuItem value="Completada">Completada</MenuItem>
                  <MenuItem value="Cancelada">Cancelada</MenuItem>
                </Select>
              </FormControl>
              <Button
                variant="contained"
                onClick={handleSearchByStatus}
                startIcon={<Search />}
                sx={{ mt: 1 }}
                fullWidth
                disabled={!searchParams.estado || loading}
              >
                Buscar por Estado
              </Button>
            </Grid>

            <Grid item xs={12} md={6}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="fechaInicio"
                    label="Fecha Inicio"
                    type="date"
                    value={searchParams.fechaInicio}
                    onChange={handleChange}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="fechaFin"
                    label="Fecha Fin"
                    type="date"
                    value={searchParams.fechaFin}
                    onChange={handleChange}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    onClick={handleSearchByDateRange}
                    startIcon={<Search />}
                    fullWidth
                    disabled={!searchParams.fechaInicio || !searchParams.fechaFin || loading}
                  >
                    Buscar por Rango
                  </Button>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12} md={2}>
              <Button
                variant="outlined"
                onClick={handleResetSearch}
                startIcon={<Refresh />}
                sx={{ height: '100%' }}
                fullWidth
                disabled={loading}
              >
                Restablecer
              </Button>
            </Grid>
          </Grid>
        </Paper>

        <Paper elevation={3} sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Listado de Citas
            </Typography>
            <Typography variant="body2">
              Total: {citas.length} citas
            </Typography>
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell><strong>Dueño</strong></TableCell>
                    <TableCell><strong>Mascota</strong></TableCell>
                    <TableCell><strong>Fecha Cita</strong></TableCell>
                    <TableCell><strong>Motivo</strong></TableCell>
                    <TableCell><strong>Estado</strong></TableCell>
                    <TableCell><strong>Acciones</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {citas.length > 0 ? (
                    citas.map((cita) => (
                      <TableRow key={cita._id}>
                        <TableCell>{cita.NombreDueno}</TableCell>
                        <TableCell>{cita.nombreMascota}</TableCell>
                        <TableCell>{formatDate(cita.fechaCita)}</TableCell>
                        <TableCell>{cita.motivo}</TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              display: 'inline-block',
                              p: '4px 8px',
                              borderRadius: 1,
                              backgroundColor:
                                cita.estado === 'Completada'
                                  ? '#e8f5e9'
                                  : cita.estado === 'Cancelada'
                                    ? '#ffebee'
                                    : '#fff8e1',
                              color:
                                cita.estado === 'Completada'
                                  ? '#2e7d32'
                                  : cita.estado === 'Cancelada'
                                    ? '#c62828'
                                    : '#f57f17',
                              fontWeight: 'medium'
                            }}
                          >
                            {cita.estado}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <IconButton
                            color="primary"
                            onClick={() => handleOpenEditModal(cita)}
                            disabled={loading}
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() => handleOpenDeleteDialog(cita)}
                            disabled={loading}
                          >
                            <Delete />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        No se encontraron citas
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>

        <ModalCita
          open={openAddModal}
          onClose={handleCloseAddModal}
          onSaveSuccess={fetchCitas}
        />

        <ModalEditarCita
          open={openEditModal}
          onClose={handleCloseEditModal}
          cita={currentCita}
          onSaveSuccess={fetchCitas}
        />

        <Dialog
          open={openDeleteDialog}
          onClose={handleCloseDeleteDialog}
        >
          <DialogTitle>Confirmar Eliminación</DialogTitle>
          <DialogContent>
            <DialogContentText>
              ¿Estás seguro que deseas eliminar la cita del {citaToDelete && formatDate(citaToDelete.fechaCita)} para {citaToDelete?.nombreMascota}?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteDialog} disabled={loading}>
              Cancelar
            </Button>
            <Button
              onClick={handleDeleteCita}
              color="error"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              Eliminar
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}