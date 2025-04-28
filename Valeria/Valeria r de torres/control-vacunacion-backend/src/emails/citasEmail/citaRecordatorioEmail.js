const citaRecordatorioEmail = (nombreDueño, nombreMascota, fechaCita, motivo) => {
    return `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Recordatorio de Cita</title>
        <style>
          body { font-family: Arial, sans-serif; }
          .container { padding: 20px; border: 1px solid #ccc; border-radius: 8px; }
          h1 { color: #007bff; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Recordatorio de Cita Veterinaria</h1>
          <p>Hola <strong>${nombreDueño}</strong>,</p>
          <p>Te recordamos que tienes una cita programada para tu mascota <strong>${nombreMascota}</strong> el día:</p>
          <p><strong>${new Date(fechaCita).toLocaleString("es-ES")}</strong></p>
          <p><strong>Motivo:</strong> ${motivo}</p>
          <p>¡Te esperamos!</p>
        </div>
      </body>
      </html>
    `;
  };
  
  module.exports = { citaRecordatorioEmail };
  