import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Alert,
  CircularProgress,
  Autocomplete,
} from "@mui/material";
import axios from "axios";
import { format, addMonths, parseISO } from "date-fns";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ModalVacuna({ open, onClose }) {
  const [form, setForm] = useState({
    NombreDueno: "",
    EmailDueno: "",
    nombreMascota: "",
    nombreVacuna: "",
    fechaAplicacion: format(new Date(), 'yyyy-MM-dd'),
    vacunaUnica: false,
    proximaAplicacion: "",
  });

  const [dueños, setDueños] = useState([]);
  const [mascotas, setMascotas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [vacunasDisponibles, setVacunasDisponibles] = useState([
    "Rabia",
    "Moquillo",
    "Parvovirus",
    "Leptospirosis",
    "Bordetella",
    "Leucemia Felina",
    "Polivalente"
  ]);

  useEffect(() => {
    const fetchDueños = async () => {
      try {
        const response = await axios.get(`${API_URL}/dueno`);
        setDueños(response.data);
      } catch (error) {
        console.error("Error al obtener dueños:", error);
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
      const response = await axios.get(`${API_URL}/consultas/${NombreDueno}`);
      setMascotas(response.data);
    } catch (error) {
      console.error("Error al obtener mascotas:", error);
      setError("Error al cargar las mascotas");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newForm = {
      ...form,
      [name]: type === "checkbox" ? checked : value
    };

    if (name === "vacunaUnica" && checked) {
      newForm.proximaAplicacion = "";
    }

    if (name === "fechaAplicacion" && !form.vacunaUnica && value) {
      const mesesParaProxima = getMesesParaProximaVacuna(newForm.nombreVacuna);
      if (mesesParaProxima) {
        newForm.proximaAplicacion = format(
          addMonths(parseISO(value), mesesParaProxima),
          'yyyy-MM-dd'
        );
      }
    }

    setForm(newForm);
    if (error) setError(null);
  };

  const handleDueñoChange = (event, newValue) => {
    if (newValue) {
      const newForm = {
        ...form,
        NombreDueno: newValue.Nombre,
        EmailDueno: newValue.Email,
        nombreMascota: ""
      };
      setForm(newForm);
      fetchMascotas(newValue.Nombre);
    } else {
      setForm(prev => ({ ...prev, NombreDueno: "", EmailDueno: "", nombreMascota: "" }));
      setMascotas([]);
    }
  };

  const handleVacunaChange = (event, newValue) => {
    const newForm = {
      ...form,
      nombreVacuna: newValue || ""
    };

    if (form.fechaAplicacion && !form.vacunaUnica && newValue) {
      const mesesParaProxima = getMesesParaProximaVacuna(newValue);
      if (mesesParaProxima) {
        newForm.proximaAplicacion = format(
          addMonths(parseISO(form.fechaAplicacion), mesesParaProxima),
          'yyyy-MM-dd'
        );
      }
    }

    setForm(newForm);
  };

  const getMesesParaProximaVacuna = (vacuna) => {
    const vacunasPeriodicas = {
      "Rabia": 12,
      "Moquillo": 12,
      "Parvovirus": 12,
      "Leptospirosis": 6,
      "Bordetella": 6,
      "Polivalente": 12
    };
    return vacunasPeriodicas[vacuna] || null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.NombreDueno || !form.nombreMascota || !form.nombreVacuna || !form.fechaAplicacion) {
      setError("Por favor complete los campos requeridos");
      return;
    }

    if (!form.vacunaUnica && !form.proximaAplicacion) {
      setError("Por favor ingrese la fecha de próxima aplicación");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const mascotasResponse = await axios.get(`${API_URL}/consultas/${form.NombreDueno}`);
      const mascota = mascotasResponse.data.find(m => m.nombre === form.nombreMascota);

      if (!mascota) {
        throw new Error("Mascota no encontrada");
      }

      await axios.put(`${API_URL}/mascota/${mascota._id}/vacunas`, {
        nombreVacuna: form.nombreVacuna,
        fechaAplicacion: form.fechaAplicacion,
        vacunaUnica: form.vacunaUnica,
        proximaAplicacion: form.proximaAplicacion
      });

      setSuccess(true);
      setTimeout(() => onClose(true), 1500);
    } catch (error) {
      setError(error.response?.data?.error || "Error al registrar vacuna");
      console.error(error)
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      NombreDueno: "",
      EmailDueno: "",
      nombreMascota: "",
      nombreVacuna: "",
      fechaAplicacion: format(new Date(), 'yyyy-MM-dd'),
      vacunaUnica: false,
      proximaAplicacion: "",
    });
    setMascotas([]);
    setSuccess(false);
  };

  const handleCloseModal = () => {
    onClose(false);
    resetForm();
  };

  return (
    <Modal open={open} onClose={handleCloseModal}>
      <Box
        sx={{
          width: { xs: '90%', sm: '500px' },
          bgcolor: '#fce4ec',
          borderRadius: 5,
          boxShadow: '0 8px 32px rgba(236, 64, 122, 0.3)',
          p: 4,
          mx: 'auto',
          my: '5%',
          maxHeight: '90vh',
          overflowY: 'auto',
          fontFamily: 'Comic Sans MS, cursive, sans-serif',
          border: '2px solid #f8bbd0'
        }}
        component="form"
        onSubmit={handleSubmit}
      >
        <Box sx={{ textAlign: 'center' }}>
          <img
            src="https://cdn.pixabay.com/photo/2024/06/28/09/45/veterinarian-8859077_1280.jpg"
            alt="Veterinaria"
            style={{
              width: '100%',
              maxHeight: '180px',
              objectFit: 'cover',
              borderRadius: '15px',
              marginBottom: '20px',
              border: '3px solid #f48fb1'
            }}
          />
        </Box>

        <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', color: '#ad1457', textAlign: 'center' }}>
          🎀 Registro de Vacuna
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>✅ Vacuna registrada con éxito!</Alert>}

        {/* Autocomplete campos */}
        <Autocomplete
          options={dueños}
          getOptionLabel={(option) => `${option.Nombre} - ${option.Email}`}
          onChange={handleDueñoChange}
          isOptionEqualToValue={(option, value) => option._id === value._id}
          renderInput={(params) => (
            <TextField {...params} label="👤 Selecciona un Dueño" margin="normal" required sx={{ backgroundColor: 'white', borderRadius: 2 }} />
          )}
        />

        <Autocomplete
          options={mascotas.map((m) => m.nombre)}
          onChange={(e, newValue) => setForm({ ...form, nombreMascota: newValue || "" })}
          value={form.nombreMascota}
          disabled={!form.NombreDueno}
          renderInput={(params) => (
            <TextField {...params} label="🐶 Selecciona una Mascota" margin="normal" required sx={{ backgroundColor: 'white', borderRadius: 2 }} />
          )}
        />

        <Autocomplete
          options={vacunasDisponibles}
          onChange={handleVacunaChange}
          value={form.nombreVacuna}
          renderInput={(params) => (
            <TextField {...params} label="💉 Vacuna" margin="normal" required sx={{ backgroundColor: 'white', borderRadius: 2 }} />
          )}
        />

        {/* Fecha aplicación y próxima */}
        <TextField
          name="fechaAplicacion"
          label="📅 Fecha de Aplicación"
          value={form.fechaAplicacion}
          onChange={handleChange}
          fullWidth
          margin="normal"
          type="date"
          InputLabelProps={{ shrink: true }}
          required
          sx={{ backgroundColor: 'white', borderRadius: 2 }}
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={form.vacunaUnica}
              onChange={handleChange}
              name="vacunaUnica"
              sx={{ color: '#ec407a', '&.Mui-checked': { color: '#c2185b' } }}
            />
          }
          label="✨ Vacuna Única (sin refuerzo)"
          sx={{ mt: 1 }}
        />

        {!form.vacunaUnica && (
          <TextField
            name="proximaAplicacion"
            label="🔜 Próxima Aplicación"
            value={form.proximaAplicacion}
            onChange={handleChange}
            fullWidth
            margin="normal"
            type="date"
            InputLabelProps={{ shrink: true }}
            required={!form.vacunaUnica}
            sx={{ backgroundColor: 'white', borderRadius: 2 }}
          />
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            onClick={handleCloseModal}
            variant="outlined"
            disabled={loading}
            sx={{
              color: '#d81b60',
              borderColor: '#f8bbd0',
              borderRadius: 3,
              '&:hover': {
                backgroundColor: '#fce4ec',
                borderColor: '#ec407a',
              },
            }}
          >
            ❌ Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
            sx={{
              backgroundColor: '#ec407a',
              color: 'white',
              borderRadius: 3,
              '&:hover': {
                backgroundColor: '#c2185b',
              },
            }}
          >
            {loading ? "Registrando..." : "Guardar 🐾"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
