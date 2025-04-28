const Dueno = require("../../models/Dueno");
const { enviarCorreo } = require("../../services/mailServices/mailService");
const { createDuenoEmail } = require("../../emails/crudDuenoEmail/createDuenoEmail");
const { updateDuenoEmail } = require("../../emails/crudDuenoEmail/updateDuenoEmail");
const { deleteDuenoEmail } = require("../../emails/crudDuenoEmail/deleteDuenoEmail");
const crypto = require('crypto')

const controller = {
    create: async (req, res) => {
        try {
            const { Nombre, Email, direccion, contrasenna } = req.body;
    
            if (!Nombre || !Email || !direccion || !contrasenna) {
                return res.status(400).json({ error: "Todos los campos son obligatorios." });
            }
    
            const existingDueno = await Dueno.findOne({ Email });
            if (existingDueno) {
                return res.status(400).json({ error: "El correo ya está registrado." });
            }
    
            // Hashear la contraseña usando SHA-256
            const hashedPassword = crypto.createHash('sha256').update(contrasenna).digest('hex');
    
            const newDueno = new Dueno({ 
                Nombre, 
                Email, 
                direccion, 
                contrasenna: hashedPassword 
            });
    
            await newDueno.save();
            await enviarCorreo(Email, "Registro Exitoso - Veterinaria", createDuenoEmail(Nombre));
    
            res.status(201).json({ message: "Dueño registrado con éxito.", data: { Nombre, Email, direccion } });
        } catch (error) {
            res.status(500).json({ error: "Error al crear el dueño.", details: error.message });
        }
    },

    login: async (req, res) => {
        try {
            const { Email, contrasenna } = req.body;
    
            if (!Email || !contrasenna) {
                return res.status(400).json({ error: "Email y contraseña son obligatorios." });
            }
    
            const dueno = await Dueno.findOne({ Email });
            if (!dueno) {
                return res.status(404).json({ error: "Correo no registrado." });
            }
    
            // Hashear la contraseña recibida usando SHA-256
            const hashedPassword = crypto.createHash('sha256').update(contrasenna).digest('hex');
    
            // Comparar el hash de la contraseña ingresada con la almacenada en la base de datos
            if (hashedPassword !== dueno.contrasenna) {
                console.log(hashedPassword);
                console.log(dueno.contrasenna);
                return res.status(400).json({ error: "Contraseña incorrecta." });
            }
    
            res.status(200).json({ message: "Inicio de sesión exitoso.", data: { Nombre: dueno.Nombre, Email: dueno.Email, direccion: dueno.direccion } });
        } catch (error) {
            res.status(500).json({ error: "Error al iniciar sesión.", details: error.message });
        }
    },    

    getAll: async (req, res) => {
        try {
            const items = await Dueno.find().select("-contrasenna");
            res.status(200).json(items);
        } catch (error) {
            res.status(500).json({ error: "Error al obtener los dueños.", details: error.message });
        }
    },

    getById: async (req, res) => {
        try {
            const { id } = req.params;

            if (!id.match(/^[0-9a-fA-F]{24}$/)) {
                return res.status(400).json({ error: "ID inválido." });
            }

            const itemFounded = await Dueno.findById(id).select("-contrasenna");
            if (itemFounded) {
                res.status(200).json(itemFounded);
            } else {
                res.status(404).json({ error: "Dueño no encontrado." });
            }
        } catch (error) {
            res.status(500).json({ error: "Error al obtener el dueño.", details: error.message });
        }
    },

    update: async (req, res) => {
        try {
            const { _id } = req.params;
            const { Nombre, Email, direccion } = req.body;

            if (!Nombre || !Email || !direccion) {
                return res.status(400).json({ error: "Todos los campos son obligatorios." });
            }

            const itemUpdated = await Dueno.findByIdAndUpdate(_id, req.body, { new: true }).select("-contrasenna");
            if (itemUpdated) {
                await enviarCorreo(Email, "Actualización Exitosa - Veterinaria", updateDuenoEmail(Nombre));
                res.status(200).json({ message: "Dueño actualizado con éxito.", data: itemUpdated });
            } else {
                res.status(404).json({ error: "Dueño no encontrado." });
            }
        } catch (error) {
            res.status(500).json({ error: "Error al actualizar el dueño.", details: error.message });
        }
    },

    delete: async (req, res) => {
        try {
            const { _id } = req.params;
            const itemDeleted = await Dueno.findByIdAndDelete(_id);

            if (itemDeleted) {
                await enviarCorreo(itemDeleted.Email, "Cuenta Eliminada - Veterinaria", deleteDuenoEmail(itemDeleted.Nombre));
                res.status(200).json({ message: "Dueño eliminado con éxito.", data: itemDeleted });
            } else {
                res.status(404).json({ error: "Dueño no encontrado." });
            }
        } catch (error) {
            res.status(500).json({ error: "Error al eliminar el dueño.", details: error.message });
        }
    },
};

module.exports = controller;
