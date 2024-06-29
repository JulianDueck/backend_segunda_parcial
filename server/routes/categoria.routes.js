const express = require('express');
const router = express.Router();
const categoria_controller = require('./../controllers/categoria.controllers')

// Rutas
router.get('/', categoria_controller.findAll);
router.get('/:id', categoria_controller.findById);
router.post('/', categoria_controller.create);
router.put('/:id', categoria_controller.update);
router.delete('/:id', categoria_controller.delete);

module.exports = router;