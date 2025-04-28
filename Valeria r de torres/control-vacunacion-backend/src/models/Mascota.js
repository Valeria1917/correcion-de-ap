const { Schema, model } = require("mongoose")

const mascotaSchema = new Schema({
    NombreDueno: {type: String, required: true},
    EmailDueno: {type: String, required: true},
    nombre: {type: String, required: true},
    especie: {type: String, required: true},
    raza: {type: String, required: true},
    edad: {type: Number, required: true},
    estadoSalud: {type: String, required: true},
    vacunas: [
        {
            nombreVacuna: {type: String, required: true},
            fechaAplicacion: {type: Date, required: true},
            vacunaUnica: {type: Boolean, required: true},
            proximaAplicacion: {type: Date, required: false}
        }
    ]
}, {versionKey: false})

const Mascota = model("mascota", mascotaSchema)
module.exports = Mascota;


