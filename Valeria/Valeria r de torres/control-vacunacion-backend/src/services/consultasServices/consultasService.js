const Mascota = require("../../models/Mascota")
const Cita = require("../../models/Cita")

const consultaService = {

    buscarMascotasPorDueno: async (req, res) => {
        try {
            const mascotas = await Mascota.find({ NombreDueno: req.params.NombreDueno });
            return res.status(200).json(mascotas)
        } catch (error) {
            return res.status(500).json({
                error: "Error ",
                details: error.message
            });
        }
    },

    obtenerProximasVacunas: async (req, res) => {
        try {
            const hoy = new Date();
            const limiteFecha = new Date();
            limiteFecha.setDate(hoy.getDate() + req.params.dias);

            const mascotas = await Mascota.find({
                "vacunas.proximaAplicacion": {
                    $gte: hoy,
                    $lte: limiteFecha,
                }
            });
            return res.status(200).json(mascotas)
        } catch (error) {
            return res.status(500).json({ error: "Error ", details: error.message });
        }
    },

    buscarCitasPorEstado: async (req, res) => {
        try {
            const citas = await Cita.find({ estado: req.params.estado });
            return res.status(200).json(citas)
        } catch (error) {
            return res.status(500).json({ error: "Error ", details: error.message });
        }
    },

    obtenerHistorialVacunacion: async (req, res) => {
        try {
            const mascota = await Mascota.findOne({
                nombre: nombreMascota,
                NombreDueño: req.params.nombreDueño
            });

            if (!mascota) {
                return res.status(404).json({ error: "Mascota no encontrada" })
            }
            return res.status(200).json(mascota);
        } catch (error) {
            return res.status(500).json({ error: "Error ", details: error.message });
        }
    },

    obtenerCitasPorRangoFechas: async (req, res) => {
        try {
            const citas = await Cita.find({
                fechaCita: {
                    $gte: new Date(req.params.fechaInicio),
                    $lte: new Date(req.params.fechaFin),
                },
            });
            return res.status(200).json(citas)
        } catch (error) {
            return res.status(500).json({ error: "Error ", details: error.message });
        }
    },

    obtenerEstadosUnicos: async (req, res) => {
        try {
            const estados = await Cita.distinct("estado");
            return res.status(200).json(estados);
        } catch (error) {
            return res.status(500).json({ error: "Error ", details: error.message });
        }
    },

    obtenerReporteVacunacionSemanal: async (req, res) => {
        const fechaInicio = new Date();
        fechaInicio.setDate(fechaInicio.getDate() - 7);

        try {
            const reporte = await Mascota.aggregate([
                {
                    $match: {
                        'vacunas.fechaAplicacion': { $gte: fechaInicio },
                        'EmailDueno': req.body.duenoId
                    }
                },
                { $unwind: '$vacunas' },
                { $match: { 'vacunas.fechaAplicacion': { $gte: fechaInicio } } },
                {
                    $lookup: {
                        from: "duenos",
                        localField: "EmailDueno",
                        foreignField: "Email",
                        as: "duenoInfo"
                    }
                },
                { $unwind: "$duenoInfo" },
                {
                    $group: {
                        _id: {
                            mascotaId: "$_id",
                            mascotaNombre: "$nombre"
                        },
                        dueno: { $first: "$duenoInfo" },
                        mascota: {
                            $first: {
                                nombre: "$nombre",
                                edad: "$edad",
                                especie: "$especie",
                                raza: "$raza"
                            }
                        },
                        vacunas: { $push: "$vacunas" }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        dueno: {
                            nombre: "$dueno.Nombre",
                            email: "$dueno.Email",
                            direccion: "$dueno.direccion"
                        },
                        mascota: {
                            nombre: "$mascota.nombre",
                            edad: "$mascota.edad",
                            especie: "$mascota.especie",
                            raza: "$mascota.raza"
                        },
                        vacunas: 1
                    }
                }
            ]);
            return res.status(200).json(reporte);
        } catch (error) {
            console.error("Error al generar reporte semanal:", error);
            return res.status(500).json({
                error: "Error interno al generar el reporte",
                details: error.message
            });
        }
    },

    obtenerReporteVacunacionMensual: async (req, res) => {
        try {
            if (!req.body.duenoId) {
                return res.status(400).json({ error: "Se requiere el ID del dueño" });
            }

            const fechaInicio = new Date();
            fechaInicio.setMonth(fechaInicio.getMonth() - 1);

            const reporte = await Mascota.aggregate([
                {
                    $match: {
                        'vacunas.fechaAplicacion': { $gte: fechaInicio },
                        'EmailDueno': req.body.duenoId
                    }
                },
                { $unwind: '$vacunas' },
                { $match: { 'vacunas.fechaAplicacion': { $gte: fechaInicio } } },
                {
                    $lookup: {
                        from: "duenos",
                        localField: "EmailDueno",
                        foreignField: "Email",
                        as: "duenoInfo"
                    }
                },
                { $unwind: "$duenoInfo" },
                {
                    $group: {
                        _id: {
                            mascotaId: "$_id",
                            mascotaNombre: "$nombre"
                        },
                        dueno: { $first: "$duenoInfo" },
                        mascota: {
                            $first: {
                                nombre: "$nombre",
                                edad: "$edad",
                                especie: "$especie",
                                raza: "$raza"
                            }
                        },
                        vacunas: { $push: "$vacunas" }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        dueno: {
                            nombre: "$dueno.Nombre",
                            email: "$dueno.Email",
                            direccion: "$dueno.direccion"
                        },
                        mascota: {
                            nombre: "$mascota.nombre",
                            edad: "$mascota.edad",
                            especie: "$mascota.especie",
                            raza: "$mascota.raza"
                        },
                        vacunas: 1
                    }
                }
            ]);

            return res.status(200).json(reporte);
        } catch (error) {
            console.error("Error al generar reporte mensual:", error);
            return res.status(500).json({
                error: "Error interno al generar el reporte",
                details: error.message
            });
        }
    },

    obtenerReporteVacunacionTrimestral: async (req, res) => {
        const fechaInicio = new Date();
        fechaInicio.setMonth(fechaInicio.getMonth() - 3);

        try {
            const reporte = await Mascota.aggregate([
                {
                    $match: {
                        'vacunas.fechaAplicacion': { $gte: fechaInicio },
                        'EmailDueno': req.body.duenoId
                    }
                },
                { $unwind: '$vacunas' },
                { $match: { 'vacunas.fechaAplicacion': { $gte: fechaInicio } } },
                {
                    $lookup: {
                        from: "duenos",
                        localField: "EmailDueno",
                        foreignField: "Email",
                        as: "duenoInfo"
                    }
                },
                { $unwind: "$duenoInfo" },
                {
                    $group: {
                        _id: {
                            mascotaId: "$_id",
                            mascotaNombre: "$nombre"
                        },
                        dueno: { $first: "$duenoInfo" },
                        mascota: {
                            $first: {
                                nombre: "$nombre",
                                edad: "$edad",
                                especie: "$especie",
                                raza: "$raza"
                            }
                        },
                        vacunas: { $push: "$vacunas" }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        dueno: {
                            nombre: "$dueno.Nombre",
                            email: "$dueno.Email",
                            direccion: "$dueno.direccion"
                        },
                        mascota: {
                            nombre: "$mascota.nombre",
                            edad: "$mascota.edad",
                            especie: "$mascota.especie",
                            raza: "$mascota.raza"
                        },
                        vacunas: 1
                    }
                }
            ]);
            return res.status(200).json(reporte);
        } catch (error) {
            console.error("Error al generar reporte trimestral:", error);
            return res.status(500).json({
                error: "Error interno al generar el reporte",
                details: error.message
            });
        }
    }

};

module.exports = consultaService;
