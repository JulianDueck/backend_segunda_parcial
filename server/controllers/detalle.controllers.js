const { Detalle } = require('./../models/detalle.model');
const { Cabecera } = require('../models/cabecera.model');
const { Producto } = require('../models/producto.model');

// GET /api/detalle
const findAll = (req, res) => {
    Detalle.findAll({include: [
            {
                model: Producto,
                attributes: ['nombre', 'precio']
            },
            {
                model: Cabecera,
                attributes: ['total']
            }
        ]})
        .then(data => {
            res.send(data);
        })
        .catch(error => {
            res.status(500).send({
                message:
                    error.message || "Ha ocurrido un error al recuperar los detalles."
            });
        });
};

// GET /api/detalle/:cabecera_id
const findByCabeceraId = (req, res) => {
    const { id_cabecera } = req.params;
    Detalle.findAll(
            {   where: { id_cabecera: id_cabecera },
                include: [
                    {
                        model: Producto,
                        attributes: ['nombre', 'precio']
                    },
                    {
                        model: Cabecera,
                        attributes: ['total']
                    }
                ]
            })
        .then(detalles => {
            if (!detalles) {
                res.status(200).json({find: false});
            } else {
                res.status(200).json({find: true, detalles});
            }
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ error: 'Error al obtener los detalles' });
        });
};

// POST /api/detalle
const create = (req, res) => {
    const detalle = {
        cantidad: req.body.cantidad,
        id_cabecera: req.body.id_cabecera,
        id_producto: req.body.id_producto
    }
    Detalle.create(detalle)
        .then(async data => {
            const producto = await Producto.findByPk(detalle.id_producto)
            const cabecera = await Cabecera.findByPk(detalle.id_cabecera);
            const total = cabecera.total + detalle.cantidad * producto.precio
            Cabecera.update(
                { total: total },
                { where: { id: detalle.id_cabecera } }
            );
            res.send(data);
        })
        .catch(error => {
            res.status(500).send({
                message:
                    error.message || "Ha ocurrido un error al crear el detalle."
            });
        })
            
    .catch(error => {
        console.error(`Error al actualizar la cabecera con id ${detalle.id_cabecera}:`, error);
        res.status(500).json({ error: `Error al actualizar la cabecera con id ${detalle.id_cabecera}.` });
    });
    
};

module.exports = {
    findAll,
    findByCabeceraId,
    create
};