const nodemailer = require("nodemailer");

const USER_GMAIL = process.env.USER_GMAIL;
const PASS_APP_GMAIL = process.env.PASS_APP_GMAIL;

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: USER_GMAIL,
        pass: PASS_APP_GMAIL,
    },
});

const enviarCorreo = async (correo, asunto, mensaje) => {
    const mailOptions = {
        from: `Control de Vacunación <${USER_GMAIL}>`,
        to: correo,
        subject: asunto,
        html: mensaje,
    };

    try {
        const response = await transporter.sendMail(mailOptions);
        return response
    } catch (error) {
        return res.json({
            ok: false,
            msg: "Error al enviar el correo",
            error: error.message,
        });
    }
};

module.exports = {enviarCorreo};