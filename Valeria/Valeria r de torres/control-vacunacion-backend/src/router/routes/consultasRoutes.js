const express = require("express")
const router = express.Router();

const controller = require("../../services/consultasServices/consultasService")

// @GET
router.get('/:NombreDueno', controller.buscarMascotasPorDueno);
router.get('/proximas-vacunas/:dias', controller.obtenerProximasVacunas);
router.get('/citas/estado/:estado', controller.buscarCitasPorEstado);
router.get('/historial-vacunacion/:nombreDueno', controller.obtenerHistorialVacunacion);
router.get('/citas/rango-fechas/:fechaInicio/:fechaFin', controller.obtenerCitasPorRangoFechas);
router.get('/estados', controller.obtenerEstadosUnicos)

// @POST
router.post("/reporte/vacunacion/semanal", controller.obtenerReporteVacunacionSemanal);
router.post("/reporte/vacunacion/mensual", controller.obtenerReporteVacunacionMensual);
router.post("/reporte/vacunacion/trimestral", controller.obtenerReporteVacunacionTrimestral);

module.exports = router;