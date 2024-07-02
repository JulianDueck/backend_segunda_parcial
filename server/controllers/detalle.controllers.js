const { Detalle } = require('./../models/detalle.model');
const { Producto } = require('./../models/producto.model');

// GET /api/detalle
const findAll = (req, res) => {
    Detalle.findAll({include: [Producto]})
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

// GET /api/detalle/:id_cabecera
const findByCabeceraId = (req, res) => {
    const { id_cabecera } = req.params;
    Detalle.findAll({
        where: { id_cabecera }, include: [Producto]
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
    };

    Detalle.create(detalle)
    .then(data => {
        res.send(data);
    })
    .catch(error => {
        res.status(500).send({
            message:
                error.message || "Ha ocurrido un error al crear el detalle."
        });
    });
    
};

module.exports = {
    findAll,
    findByCabeceraId,
    create
};