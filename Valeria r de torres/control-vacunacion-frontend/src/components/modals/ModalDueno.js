import React, { useState, useEffect } from "react";
import {
    Modal, Box, Typography, TextField, Button, Alert, CircularProgress
} from "@mui/material";
import axios from "axios";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '90%', sm: '80%', md: '600px' },
    bgcolor: '#e0f7fa',
    borderRadius: '16px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
    p: 4,
    maxHeight: '90vh',
    overflowY: 'auto',
    border: '4px dashed #90caf9',
};

export default function ModalDueño({ open, onClose, onSave }) {
    const [form, setForm] = useState({ Nombre: "", Email: "", direccion: "" });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [editMode, setEditMode] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [owners, setOwners] = useState([]);

    useEffect(() => {
        if (open) {
            fetchOwners();
            if (onSave?.Nombre) {
                setForm({
                    Nombre: onSave.Nombre || "",
                    Email: onSave.Email || "",
                    direccion: onSave.direccion || ""
                });
                setEditMode(true);
                setCurrentId(onSave._id);
            } else {
                resetForm();
            }
        }
    }, [open, onSave]);

    const fetchOwners = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/dueno`);
            setOwners(response.data);
        } catch (error) {
            console.error("Error al obtener dueños:", error);
        }
    };

    const resetForm = () => {
        setForm({ Nombre: "", Email: "", direccion: "" });
        setErrors({});
        setEditMode(false);
        setCurrentId(null);
        setSuccessMessage("");
    };

    const validateForm = () => {
        const newErrors = {};
        if (!form.Nombre.trim()) newErrors.Nombre = "😅 ¡Nombre es requerido!";
        if (!form.Email.trim()) {
            newErrors.Email = "📧 ¡Email es requerido!";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.Email)) {
            newErrors.Email = "⚠️ Email no válido";
        }
        if (!form.direccion.trim()) newErrors.direccion = "📍 ¡Dirección es requerida!";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setIsLoading(true);
        setSuccessMessage("");

        try {
            // 🚨 Validar duplicados por Nombre o Email
            const duplicate = owners.find(owner =>
                (owner.Nombre.trim().toLowerCase() === form.Nombre.trim().toLowerCase() ||
                 owner.Email.trim().toLowerCase() === form.Email.trim().toLowerCase()) &&
                owner._id !== currentId
            );

            if (duplicate) {
                setErrors({ submit: "⚠️ Ya existe un dueño registrado con ese nombre o correo electrónico." });
                setIsLoading(false);
                return;
            }

            const payload = { ...form, Email: form.Email.trim() };

            let response;
            if (editMode) {
                response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/dueno/${currentId}`, payload);
            } else {
                response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/dueno`, payload);
            }

            setSuccessMessage(editMode ? "🎉 Dueño actualizado por la veterinaria Vale" : "🎊 Dueño creado con éxito");

            setTimeout(() => {
                onClose(true);
                resetForm();
            }, 1500);
        } catch (error) {
            console.error("Error al guardar dueño:", error);
            setErrors({
                submit: error.response?.data?.error || "❌ Error al procesar la solicitud"
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        onClose(false);
        resetForm();
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={style}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                    <img
                        src="https://img.freepik.com/vector-premium/mujer-joven-abrazando-perro-pug-ilustraciones-vectoriales-amor-fondo-blanco_1062857-384.jpg"
                        alt="Dueño y mascota"
                        style={{
                            width: '120px',
                            height: 'auto',
                            borderRadius: '12px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                        }}
                    />
                </Box>

                <Typography
                    variant="h5"
                    component="h2"
                    sx={{
                        mb: 3,
                        fontWeight: 'bold',
                        textAlign: 'center',
                        color: '#00796b'
                    }}
                >
                    {editMode ? "✏️ Editar Dueño" : "🆕 Agregar Nuevo Dueño"}
                </Typography>

                {/* Mensajes de éxito o error */}
                {successMessage && (
                    <Alert severity="success" sx={{ mb: 3 }}>{successMessage}</Alert>
                )}
                {errors.submit && (
                    <Alert severity="error" sx={{ mb: 3 }}>{errors.submit}</Alert>
                )}

                {/* Formulario de datos */}
                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <TextField
                        fullWidth
                        margin="normal"
                        label="👤 Nombre del Dueño"
                        name="Nombre"
                        value={form.Nombre}
                        onChange={handleChange}
                        error={!!errors.Nombre}
                        helperText={errors.Nombre}
                        disabled={isLoading}
                    />

                    <TextField
                        fullWidth
                        margin="normal"
                        label="📧 Email"
                        name="Email"
                        type="email"
                        value={form.Email}
                        onChange={handleChange}
                        error={!!errors.Email}
                        helperText={errors.Email}
                        disabled={isLoading}
                    />

                    <TextField
                        fullWidth
                        margin="normal"
                        label="🏠 Dirección"
                        name="direccion"
                        value={form.direccion}
                        onChange={handleChange}
                        error={!!errors.direccion}
                        helperText={errors.direccion}
                        disabled={isLoading}
                    />

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 2 }}>
                        <Button
                            onClick={handleClose}
                            variant="outlined"
                            color="secondary"
                            disabled={isLoading}
                        >
                            ❌ Cancelar
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={isLoading}
                            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
                        >
                            {isLoading
                                ? (editMode ? "⏳ Actualizando..." : "⏳ Guardando...")
                                : (editMode ? "💾 Actualizar" : "✅ Guardar")}
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Modal>
    );
}
