const citaConfirmacionEmail = (nombreDueño, nombreMascota, fechaCita, motivo) => {
    return `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Confirmación de Cita</title>
        <style>
          body { font-family: Arial, sans-serif; }
          .container { padding: 20px; border: 1px solid #ccc; border-radius: 8px; }
          h1 { color: #007bff; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Confirmación de Cita Veterinaria</h1>
          <p>Hola <strong>${nombreDueño}</strong>,</p>
          <p>Se ha programado una cita para tu mascota <strong>${nombreMascota}</strong>.</p>
          <p><strong>Fecha y Hora:</strong> ${new Date(fechaCita).toLocaleString("es-ES")}</p>
          <p><strong>Motivo:</strong> ${motivo}</p>
          <p>Si tienes alguna pregunta o deseas reprogramar tu cita, por favor contáctanos.</p>
          <p>¡Gracias por confiar en nosotros!</p>
        </div>
      </body>
      </html>
    `;
  };
  
  module.exports = { citaConfirmacionEmail };
  