// pages/DuenosPage.js
"use client";
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  CircularProgress,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import axios from 'axios';
import Navbar from '@/components/navbar/navbar';
import ModalDueño from '@/components/modals/ModalDueno';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function DuenosPage() {
  const [duenos, setDuenos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [currentDueno, setCurrentDueno] = useState(null);

  useEffect(() => {
    fetchDuenos();
  }, []);

  const fetchDuenos = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/dueno`);
      setDuenos(response.data);
    } catch (error) {
      console.error("Error al obtener dueños:", error);
      setError("Error al cargar los dueños");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (dueno = null) => {
    setCurrentDueno(dueno);
    setOpenModal(true);
  };

  const handleCloseModal = (refresh = false) => {
    setOpenModal(false);
    if (refresh) fetchDuenos();
  };

  const handleOpenDeleteDialog = (dueno) => {
    setCurrentDueno(dueno);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setCurrentDueno(null);
  };

  const handleDeleteDueno = async () => {
    if (!currentDueno) return;

    setLoading(true);
    try {
      await axios.delete(`${API_URL}/dueno/${currentDueno._id}`);
      fetchDuenos();
      handleCloseDeleteDialog();
    } catch (error) {
      console.error("Error al eliminar dueño:", error);
      setError("Error al eliminar el dueño");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Navbar />
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
          Gestión de Dueños
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenModal()}
          sx={{ mb: 2 }}
        >
          Nuevo Dueño
        </Button>

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
                  <TableCell><strong>Email</strong></TableCell>
                  <TableCell><strong>Dirección</strong></TableCell>
                  <TableCell><strong>Acciones</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {duenos.length > 0 ? (
                  duenos.map((dueno) => (
                    <TableRow key={dueno._id}>
                      <TableCell>{dueno.Nombre}</TableCell>
                      <TableCell>{dueno.Email}</TableCell>
                      <TableCell>{dueno.direccion}</TableCell>
                      <TableCell>
                        <IconButton color="primary" onClick={() => handleOpenModal(dueno)}>
                          <Edit />
                        </IconButton>
                        <IconButton color="error" onClick={() => handleOpenDeleteDialog(dueno)}>
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center">No se encontraron dueños</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Modal para editar/crear dueños */}
        <ModalDueño
          open={openModal}
          onClose={handleCloseModal}
          onSave={currentDueno}
        />

        {/* Dialogo de confirmación de eliminación */}
        <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
          <DialogTitle>Confirmar Eliminación</DialogTitle>
          <DialogContent>
            <DialogContentText>
              ¿Estás seguro que deseas eliminar a {currentDueno?.Nombre}?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteDialog}>Cancelar</Button>
            <Button onClick={handleDeleteDueno} color="error">Eliminar</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}
