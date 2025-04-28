"use client";
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
    Divider,
    Stack
} from "@mui/material";
import axios from "axios";
import jsPDF from "jspdf";
import Image from "next/image";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ModalEditarMascota({ open, onClose, mascota, onSaveSuccess }) {
    const [form, setForm] = useState({
        nombre: "",
        especie: "",
        raza: "",
        edad: "",
    
        estadoSalud: "Saludable",
        NombreDueno: "",
        EmailDueno: ""
    });

    const [dueños, setDueños] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const fetchDueños = async () => {
            try {
                const response = await axios.get(`${API_URL}/dueno`);
                setDueños(response.data);

                if (mascota) {
                    const dueñoActual = response.data.find(d => d.Nombre === mascota.NombreDueno);
                    if (dueñoActual) {
                        setForm(prev => ({ ...prev, EmailDueno: dueñoActual.Email }));
                    }
                }
            } catch (error) {
                console.error("Error al obtener dueños:", error);
            }
        };

        if (open) {
            fetchDueños();
            setForm(mascota ? {
                nombre: mascota.nombre,
                especie: mascota.especie,
                raza: mascota.raza,
                edad: mascota.edad || "",
                edadMeses: mascota.edadMeses || "",
                estadoSalud: mascota.estadoSalud,
                NombreDueno: mascota.NombreDueno,
                EmailDueno: ""
            } : {
                nombre: "",
                especie: "",
                raza: "",
                edad: "",
                estadoSalud: "Saludable",
                NombreDueno: "",
                EmailDueno: ""
            });
            setError(null);
            setSuccess(false);
        }
    }, [open, mascota]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.nombre || !form.especie || !form.NombreDueno) {
            setError("Por favor complete los campos requeridos");
            return;
        }

        const edadAnios = parseInt(form.edad) || 0;
        const edadMeses = parseInt(form.edadMeses) || 0;

        if (edadAnios < 0 || edadMeses < 0 || (edadAnios === 0 && edadMeses === 0)) {
            setError("La edad debe ser mayor a 0 meses");
            return;
        }

        setLoading(true);
        setError(null);

        const datosMascota = {
            ...form,
            edad: edadAnios,
            edadMeses: edadMeses
        };

        try {
            if (mascota) {
                await axios.put(`${API_URL}/mascota/${mascota._id}`, datosMascota);
                setSuccess("Mascota actualizada con éxito");
            } else {
                await axios.post(`${API_URL}/mascota`, datosMascota);
                setSuccess("Mascota creada con éxito");
            }

            setTimeout(() => {
                onClose();
                onSaveSuccess();
                setForm({
                    nombre: "",
                    especie: "",
                    raza: "",
                    edad: "",
                    edadMeses: "",
                    estadoSalud: "Saludable",
                    NombreDueno: "",
                    EmailDueno: ""
                });
            }, 1500);
        } catch (error) {
            console.error("Error al guardar mascota:", error);
            setError(error.response?.data?.message || "Error al guardar la mascota");
        } finally {
            setLoading(false);
        }
    };

    const generarPDF = () => {
        const doc = new jsPDF();
        doc.text(`Nombre: ${form.nombre}`, 10, 10);
        doc.text(`Especie: ${form.especie}`, 10, 20);
        doc.text(`Raza: ${form.raza}`, 10, 30);
        doc.text(`Edad: ${form.edad} años y ${form.edadMeses} meses`, 10, 40);
        doc.text(`Estado de Salud: ${form.estadoSalud}`, 10, 50);
        doc.text(`Dueño: ${form.NombreDueno} - ${form.EmailDueno}`, 10, 60);
        doc.save(`Mascota_${form.nombre}.pdf`);
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    width: { xs: '90%', sm: '600px' },
                    bgcolor: '#fff9f3',
                    borderRadius: 4,
                    boxShadow: 6,
                    p: 4,
                    mx: 'auto',
                    my: '2%',
                    maxHeight: '90vh',
                    overflowY: 'auto',
                    border: '2px solid #ffd1dc'
                }}
            >
                <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
                    <Image src="/logo-veterinaria.png" alt="Logo Veterinaria" width={80} height={80} />
                    <Typography variant="h5" fontWeight="bold" mt={1}>
                        {mascota ? "🐾 Editar Mascota" : "🐾 Registrar Nueva Mascota"}
                    </Typography>
                </Box>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

                <Divider textAlign="left" sx={{ my: 2, color: '#ff80ab' }}>Información General</Divider>

                <Stack spacing={2}>
                    <TextField
                        name="nombre"
                        label="Nombre"
                        value={form.nombre}
                        onChange={handleChange}
                        required
                    />

                    <Autocomplete
                        options={dueños}
                        getOptionLabel={(option) => `${option.Nombre} - ${option.Email}`}
                        onChange={handleDueñoChange}
                        value={dueños.find(d => d.Nombre === form.NombreDueno) || null}
                        isOptionEqualToValue={(option, value) => option._id === value._id}
                        renderInput={(params) => (
                            <TextField {...params} label="Dueño" required />
                        )}
                    />

                    <TextField
                        name="EmailDueno"
                        label="Email del Dueño"
                        value={form.EmailDueno}
                        disabled
                    />
                </Stack>

                <Divider textAlign="left" sx={{ my: 3, color: '#ff80ab' }}>Características</Divider>

                <Stack spacing={2}>
                    <FormControl fullWidth required>
                        <InputLabel>Especie</InputLabel>
                        <Select
                            name="especie"
                            value={form.especie}
                            label="Especie"
                            onChange={handleChange}
                        >
                            <MenuItem value="Perro">Perro</MenuItem>
                            <MenuItem value="Gato">Gato</MenuItem>
                            <MenuItem value="Ave">Ave</MenuItem>
                            <MenuItem value="Roedor">Roedor</MenuItem>
                            <MenuItem value="Reptil">Reptil</MenuItem>
                            <MenuItem value="Otro">Otro</MenuItem>
                        </Select>
                    </FormControl>

                    <TextField
                        name="raza"
                        label="Raza"
                        value={form.raza}
                        onChange={handleChange}
                    />

                    <Stack direction="row" spacing={2}>
                        <TextField
                            name="edad"
                            label="Edad (años)"
                            type="number"
                            value={form.edad}
                            onChange={handleChange}
                            inputProps={{ min: 0, max: 50 }}
                            required
                        />
                        <TextField
                            name="edadMeses"
                            label="Edad (meses)"
                            type="number"
                            value={form.edadMeses}
                            onChange={handleChange}
                            inputProps={{ min: 0, max: 11 }}
                            required
                        />
                    </Stack>

                    <FormControl fullWidth>
                        <InputLabel>Estado de Salud</InputLabel>
                        <Select
                            name="estadoSalud"
                            value={form.estadoSalud}
                            label="Estado de Salud"
                            onChange={handleChange}
                        >
                            <MenuItem value="Saludable">Saludable</MenuItem>
                            <MenuItem value="En tratamiento">En tratamiento</MenuItem>
                            <MenuItem value="Enfermo">Enfermo</MenuItem>
                            <MenuItem value="Crónico">Crónico</MenuItem>
                            <MenuItem value="Discapacitado">Discapacitado</MenuItem>
                        </Select>
                    </FormControl>
                </Stack>

                <Divider sx={{ my: 3 }} />

                <Stack direction="row" spacing={2} justifyContent="flex-end">
                    <Button variant="outlined" color="secondary" onClick={generarPDF}>
                        Exportar PDF
                    </Button>
                    <Button onClick={onClose} variant="outlined" color="error" disabled={loading}>
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={loading}
                        startIcon={loading ? <CircularProgress size={20} /> : null}
                    >
                        {loading ? (mascota ? "Actualizando..." : "Guardando...") : (mascota ? "Actualizar" : "Guardar")}
                    </Button>
                </Stack>
            </Box>
        </Modal>
    );
}
