function updateDuenoEmail(nombre) {
    return `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Actualización Exitosa</title>
      </head>
      <body>
        <h1>Información Actualizada</h1>
        <p>Hola ${nombre},</p>
        <p>Tu información ha sido actualizada correctamente en nuestro sistema .</p>
        <p>Si no realizaste esta acción, por favor contáctanos.</p>
        <p>Saludos,</p>
        <p>Equipo de Veterinaria</p>
      </body>
      </html>
    `;
  }
  module.exports = { updateDuenoEmail };
  