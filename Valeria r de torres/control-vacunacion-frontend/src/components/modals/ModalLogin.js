import React, { useState } from "react";
import {
    Modal, Box, Typography, TextField, Button, Alert, CircularProgress
} from "@mui/material";
import axios from "axios";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '90%', sm: '80%', md: '450px' },
    bgcolor: '#e0f7fa',
    borderRadius: '16px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
    p: 4,
    maxHeight: '90vh',
    overflowY: 'auto',
    border: '4px dashed #90caf9',
};

export default function ModalLogin({ open, onClose, onLoginSuccess, setShowLoginButton }) {
    const [form, setForm] = useState({ Email: "", contrasenna: "" });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const validateForm = () => {
        const newErrors = {};
        if (!form.Email.trim()) {
            newErrors.Email = "📧 ¡Email es requerido!";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.Email)) {
            newErrors.Email = "⚠️ Email no válido";
        }
        if (!form.contrasenna.trim()) newErrors.contrasenna = "🔒 ¡Contraseña es requerida!";

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
        setErrorMessage("");

        try {
            // Enviamos las credenciales al endpoint de login
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/dueno/login`, {
                Email: form.Email.trim(),
                contrasenna: form.contrasenna // La contraseña será hasheada en el backend
            });

            // Si llegamos aquí, el login fue exitoso
            if (response.data) {
                // Almacenamos el token o datos de usuario en localStorage
                localStorage.setItem('userToken', response.data.token);
                localStorage.setItem('userData', JSON.stringify(response.data.user));
                
                // Informamos al componente padre del éxito
                onLoginSuccess(response.data);
                
                // Esconder el botón de login en la navbar
                setShowLoginButton(false);
                
                // Cerramos el modal
                setTimeout(() => {
                    resetForm();
                    onClose(true);
                }, 1000);
            }
        } catch (error) {
            console.error("Error al iniciar sesión:", error);
            // Mensaje genérico para cualquier error de credenciales
            setErrorMessage("❌ Email o contraseña incorrectos");
        } finally {
            setIsLoading(false);
        }
    };

    const resetForm = () => {   
        setForm({ Email: "", contrasenna: "" });
        setErrors({});
        setErrorMessage("");
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
                        src="https://img.freepik.com/vector-premium/lindo-logo-gato-morado_1030945-15.jpg?w=2000"
                        alt="Logo Veterinaria"
                        style={{
                            width: '100px',
                            height: 'auto',
                            borderRadius: '50%',
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
                    🔐 Iniciar Sesión
                </Typography>

                {errorMessage && (
                    <Alert severity="error" sx={{ mb: 3 }}>{errorMessage}</Alert>
                )}

                <Box component="form" onSubmit={handleSubmit} noValidate>
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
                        label="🔒 Contraseña"
                        name="contrasenna"
                        type="password"
                        value={form.contrasenna}
                        onChange={handleChange}
                        error={!!errors.contrasenna}
                        helperText={errors.contrasenna}
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
                            {isLoading ? "⏳ Verificando..." : "✅ Ingresar"}
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Modal>
    );
}