function createDuenoEmail(nombre) {
    return `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Registro Exitoso</title>
      </head>
      <body>
        <h1>¡Registro Exitoso!</h1>
        <p>Hola ${nombre},</p>
        <p>Te damos la bienvenida a nuestro sistema de vacunación de mascotas.</p>
        <p>Tu información ha sido registrada correctamente.</p>
        <p>Si tienes alguna consulta, contáctanos.</p>
        <p>Saludos,</p>
        <p>Equipo de Veterinaria</p>
      </body>
      </html>
    `;
  }
  module.exports = { createDuenoEmail };
  