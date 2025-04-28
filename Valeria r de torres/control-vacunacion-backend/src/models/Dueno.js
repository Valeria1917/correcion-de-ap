const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

// Esquema del dueño
const duenoSchema = new Schema({
    Nombre: { type: String, required: true },
    Email: { type: String, required: true, unique: true },
    direccion: { type: String, required: true },
    contraseña: { type: String } // Opcional: solo se requiere si se usa para login
}, { versionKey: false });

// Middleware: Hash de contraseña antes de guardar
duenoSchema.pre("save", async function (next) {
    if (!this.isModified("contraseña")) return next(); // Solo si la contraseña cambió
    try {
        const salt = await bcrypt.genSalt(10);
        this.contraseña = await bcrypt.hash(this.contraseña, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Middleware: Hash de contraseña en actualización
duenoSchema.pre("findOneAndUpdate", async function (next) {
    const update = this.getUpdate();

    // Asegura que no sea null/undefined
    if (update && update.contraseña) {
        try {
            const salt = await bcrypt.genSalt(10);
            update.contraseña = await bcrypt.hash(update.contraseña, salt);
            this.setUpdate(update);
        } catch (error) {
            return next(error);
        }
    }
    next();
});

// Método personalizado: Comparar contraseñas
duenoSchema.methods.compararContraseña = async function (contraseñaEntrada) {
    return await bcrypt.compare(contraseñaEntrada, this.contraseña);
};

// Modelo
const Dueno = model("dueno", duenoSchema);
module.exports = Dueno;
