const express = require('express');
const router = express.Router();
const producto_controller = require('./../controllers/producto.controllers');

// Rutas
router.get('/', producto_controller.findAll);
router.get('/:id', producto_controller.findById);
router.post('/', producto_controller.create);
router.put('/:id', producto_controller.update);
router.delete('/:id', producto_controller.delete);

module.exports = router;
