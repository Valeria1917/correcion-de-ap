import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Autocomplete,
  Link,
  Alert,
  CircularProgress
} from "@mui/material";
import axios from "axios";
import ModalMascota from "./ModalMascota";
import ModalDueño from "./ModalDueno";

export default function ModalCita({ open, onClose, onSaveSuccess }) {
  const [form, setForm] = useState({
    NombreDueno: "",
    EmailDueno: "",
    nombreMascota: "",
    fechaCita: "",
    motivo: "",
    estado: "Pendiente",
  });

  const [dueños, setDueños] = useState([]);
  const [mascotas, setMascotas] = useState([]);
  const [openMascotaModal, setOpenMascotaModal] = useState(false);
  const [openDuenoModal, setOpenDuenoModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchDueños = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/dueno`);
        setDueños(response.data);
      } catch (error) {
        console.error("Error al obtener los dueños:", error);
        setError("Error al cargar los dueños");
      }
    };

    if (open) {
      fetchDueños();
      setError(null);
      setSuccess(false);
    }
  }, [open]);

  const fetchMascotas = async (NombreDueno) => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/consultas/${NombreDueno}`);
      setMascotas(response.data);
    } catch (error) {
      console.error("Error al obtener las mascotas:", error);
      setError("Error al cargar las mascotas");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleDueñoChange = (event, newValue) => {
    if (newValue) {
      setForm({
        ...form,
        NombreDueno: newValue.Nombre,
        EmailDueno: newValue.Email,
        nombreMascota: ""
      });
      fetchMascotas(newValue.Nombre);
    } else {
      setForm(prev => ({
        ...prev,
        NombreDueno: "",
        EmailDueno: "",
        nombreMascota: ""
      }));
      setMascotas([]);
    }
  };

  const handleMascotaChange = (event, newValue) => {
    setForm(prev => ({ ...prev, nombreMascota: newValue || "" }));
  };

  const handleSubmit = async () => {
    if (!form.NombreDueno || !form.nombreMascota || !form.fechaCita) {
      setError("Por favor complete todos los campos requeridos");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/cita`, form);
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(true);
        onSaveSuccess();
      }, 1500);
    } catch (error) {
      console.error("Error al agendar cita:", error);
      setError(error.response?.data?.message || "Error al agendar la cita");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    onClose();
    setForm({
      NombreDueno: "",
      EmailDueno: "",
      nombreMascota: "",
      fechaCita: "",
      motivo: "",
      estado: "Pendiente",
    });
    setMascotas([]);
  };

  const handleDuenoModalClose = (success) => {
    setOpenDuenoModal(false);
    if (success) {
      axios.get(`${process.env.NEXT_PUBLIC_API_URL}/dueno`)
        .then(response => setDueños(response.data))
        .catch(err => console.error("Error al recargar dueños:", err));
    }
  };

  return (
    <>
      <Modal open={open} onClose={handleCloseModal}>
        <Box
          sx={{
            width: { xs: '90%', sm: '500px' },
            bgcolor: "#FFF0F5",
            borderRadius: 4,
            boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
            p: 4,
            mx: "auto",
            my: '5%',
            maxHeight: '90vh',
            overflowY: 'auto',
            border: '3px dashed #FFD1DC',
            textAlign: 'center'
          }}
        >
          <img
            src="https://img.freepik.com/fotos-premium/perro-dibujos-animados-fondo-azul_881695-5042.jpg"
            alt="Cita de mascota"
            style={{
              maxWidth: "100%",
              height: "auto",
              borderRadius: "12px",
              marginBottom: "16px"
            }}
          />

          <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold', color: "#77DD77" }}>
            🐾 Agendar Cita
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>¡Cita agendada con éxito! 🎉</Alert>}

          <Autocomplete
            options={dueños}
            getOptionLabel={(option) => `${option.Nombre} - ${option.Email}`}
            onChange={handleDueñoChange}
            isOptionEqualToValue={(option, value) => option._id === value._id}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Selecciona un Dueño"
                margin="normal"
                required
                sx={{ bgcolor: "#FFF", borderRadius: 2 }}
              />
            )}
          />

          <Link
            component="button"
            variant="body2"
            sx={{ display: "block", mt: 1, color: "#FF69B4", fontStyle: 'italic' }}
            onClick={() => setOpenDuenoModal(true)}
          >
            ¿Nuevo Dueño? Agregar dueño aquí 💌
          </Link>

          <Autocomplete
            options={mascotas.map((m) => m.nombre)}
            onChange={handleMascotaChange}
            value={form.nombreMascota}
            disabled={!form.NombreDueno}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Selecciona una Mascota"
                margin="normal"
                required
                sx={{ bgcolor: "#FFF", borderRadius: 2 }}
              />
            )}
          />

          <Link
            component="button"
            variant="body2"
            sx={{
              display: "block",
              mt: 1,
              color: "#FF69B4",
              fontStyle: 'italic'
            }}
            onClick={() => setOpenMascotaModal(true)}
            disabled={!form.NombreDueno}
          >
            ¿Nueva Mascota? Agregar mascota aquí 🐶🐱
          </Link>

          <TextField
            name="fechaCita"
            label="Fecha de la Cita"
            value={form.fechaCita}
            onChange={handleChange}
            fullWidth
            margin="normal"
            type="date"
            InputLabelProps={{ shrink: true }}
            required
            sx={{ bgcolor: "#FFF", borderRadius: 2 }}
          />

          <TextField
            name="motivo"
            label="Motivo"
            value={form.motivo}
            onChange={handleChange}
            fullWidth
            margin="normal"
            multiline
            rows={3}
            sx={{ bgcolor: "#FFF", borderRadius: 2 }}
          />

          <TextField
            select
            name="estado"
            label="Estado"
            value={form.estado}
            onChange={handleChange}
            fullWidth
            margin="normal"
            sx={{ bgcolor: "#FFF", borderRadius: 2 }}
          >
            <MenuItem value="Pendiente">Pendiente ⏳</MenuItem>
            <MenuItem value="Completada">Completada ✅</MenuItem>
            <MenuItem value="Cancelada">Cancelada ❌</MenuItem>
          </TextField>

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
            <Button
              onClick={handleCloseModal}
              variant="outlined"
              color="error"
              disabled={loading}
              sx={{ borderRadius: 3 }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              sx={{
                backgroundColor: "#FFB6C1",
                color: "#fff",
                borderRadius: 3,
                '&:hover': {
                  backgroundColor: "#FF69B4"
                }
              }}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              {loading ? "Agendando..." : "Agendar 🗓️"}
            </Button>
          </Box>
        </Box>
      </Modal>

      <ModalMascota
        open={openMascotaModal}
        onClose={(success) => {
          setOpenMascotaModal(false);
          if (success && form.NombreDueno) {
            fetchMascotas(form.NombreDueno);
          }
        }}
        dueño={form.NombreDueno}
        emailDueño={form.EmailDueno}
      />

      <ModalDueño
        open={openDuenoModal}
        onClose={handleDuenoModalClose}
      />
    </>
  );
}
