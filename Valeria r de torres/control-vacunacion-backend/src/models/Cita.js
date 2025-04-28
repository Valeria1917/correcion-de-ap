const { Schema, model } = require("mongoose");

const citaSchema = new Schema({
    NombreDueno: { type: String, required: true },
    EmailDueno: { type: String, required: true },
    nombreMascota: { type: String, required: true },
    fechaCita: { type: Date, required: true },
    motivo: { type: String, required: true },
    estado: { type: String, required: true },
}, { versionKey: false })

const cita = model("cita", citaSchema)
module.exports = cita;