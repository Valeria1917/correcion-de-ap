const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

// Esquema del dueño
const duenoSchema = new Schema({
    Nombre: { type: String, required: true },
    Email: { type: String, required: true, unique: true },
    direccion: { type: String, required: true },
    contrasenna: { type: String, required: true } // Se requiere para el login
}, { versionKey: false });

// Modelo
const Dueno = model("dueno", duenoSchema);
module.exports = Dueno;
