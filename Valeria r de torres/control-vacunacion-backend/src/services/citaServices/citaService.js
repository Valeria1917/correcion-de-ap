const Cita = require("../../models/Cita");
const { enviarCorreo } = require("../../services/mailServices/mailService");
const { citaConfirmacionEmail } = require("../../emails/citasEmail/citaConfirmacionEmail");
const { citaRecordatorioEmail } = require("../../emails/citasEmail/citaRecordatorioEmail");

const controller = {
  create: async (req, res) => {
    try {
      const { NombreDueno, EmailDueno, nombreMascota, fechaCita, motivo, estado } = req.body;

      if (!NombreDueno || !EmailDueno || !nombreMascota || !fechaCita || !motivo || !estado) {
        return res.status(400).json({ error: "Todos los campos son obligatorios." });
      }

      const fechaActual = new Date();
      if (new Date(fechaCita) <= fechaActual) {
        return res.status(400).json({ error: "La fecha de la cita debe ser futura." });
      }

      const nuevaCita = new Cita(req.body);
      await nuevaCita.save();

      await enviarCorreo(EmailDueno, "Confirmación de Cita Veterinaria", citaConfirmacionEmail(NombreDueno, nombreMascota, fechaCita, motivo));

      return res.status(201).json({ message: "Cita creada con éxito.", data: nuevaCita });
    } catch (error) {
      return res.status(500).json({ error: "Error al crear cita.", details: error.message });
    }
  },

  getAll: async (req, res) => {
    try {
      const citas = await Cita.find();
      return res.status(200).json(citas);
    } catch (error) {
      return res.status(500).json({ error: "Error al obtener citas.", details: error.message });
    }
  },

  getById: async (req, res) => {
    try {
      const cita = await Cita.findById(req.params.id);
      if (!cita) {
        return res.status(404).json({ error: "Cita no encontrada." });
      }
      return res.status(200).json(cita);
    } catch (error) {
      return res.status(500).json({ error: "Error al obtener la cita.", details: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const { _id } = req.params;
      const citaActualizada = await Cita.findByIdAndUpdate(_id, req.body, { new: true });

      if (!citaActualizada) {
        return res.status(404).json({ error: "Cita no encontrada." });
      }

      await enviarCorreo(citaActualizada.EmailDueno, "Actualización de Cita Veterinaria", citaConfirmacionEmail(
        citaActualizada.NombreDueno,
        citaActualizada.nombreMascota,
        citaActualizada.fechaCita,
        citaActualizada.motivo
      ));

      return res.status(200).json({ message: "Cita actualizada con éxito.", data: citaActualizada });
    } catch (error) {
      return res.status(500).json({ error: "Error al actualizar cita.", details: error.message });
    }
  },

  getByNombreDueno: async (req, res) => {
    try {
      const { nombreDueno } = req.params;
  
      if (!nombreDueno) {
        return res.status(400).json({ error: "Nombre del dueño es obligatorio." });
      }
  
      const citas = await Cita.find({ NombreDueno: { $regex: new RegExp(nombreDueno, 'i') } });
  
      return res.status(200).json(citas);
    } catch (error) {
      return res.status(500).json({ error: "Error al obtener citas por nombre del dueño.", details: error.message });
    }
  },


  delete: async (req, res) => {
    try {
      const citaEliminada = await Cita.findByIdAndDelete(req.params._id);
      if (!citaEliminada) {
        return res.status(404).json({ error: "Cita no encontrada." });
      }
      return res.status(200).json({ message: "Cita eliminada con éxito." });
    } catch (error) {
      return res.status(500).json({ error: "Error al eliminar cita.", details: error.message });
    }
  }
};

module.exports = controller;
