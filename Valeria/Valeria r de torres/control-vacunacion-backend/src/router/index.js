const express = require("express");
const router = express.Router();
let cors = require("cors");
const bodyparser = require("body-parser");
router.use(express.json());
router.use(cors());
router.use(bodyparser.json());
router.use(bodyparser.urlencoded({ extended: true }));

const citaRoutes = require("./routes/citaRoutes")
const duenoRoutes = require("./routes/duenoRoutes")
const mascotaRoutes = require("./routes/mascotaRoutes")
const consultasRoutes = require("./routes/consultasRoutes")

router.use("/cita", citaRoutes)
router.use("/dueno", duenoRoutes)
router.use("/mascota", mascotaRoutes)
router.use("/consultas", consultasRoutes)

module.exports = router;