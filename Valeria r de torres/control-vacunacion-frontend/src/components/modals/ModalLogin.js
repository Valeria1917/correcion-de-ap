import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Link as MuiLink
} from "@mui/material";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ModalLogin({ open, onClose, onLoginSuccess, setShowLoginButton }) {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (error) setError(null);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!form.email || !form.password) {
      setError("Por favor complete todos los campos");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Llamamos al endpoint de login
      const response = await axios.post(`${API_URL}/dueno/login`, {
        Email: form.email,
        contrasenna: form.password
      });
      
      console.log("Full login response:", response.data);
      
      // Verificamos que la respuesta tenga la estructura correcta
      if (response.data && response.data.data) {
        // Guardar token (o un valor temporal si no existe)
        // Aquí asumimos que no hay token en la respuesta actual,
        // pero podemos usar un identificador único como el email
        const tokenValue = response.data.data.Email || "authenticated";
        localStorage.setItem('userToken', tokenValue);
        
        // Guardar datos del usuario
        localStorage.setItem('userData', JSON.stringify(response.data.data));
        
        // Notificar al componente padre del éxito
        onLoginSuccess(response.data);
        
        // Cerrar el modal
        setTimeout(() => {
          onClose();
        }, 500);
      } else {
        throw new Error("Formato de respuesta inválido");
      }
      
    } catch (error) {
      console.error("Error en inicio de sesión:", error);
      setError(
        error.response?.data?.message || 
        error.message ||
        "Error al iniciar sesión. Verifica tus credenciales."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setForm({ email: "", password: "" });
    setError(null);
    onClose();
  };

  return (
    <Modal open={open} onClose={handleCloseModal}>
      <Box
        sx={{
          width: { xs: '90%', sm: '400px' },
          bgcolor: '#faf0fa',
          borderRadius: 4,
          boxShadow: '0 8px 32px rgba(156, 39, 176, 0.3)',
          p: 4,
          mx: 'auto',
          my: '10%',
          border: '2px solid #e1bee7',
          textAlign: 'center'
        }}
        component="form"
        onSubmit={handleLogin}
      >
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', color: '#6a1b9a', fontFamily: '"Comic Sans MS", cursive' }}>
          🔐 Iniciar Sesión
        </Typography>
        
        {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}
        
        <TextField
          name="email"
          label="Correo Electrónico"
          type="email"
          value={form.email}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
          sx={{ 
            mb: 2,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              bgcolor: 'white'
            }
          }}
        />
        
        <TextField
          name="password"
          label="Contraseña"
          type={showPassword ? "text" : "password"}
          value={form.password}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
          sx={{ 
            mb: 1,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              bgcolor: 'white'
            }
          }}
        />
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
          <MuiLink
            component="button"
            type="button"
            variant="body2"
            onClick={() => setShowPassword(!showPassword)}
            sx={{ color: '#9c27b0', textDecoration: 'none' }}
          >
            {showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
          </MuiLink>
        </Box>
        
        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
          sx={{
            mt: 2,
            py: 1.5,
            borderRadius: 3,
            backgroundColor: '#9c27b0',
            color: 'white',
            fontWeight: 'bold',
            '&:hover': {
              backgroundColor: '#7b1fa2',
            }
          }}
        >
          {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
        </Button>
        
        <Typography variant="body2" sx={{ mt: 3, color: '#673ab7' }}>
          ¿No tienes una cuenta? Puedes registrarte como dueño de mascota.
        </Typography>
      </Box>
    </Modal>
  );
}