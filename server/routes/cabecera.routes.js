const express = require('express');
const router = express.Router();
const cabecera_controller = require('./../controllers/cabecera.controllers');

router.get('/', cabecera_controller.findAll);
router.get('/:id', cabecera_controller.findById);
router.get('/mesa/:id', cabecera_controller.getCabeceraByMesa);
router.post('/', cabecera_controller.create);
router.put('/:id', cabecera_controller.update);
router.put('/cerrar/:id', cabecera_controller.cerrar);

module.exports = router;