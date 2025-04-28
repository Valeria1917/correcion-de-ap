function deleteDuenoEmail(nombre) {
    return `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Cuenta Eliminada</title>
      </head>
      <body>
        <h1>Cuenta Eliminada</h1>
        <p>Hola ${nombre},</p>
        <p>Lamentamos informarte que tu cuenta ha sido eliminada del sistema.</p>
        <p>Si tienes alguna pregunta, por favor contáctanos.</p>
        <p>Saludos,</p>
        <p>Equipo de Veterinaria</p>
      </body>
      </html>
    `;
  }
  module.exports = { deleteDuenoEmail };
  