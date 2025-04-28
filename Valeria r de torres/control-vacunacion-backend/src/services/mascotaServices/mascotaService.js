const Mascota = require("../../models/Mascota");
const { enviarCorreo } = require("../../services/mailServices/mailService");

const controller = {
  create: async (req, res) => {
    try {
      const { NombreDueno, EmailDueno, nombre, especie, raza, edad, estadoSalud, vacunas } = req.body;

      console.log(req.body)

      if (!NombreDueno || !EmailDueno || !nombre || !especie || !raza || !edad || !estadoSalud) {
        return res.status(400).json({ error: "Todos los campos son obligatorios." });
      }

      if (edad <= 0) return res.status(400).json({ error: "La edad debe ser mayor a 0." });

      if (vacunas && vacunas.length > 0) {
        for (const vacuna of vacunas) {
          if (!vacuna.nombreVacuna || !vacuna.fechaAplicacion || typeof vacuna.vacunaUnica !== "boolean") {
            return res.status(400).json({ error: "Datos de vacuna incompletos." });
          }
          if (vacuna.fechaAplicacion > new Date()) {
            return res.status(400).json({ error: "La fecha de aplicación no puede ser futura." });
          }
          if (!vacuna.vacunaUnica && (!vacuna.proximaAplicacion || vacuna.proximaAplicacion <= vacuna.fechaAplicacion)) {
            return res.status(400).json({ error: "La próxima aplicación debe ser posterior a la aplicación actual." });
          }
        }
      }

      const newMascota = new Mascota(req.body);
      await newMascota.save();

      res.status(201).json({ message: "Mascota registrada con éxito.", data: newMascota });
    } catch (error) {
      res.status(500).json({ error: "Error al registrar mascota.", details: error.message });
    }
  },

  getAll: async (req, res) => {
    try {
      const mascotas = await Mascota.find();
      res.status(200).json(mascotas);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener mascotas.", details: error.message });
    }
  },

  getVacunasByMascotaId: async (req, res) => {
    try {
      const { mascotaId } = req.params;

      const mascota = await Mascota.findById(mascotaId);

      if (!mascota) {
        return res.status(404).json({ error: "Mascota no encontrada." });
      }

      return res.status(200).json(mascota.vacunas || []);
    } catch (error) {
      return res.status(500).json({ error: "Error al obtener vacunas.", details: error.message });
    }
  },

  getById: async (req, res) => {
    try {
      const mascota = await Mascota.findById(req.params._id);
      if (!mascota) {
        return res.status(404).json({ error: "Mascota no encontrada." });
      }
      res.status(200).json(mascota);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener mascota.", details: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const { _id } = req.params;
      const { NombreDueno, EmailDueno, nombre, especie, raza, edad, estadoSalud } = req.body;

      if (!NombreDueno || !EmailDueno || !nombre || !especie || !raza || !edad || !estadoSalud) {
        return res.status(400).json({ error: "Todos los campos son obligatorios." });
      }

      const mascotaActualizada = await Mascota.findByIdAndUpdate(_id, req.body, { new: true });
      if (!mascotaActualizada) {
        return res.status(404).json({ error: "Mascota no encontrada." });
      }

      res.status(200).json({ message: "Mascota actualizada con éxito.", data: mascotaActualizada });
    } catch (error) {
      res.status(500).json({ error: "Error al actualizar mascota.", details: error.message });
    }
  },

  delete: async (req, res) => {
    try {
      const mascota = await Mascota.findByIdAndDelete(req.params._id);
      if (!mascota) {
        return res.status(404).json({ error: "Mascota no encontrada." });
      }

      res.status(200).json({ message: "Mascota eliminada con éxito." });
    } catch (error) {
      res.status(500).json({ error: "Error al eliminar mascota.", details: error.message });
    }
  },
  addVacuna: async (req, res) => {
    try {
      const { id } = req.params;
      const { nombreVacuna, fechaAplicacion, vacunaUnica, proximaAplicacion } = req.body;

      if (!nombreVacuna || !fechaAplicacion || typeof vacunaUnica !== 'boolean') {
        return res.status(400).json({ error: "Datos de vacuna incompletos." });
      }

      if (new Date(fechaAplicacion) > new Date()) {
        return res.status(400).json({ error: "La fecha de aplicación no puede ser futura." });
      }

      if (!vacunaUnica && (!proximaAplicacion || new Date(proximaAplicacion) <= new Date(fechaAplicacion))) {
        return res.status(400).json({ error: "La próxima aplicación debe ser posterior a la aplicación actual." });
      }

      const nuevaVacuna = {
        nombreVacuna,
        fechaAplicacion: new Date(fechaAplicacion),
        vacunaUnica,
        proximaAplicacion: vacunaUnica ? null : new Date(proximaAplicacion)
      };

      const mascotaActualizada = await Mascota.findByIdAndUpdate(
        id,
        { $push: { vacunas: nuevaVacuna } },
        { new: true }
      );

      console.log(mascotaActualizada)

      if (!mascotaActualizada) {
        return res.status(404).json({ error: "Mascota no encontrada." });
      }

      await enviarCorreo( mascotaActualizada.EmailDueno,
        `Nueva vacuna registrada para ${mascotaActualizada.nombre}`,
        `Se ha registrado la vacuna ${nombreVacuna} aplicada el ${fechaAplicacion}`
      );

      return res.status(200).json({
        message: "Vacuna agregada con éxito.",
        data: mascotaActualizada
      });
    } catch (error) {
      console.log(error)
    }
  }
};

module.exports = controller;