const express = require("express")
const router = express.Router();

const controller = require("../../services/citaServices/citaService")

router.post('/', controller.create);
router.get('/', controller.getAll);
router.get('/:_id', controller.getById);
router.put('/:_id', controller.update);
router.delete('/:_id', controller.delete);

module.exports = router;