const express = require('express');
const router = express.Router();
const detalle_controller = require('./../controllers/detalle.controllers');

router.get('/', detalle_controller.findAll);
router.get('/:id_cabecera', detalle_controller.findByCabeceraId);
router.post('/', detalle_controller.create);

module.exports = router;