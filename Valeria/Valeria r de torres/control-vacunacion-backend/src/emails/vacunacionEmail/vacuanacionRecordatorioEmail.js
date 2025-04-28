const vacunaRecordatorioEmail = (nombreDueño, nombreMascota, nombreVacuna, proximaAplicacion) => {
    return `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Recordatorio de Vacunación</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #ffffff;
            color: #000000;
            text-align: center;
            padding: 40px;
          }
          .container {
            max-width: 600px;
            margin: auto;
            border: 1px solid #000000;
            padding: 30px;
            border-radius: 10px;
          }
          h1 {
            color: #000000;
          }
          p {
            font-size: 16px;
          }
          .footer {
            margin-top: 30px;
            font-size: 12px;
            color: #555555;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Recordatorio de Vacunación</h1>
          <p>Hola <strong>${nombreDueño}</strong>,</p>
          <p>Te recordamos que tu mascota <strong>${nombreMascota}</strong> tiene una próxima vacuna programada.</p>
          <p><strong>Vacuna:</strong> ${nombreVacuna}</p>
          <p><strong>Fecha de Aplicación:</strong> ${new Date(proximaAplicacion).toLocaleDateString("es-ES")}</p>
          <p>Por favor, asegúrate de asistir a la veterinaria en la fecha indicada.</p>
          <p>Si tienes alguna duda o necesitas reprogramar la cita, no dudes en contactarnos.</p>
          <div class="footer">
            © 2025 Veterinaria PetCare. Todos los derechos reservados.
          </div>
        </div>
      </body>
      </html>
    `;
  };
  
  module.exports = { vacunaRecordatorioEmail };
  