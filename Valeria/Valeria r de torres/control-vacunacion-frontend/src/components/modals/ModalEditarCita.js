"use client";
import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Autocomplete,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  Fade
} from "@mui/material";
import axios from "axios";
import { format } from "date-fns";
import jsPDF from "jspdf";
import emailjs from "emailjs-com";

export default function ModalEditarCita({ open, onClose, cita, onSaveSuccess }) {
  const [form, setForm] = useState({
    NombreDueno: "",
    nombreMascota: "",
    fechaCita: format(new Date(), "yyyy-MM-dd"),
    motivo: "",
    estado: "Pendiente",
  });

  const [dueños, setDueños] = useState([]);
  const [mascotas, setMascotas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (open) {
      if (cita) {
        const fechaFormateada = format(new Date(cita.fechaCita), "yyyy-MM-dd");
        setForm({
          ...cita,
          fechaCita: fechaFormateada,
        });
      } else {
        setForm({
          NombreDueno: "",
          nombreMascota: "",
          fechaCita: format(new Date(), "yyyy-MM-dd"),
          motivo: "",
          estado: "Pendiente",
        });
      }

      fetchDueños();
      setError(null);
      setSuccess(false);
    }
  }, [open, cita]);

  const fetchDueños = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/dueno`);
      setDueños(response.data);
    } catch (error) {
      console.error("Error al obtener dueños:", error);
      setError("Error al cargar los dueños");
    }
  };

  const fetchMascotas = async (NombreDueno) => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/consultas/${NombreDueno}`);
      setMascotas(response.data);
    } catch (error) {
      console.error("Error al obtener mascotas:", error);
      setError("Error al cargar las mascotas");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleDueñoChange = (event, newValue) => {
    if (newValue) {
      setForm((prev) => ({
        ...prev,
        NombreDueno: newValue.Nombre,
        nombreMascota: "",
      }));
      fetchMascotas(newValue.Nombre);
    }
  };

  const handleMascotaChange = (event, newValue) => {
    setForm((prev) => ({ ...prev, nombreMascota: newValue || "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.NombreDueno || !form.nombreMascota || !form.fechaCita) {
      setError("Por favor complete todos los campos requeridos");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (cita) {
        await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/cita/${cita._id}`, form);
        setSuccess("Cita actualizada con éxito");
      } else {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/cita`, form);
        setSuccess("Cita creada con éxito");
      }

      setTimeout(() => {
        onClose();
        onSaveSuccess();
      }, 1500);
    } catch (error) {
      console.error("Error al guardar cita:", error);
      setError(error.response?.data?.message || "Error al guardar la cita");
    } finally {
      setLoading(false);
    }
  };

  const generarPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("📋 Detalles de la Cita Veterinaria", 20, 20);
    doc.setFontSize(12);
    doc.text(`Dueño: ${form.NombreDueno}`, 20, 40);
    doc.text(`Mascota: ${form.nombreMascota}`, 20, 50);
    doc.text(`Fecha: ${form.fechaCita}`, 20, 60);
    doc.text(`Motivo: ${form.motivo}`, 20, 70);
    doc.text(`Estado: ${form.estado}`, 20, 80);
    return doc;
  };

  const descargarPDF = () => {
    const doc = generarPDF();
    doc.save(`Cita_${form.nombreMascota}.pdf`);
  };

  const enviarPDFporCorreo = async () => {
    const dueno = dueños.find(d => d.Nombre === form.NombreDueno);

    if (!dueno || !dueno.Email) {
      setError("No se encontró el correo del dueño");
      return;
    }

    const doc = generarPDF();
    const pdfBase64 = doc.output("datauristring");

    try {
      await emailjs.send(
        "mongodb://127.0.0.1:27017/BD_ControlVacunacion", // 👉 Reemplaza con tu ID de servicio de EmailJS
        "mendozagemelo345@gmail.com", // 👉 Reemplaza con tu ID de plantilla
        {
          to_email: dueno.Email,
          from_name: "Veterinaria 🐾",
          message: `Hola ${form.NombreDueno}, aquí está el PDF de tu cita para ${form.nombreMascota}.`,
          pdf_link: pdfBase64, // ⚠️ O crea una variable en tu plantilla si lo usas así
        },
        "zipd lpke hdoo hwqk" // 👉 Tu clave pública de EmailJS
      );

      setSuccess("PDF enviado al correo del dueño exitosamente");
    } catch (err) {
      console.error("Error al enviar el PDF:", err);
      setError("Error al enviar el PDF por correo");
    }
  };

  return (
    <Modal open={open} onClose={onClose} closeAfterTransition>
      <Fade in={open}>
        <Box
          sx={{
            width: { xs: "90%", sm: "500px" },
            bgcolor: "#f9f9f9",
            borderRadius: 3,
            boxShadow: 6,
            p: 4,
            mx: "auto",
            my: "5%",
            maxHeight: "90vh",
            overflowY: "auto",
            border: "1px solid #e0e0e0",
          }}
          component="form"
          onSubmit={handleSubmit}
        >
          <Typography variant="h5" align="center" sx={{ mb: 3, fontWeight: "bold", color: "#1976d2" }}>
            {cita ? "Editar Cita" : "Nueva Cita"}
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

          <Autocomplete
            options={dueños}
            getOptionLabel={(option) => `${option.Nombre} - ${option.Email}`}
            onChange={handleDueñoChange}
            isOptionEqualToValue={(option, value) => option._id === value._id}
            value={dueños.find((d) => d.Nombre === form.NombreDueno) || null}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Selecciona un Dueño"
                margin="normal"
                required
              />
            )}
          />

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
              />
            )}
          />

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
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Estado</InputLabel>
            <Select
              name="estado"
              value={form.estado}
              label="Estado"
              onChange={handleChange}
            >
              <MenuItem value="Pendiente">Pendiente</MenuItem>
              <MenuItem value="Completada">Completada</MenuItem>
              <MenuItem value="Cancelada">Cancelada</MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 4 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1 }}>
              <Button
                onClick={onClose}
                variant="outlined"
                sx={{ color: "#9e9e9e", borderColor: "#9e9e9e" }}
                disabled={loading}
              >
                Cancelar
              </Button>

              <Button
                type="submit"
                variant="contained"
                sx={{ bgcolor: "#1976d2", "&:hover": { bgcolor: "#155fa0" } }}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
              >
                {loading ? (cita ? "Actualizando..." : "Creando...") : (cita ? "Actualizar Cita" : "Crear Cita")}
              </Button>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1 }}>
              <Button
                onClick={descargarPDF}
                variant="outlined"
                sx={{ color: "#4caf50", borderColor: "#4caf50" }}
                disabled={loading}
              >
                Descargar PDF
              </Button>

              <Button
                onClick={enviarPDFporCorreo}
                variant="outlined"
                sx={{ color: "#1976d2", borderColor: "#1976d2" }}
                disabled={loading}
              >
                Enviar PDF
              </Button>
            </Box>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
}
