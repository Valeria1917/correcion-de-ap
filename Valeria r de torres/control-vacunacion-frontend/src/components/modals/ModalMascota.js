import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  MenuItem,
  InputLabel,
  FormControl,
  Select,
  Autocomplete,
  Link,
} from "@mui/material";
import axios from "axios";
import ModalDueño from "./ModalDueno";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ModalMascota({ open, onClose, dueño, emailDueño }) {
  const [form, setForm] = useState({
    NombreDueno: dueño || "",
    EmailDueno: emailDueño || "",
    nombre: "",
    especie: "",
    raza: "",
    edad: "",
    unidadEdad: "años",
    estadoSalud: "Saludable",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [dueños, setDueños] = useState([]);
  const [openDuenoModal, setOpenDuenoModal] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false); // NUEVO

  useEffect(() => {
    // Validar si el menú está desbloqueado
    const unlocked = localStorage.getItem('menuUnlocked') === 'true';
    setIsUnlocked(unlocked);

    const fetchDueños = async () => {
      try {
        const response = await axios.get(`${API_URL}/dueno`);
        setDueños(response.data);

        if (dueño) {
          const dueñoEncontrado = response.data.find(d => d.Nombre === dueño);
          if (dueñoEncontrado) {
            setForm(prev => ({
              ...prev,
              NombreDueno: dueñoEncontrado.Nombre,
              EmailDueno: dueñoEncontrado.Email,
            }));
          }
        }
      } catch (error) {
        console.error("Error al obtener dueños:", error);
      }
    };

    if (open) {
      fetchDueños();
      setError(null);
      setSuccess(false);
    }
  }, [open, dueño]);

  const handleDuenoModalClose = (success) => {
    setOpenDuenoModal(false);
    if (success) {
      axios.get(`${API_URL}/dueno`)
        .then(response => {
          setDueños(response.data);
          const ultimoDueño = response.data[response.data.length - 1];
          if (ultimoDueño) {
            setForm(prev => ({
              ...prev,
              NombreDueno: ultimoDueño.Nombre,
              EmailDueno: ultimoDueño.Email
            }));
          }
        })
        .catch(err => console.error("Error al recargar dueños:", err));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (["especie", "estadoSalud"].includes(name)) {
      newValue = value.charAt(0).toUpperCase() + value.slice(1);
    }

    setForm(prev => ({ ...prev, [name]: newValue }));
    if (error) setError(null);
  };

  const handleDueñoChange = (event, newValue) => {
    if (newValue) {
      setForm(prev => ({
        ...prev,
        NombreDueno: newValue.Nombre,
        EmailDueno: newValue.Email
      }));
    }
  };

  const handleUnidadEdadChange = (e) => {
    const unidad = e.target.value;
    setForm(prev => ({ ...prev, unidadEdad: unidad }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.NombreDueno || !form.nombre || !form.especie) {
      setError("Por favor completa los campos requeridos 🐶🐱");
      return;
    }

    if (parseInt(form.edad) < 0) {
      setError("La edad no puede ser negativa 🐾");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await axios.post(`${API_URL}/mascota`, form);
      setSuccess(true);
      setTimeout(() => {
        onClose(true);
        resetForm();
      }, 1500);
    } catch (error) {
      console.error("Error al registrar mascota:", error.response?.data || error.message);
      setError(error.response?.data?.message || "Error al registrar la mascota 🐾");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      NombreDueno: dueño || "",
      EmailDueno: emailDueño || "",
      nombre: "",
      especie: "",
      raza: "",
      edad: "",
      unidadEdad: "años",
      estadoSalud: "Saludable",
    });
    setSuccess(false);
  };

  const handleCloseModal = () => {
    onClose(false);
    resetForm();
  };

  return (
    <>
      <Modal open={open} onClose={handleCloseModal}>
        <Box
          sx={{
            width: { xs: '90%', sm: '500px' },
            bgcolor: "#F0FFF0",
            borderRadius: 4,
            boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
            border: "3px dashed #C2EABD",
            p: 4,
            mx: "auto",
            my: '2%',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}
          component="form"
          onSubmit={handleSubmit}
        >
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <img
              src="https://img.freepik.com/vetores-premium/ilustracao-em-aquarela-vetorial-de-um-cachorro-fofo_469760-11064.jpg"
              alt="Mascota adorable"
              style={{ maxWidth: '100px', borderRadius: '50%' }}
            />
            <Typography variant="h5" sx={{ mt: 2, fontWeight: 'bold', color: "#4CAF50", textAlign: "center" }}>
              🐾 Registrar Mascota
            </Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>¡Mascota registrada con éxito! 🎉</Alert>}

          {dueño ? (
            <TextField
              name="NombreDueno"
              label="Dueño"
              value={form.NombreDueno}
              fullWidth
              margin="normal"
              disabled
              sx={{ bgcolor: "#FFFFFF", borderRadius: 2 }}
            />
          ) : (
            <>
              <Autocomplete
                options={dueños}
                getOptionLabel={(option) => `${option.Nombre} - ${option.Email}`}
                onChange={handleDueñoChange}
                isOptionEqualToValue={(option, value) => option._id === value._id}
                value={dueños.find(d => d.Nombre === form.NombreDueno) || null}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Selecciona un Dueño"
                    margin="normal"
                    required
                    sx={{ bgcolor: "#FFFFFF", borderRadius: 2 }}
                  />
                )}
              />
              <Link
                component="button"
                variant="body2"
                sx={{ display: "block", mt: 1, color: "#66BB6A", fontStyle: 'italic' }}
                onClick={() => setOpenDuenoModal(true)}
              >
                ¿Nuevo Dueño? Agregar dueño aquí 💌
              </Link>
            </>
          )}

          <TextField
            name="EmailDueno"
            label="Email del Dueño"
            value={form.EmailDueno}
            onChange={handleChange}
            fullWidth
            margin="normal"
            disabled={!!dueño}
            sx={{ bgcolor: "#FFFFFF", borderRadius: 2 }}
          />

          <TextField
            name="nombre"
            label="Nombre de la Mascota 🐶"
            value={form.nombre}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            sx={{ bgcolor: "#FFFFFF", borderRadius: 2 }}
          />

          <FormControl fullWidth margin="normal" required sx={{ bgcolor: "#FFFFFF", borderRadius: 2 }}>
            <InputLabel>Especie</InputLabel>
            <Select
              name="especie"
              value={form.especie}
              label="Especie"
              onChange={handleChange}
            >
              <MenuItem value="Perro">🐶 Perro</MenuItem>
              <MenuItem value="Gato">🐱 Gato</MenuItem>
              <MenuItem value="Ave">🕊️ Ave</MenuItem>
              <MenuItem value="Roedor">🐹 Roedor</MenuItem>
              <MenuItem value="Reptil">🦎 Reptil</MenuItem>
              <MenuItem value="Otro">✨ Otro</MenuItem>
            </Select>
          </FormControl>

          <TextField
            name="raza"
            label="Raza"
            value={form.raza}
            onChange={handleChange}
            fullWidth
            margin="normal"
            sx={{ bgcolor: "#FFFFFF", borderRadius: 2 }}
          />

          <TextField
            name="edad"
            label={`Edad (${form.unidadEdad})`}
            value={form.edad}
            onChange={handleChange}
            fullWidth
            margin="normal"
            type="number"
            inputProps={{ min: 0, max: form.unidadEdad === "años" ? 50 : 600 }}
            sx={{ bgcolor: "#FFFFFF", borderRadius: 2 }}
          />

          <FormControl fullWidth margin="normal" sx={{ bgcolor: "#FFFFFF", borderRadius: 2 }}>
            <InputLabel>Unidad de Edad</InputLabel>
            <Select
              value={form.unidadEdad}
              label="Unidad de Edad"
              onChange={handleUnidadEdadChange}
            >
              <MenuItem value="años">Años</MenuItem>
              <MenuItem value="meses">Meses</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal" sx={{ bgcolor: "#FFFFFF", borderRadius: 2 }}>
            <InputLabel>Estado de Salud</InputLabel>
            <Select
              name="estadoSalud"
              value={form.estadoSalud}
              label="Estado de Salud"
              onChange={handleChange}
            >
              <MenuItem value="Saludable">🟢 Saludable</MenuItem>
              <MenuItem value="En tratamiento">🩺 En tratamiento</MenuItem>
              <MenuItem value="Enfermo">🤒 Enfermo</MenuItem>
              <MenuItem value="Crónico">🔁 Crónico</MenuItem>
              <MenuItem value="Discapacitado">♿ Discapacitado</MenuItem>
            </Select>
          </FormControl>

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
              onClick={resetForm}
              variant="text"
              disabled={loading}
              sx={{ borderRadius: 3 }}
            >
              Limpiar
            </Button>

            {/* SOLO muestra el botón "Registrar" si está desbloqueado */}
            {isUnlocked && (
              <Button
                type="submit"
                variant="contained"
                sx={{
                  backgroundColor: "#A5D6A7",
                  color: "#fff",
                  borderRadius: 3,
                  '&:hover': {
                    backgroundColor: "#81C784"
                  }
                }}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : null}
              >
                {loading ? "Registrando..." : "Registrar 🐾"}
              </Button>
            )}
          </Box>
        </Box>
      </Modal>

      <ModalDueño open={openDuenoModal} onClose={handleDuenoModalClose} />
    </>
  );
}

