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
  Autocomplete,
  CircularProgress,
  Alert,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { Search, Refresh, Add, Edit, Delete, Pets, ConstructionOutlined } from '@mui/icons-material';
import axios from 'axios';
import Navbar from '@/components/navbar/navbar';
import ModalMascota from '@/components/modals/ModalMascota';
import ModalEditarMascota from '@/components/modals/ModalEditarMascota';
import jsPDF from 'jspdf';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function MascotasPage() {
  const [mascotas, setMascotas] = useState([]);
  const [dueños, setDueños] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDueño, setSelectedDueño] = useState(null);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [mascotaToDelete, setMascotaToDelete] = useState(null);
  const [currentMascota, setCurrentMascota] = useState(null);
  const [selectedPets, setSelectedPets] = useState([]);
  const [reportType, setReportType] = useState('semanal');
  const [selectedDueñoBuscado, setSelectedDueñoBuscado] = useState(false);

  const generatePDF = (reportData, reportType) => {
    const doc = new jsPDF();
    const formatDate = (dateString) => {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('es-ES', options);
    };

    doc.setFontSize(18);
    doc.text(`Reporte de Vacunación ${reportType}`, 10, 20);
    doc.setFontSize(12);

    let yPosition = 30;
    reportData.forEach((entry, index) => {
      if (yPosition > 280) {
        doc.addPage();
        yPosition = 20;
      }

      // Datos del dueño
      doc.setFont(undefined, 'bold');
      doc.text(`Dueño: ${entry.dueno.nombre}`, 10, yPosition);
      doc.setFont(undefined, 'normal');
      doc.text(`Email: ${entry.dueno.email}`, 10, yPosition + 7);
      doc.text(`Dirección: ${entry.dueno.direccion}`, 10, yPosition + 14);

      // Datos de la mascota
      doc.setFont(undefined, 'bold');
      doc.text(`Mascota: ${entry.mascota.nombre}`, 10, yPosition + 24);
      doc.setFont(undefined, 'normal');
      doc.text(`Edad: ${entry.mascota.edad} años`, 10, yPosition + 31);
      doc.text(`Especie: ${entry.mascota.especie}`, 10, yPosition + 38);
      doc.text(`Raza: ${entry.mascota.raza}`, 10, yPosition + 45);

      // Vacunas
      doc.setFont(undefined, 'bold');
      doc.text(`Vacunas aplicadas:`, 10, yPosition + 55);
      doc.setFont(undefined, 'normal');

      entry.vacunas.forEach((vacuna, idx) => {
        const text = `• ${vacuna.nombreVacuna}: ${formatDate(vacuna.fechaAplicacion)}`;
        doc.text(text, 15, yPosition + 65 + (idx * 10));
      });

      yPosition += 75 + (entry.vacunas.length * 10);

      // Agregar separador si no es el último elemento
      if (index < reportData.length - 1) {
        doc.line(10, yPosition, 200, yPosition);
        yPosition += 10;
      }
    });

    doc.save(`reporte_vacunacion_${reportType}.pdf`);
  };

  const handleGenerateReport = async () => {
    if (!selectedDueño) {
      setError("Debe seleccionar un dueño primero");
      return;
    }

    const mascotasIds = selectedPets.map(pet => pet._id);
    const duenoId = selectedDueño.Email;

    try {
      setLoading(true);
      setError(null);

      let endpoint;
      switch (reportType) {
        case 'semanal':
          endpoint = "/consultas/reporte/vacunacion/semanal";
          break;
        case 'mensual':
          endpoint = "/consultas/reporte/vacunacion/mensual";
          break;
        case 'trimestral':
          endpoint = "/consultas/reporte/vacunacion/trimestral";
          break;
        default:
          throw new Error('Tipo de reporte inválido');
      }

      console.log("Enviando solicitud a:", `${API_URL}${endpoint}`);
      console.log("Datos enviados:", { duenoId, mascotasIds });

      const response = await axios.post(`${API_URL}${endpoint}`, {
        duenoId,
        mascotasIds
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log("Respuesta recibida:", response.data);

      if (!response.data || response.data.length === 0) {
        setError("No hay datos para generar el reporte");
        return;
      }

      generatePDF(response.data, reportType);
    } catch (error) {
      console.error("Detalles del error:", {
        message: error.message,
        response: error.response?.data,
        code: error.code,
        config: error.config
      });

      setError(error.response?.data?.message ||
        "Error al generar el reporte. Verifica la conexión con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMascotas();
    fetchDueños();
  }, []);

  const fetchMascotas = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/mascota`);
      setMascotas(response.data);
    } catch (error) {
      console.error("Error al obtener mascotas:", error);
      setError("Error al cargar las mascotas");
    } finally {
      setLoading(false);
    }
  };

  const fetchDueños = async () => {
    try {
      const response = await axios.get(`${API_URL}/dueno`);
      setDueños(response.data);
    } catch (error) {
      console.error("Error al obtener dueños:", error);
    }
  };

  const handleSearchByDueño = async () => {
    setSelectedDueñoBuscado(true)
    if (!selectedDueño) {
      setError("Por favor seleccione un dueño");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/consultas/${selectedDueño.Nombre}`);
      setMascotas(response.data);
    } catch (error) {
      console.error("Error al buscar mascotas por dueño:", error);
      setError("Error al buscar mascotas por dueño");
    } finally {
      setLoading(false);
    }
  };

  const handleResetSearch = () => {
    setSelectedDueño(null);
    fetchMascotas();
  };

  const handleOpenCreateModal = () => {
    setOpenCreateModal(true);
  };

  const handleCloseCreateModal = (refresh = false) => {
    setOpenCreateModal(false);
    if (refresh) fetchMascotas();
  };

  const handleOpenEditModal = (mascota) => {
    setCurrentMascota(mascota);
    setOpenEditModal(true);
  };

  const handleCloseEditModal = (refresh = false) => {
    setOpenEditModal(false);
    setCurrentMascota(null);
    if (refresh) fetchMascotas();
  };

  const handleOpenDeleteDialog = (mascota) => {
    setMascotaToDelete(mascota);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setMascotaToDelete(null);
  };

  const handleDeleteMascota = async () => {
    if (!mascotaToDelete) return;

    setLoading(true);
    try {
      await axios.delete(`${API_URL}/mascota/${mascotaToDelete._id}`);
      fetchMascotas();
      handleCloseDeleteDialog();
    } catch (error) {
      console.error("Error al eliminar mascota:", error);
      setError("Error al eliminar la mascota");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Navbar />
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
          Gestión de Mascotas
        </Typography>



        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        {/* Sección de búsqueda */}
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Buscar Mascotas
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleOpenCreateModal}
            >
              Nueva Mascota
            </Button>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Autocomplete
              sx={{ flex: 1 }}
              options={dueños}
              getOptionLabel={(option) => `${option.Nombre} - ${option.Email}`}
              value={selectedDueño}
              onChange={(event, newValue) => setSelectedDueño(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Seleccione un dueño"
                  margin="normal"
                />
              )}
            />

            <Button
              variant="contained"
              onClick={handleSearchByDueño}
              startIcon={<Search />}
              disabled={!selectedDueño || loading}
            >
              Buscar
            </Button>

            <Button
              variant="outlined"
              onClick={handleResetSearch}
              startIcon={<Refresh />}
              disabled={loading}
            >
              Restablecer
            </Button>
          </Box>
        </Paper>

        <Paper elevation={3} sx={{ p: 3, mb: 4, mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Generar Reporte de Vacunación
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Autocomplete
              multiple
              sx={{ flex: 2 }}
              options={mascotas}
              getOptionLabel={(option) => option.nombre}
              value={selectedPets}
              onChange={(event, newValue) => setSelectedPets(newValue)}
              disabled={!selectedDueño}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Seleccionar mascotas"
                  placeholder="Seleccione mascotas"
                />
              )}
            />

            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>Tipo de Reporte</InputLabel>
              <Select
                value={reportType}
                label="Tipo de Reporte"
                onChange={(e) => setReportType(e.target.value)}
              >
                <MenuItem value="semanal">Semanal</MenuItem>
                <MenuItem value="mensual">Mensual</MenuItem>
                <MenuItem value="trimestral">Trimestral</MenuItem>
              </Select>
            </FormControl>

            <Button
              variant="contained"
              color="secondary"
              onClick={handleGenerateReport}
              disabled={!selectedDueñoBuscado || !selectedDueño || loading}
              startIcon={<Pets />}
            >
              Generar PDF
            </Button>
          </Box>
        </Paper>

        {/* Tabla de mascotas */}
        <Paper elevation={3} sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Listado de Mascotas
            </Typography>
            <Typography variant="body2">
              Total: {mascotas.length} mascotas
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
                    <TableCell><strong>Nombre</strong></TableCell>
                    <TableCell><strong>Dueño</strong></TableCell>
                    <TableCell><strong>Especie</strong></TableCell>
                    <TableCell><strong>Raza</strong></TableCell>
                    <TableCell><strong>Edad</strong></TableCell>
                    <TableCell><strong>Estado de Salud</strong></TableCell>
                    <TableCell><strong>Acciones</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mascotas.length > 0 ? (
                    mascotas.map((mascota) => (
                      <TableRow key={mascota._id}>
                        <TableCell>{mascota.nombre}</TableCell>
                        <TableCell>{mascota.NombreDueno}</TableCell>
                        <TableCell>{mascota.especie}</TableCell>
                        <TableCell>{mascota.raza}</TableCell>
                        <TableCell>{mascota.edad} años</TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              display: 'inline-block',
                              p: '4px 8px',
                              borderRadius: 1,
                              backgroundColor:
                                mascota.estadoSalud === 'Saludable'
                                  ? '#e8f5e9'
                                  : mascota.estadoSalud === 'Enfermo'
                                    ? '#ffebee'
                                    : '#fff8e1',
                              color:
                                mascota.estadoSalud === 'Saludable'
                                  ? '#2e7d32'
                                  : mascota.estadoSalud === 'Enfermo'
                                    ? '#c62828'
                                    : '#f57f17',
                              fontWeight: 'medium'
                            }}
                          >
                            {mascota.estadoSalud}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <IconButton
                            color="primary"
                            onClick={() => handleOpenEditModal(mascota)}
                            disabled={loading}
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() => handleOpenDeleteDialog(mascota)}
                            disabled={loading}
                          >
                            <Delete />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        No se encontraron mascotas
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>

        {/* Modal para crear nuevas mascotas */}
        <ModalMascota
          open={openCreateModal}
          onClose={handleCloseCreateModal}
        />

        {/* Modal para editar mascotas existentes */}
        <ModalEditarMascota
          open={openEditModal}
          onClose={handleCloseEditModal}
          mascota={currentMascota}
          onSaveSuccess={() => {
            fetchMascotas();
            handleCloseEditModal();
          }}
        />

        {/* Diálogo de confirmación para eliminar */}
        <Dialog
          open={openDeleteDialog}
          onClose={handleCloseDeleteDialog}
        >
          <DialogTitle>Confirmar Eliminación</DialogTitle>
          <DialogContent>
            <DialogContentText>
              ¿Estás seguro que deseas eliminar a {mascotaToDelete?.nombre} ({mascotaToDelete?.especie})?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteDialog} disabled={loading}>
              Cancelar
            </Button>
            <Button
              onClick={handleDeleteMascota}
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