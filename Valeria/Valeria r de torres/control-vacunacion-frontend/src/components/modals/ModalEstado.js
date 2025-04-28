import React, { useState } from "react";
import {
  Modal,
  Box,
  TextField,
  Button,
  Typography,
  Alert
} from "@mui/material";
import axios from "axios";

export default function ModalEstado({ open, onClose }) {
  const [estado, setEstado] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSave = async () => {
    if (!estado.trim()) {
      setError("El estado no puede estar vacío");
      return;
    }

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/estado`, {
        nombre: estado
      });
      setSuccess(true);
      setTimeout(() => onClose(true), 1000);
    } catch (err) {
      setError("Error al guardar el estado");
    }
  };

  const handleClose = () => {
    setEstado("");
    setError(null);
    setSuccess(false);
    onClose(false);
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          width: 400,
          bgcolor: "#FFF0FA",
          p: 4,
          borderRadius: 4,
          mx: "auto",
          my: "15%",
          boxShadow: 6
        }}
      >
        <Typography variant="h6" sx={{ mb: 2, color: "#C71585" }}>
          Agregar Nuevo Estado
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>¡Estado guardado! 🎉</Alert>}

        <TextField
          label="Nombre del Estado"
          value={estado}
          onChange={(e) => setEstado(e.target.value)}
          fullWidth
          sx={{ bgcolor: "#FFF", borderRadius: 2, mb: 2 }}
        />

        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <Button onClick={handleClose} color="error" variant="outlined">
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            sx={{
              backgroundColor: "#F78FB3",
              color: "#fff",
              "&:hover": { backgroundColor: "#FF69B4" },
            }}
          >
            Guardar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
