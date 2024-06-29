const { Detalle } = require('./../models/detalle.model');

// GET /api/detalle
const findAll = (req, res) => {
    Detalle.findAll()
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
    const { cabecera_id } = req.params;
    Detalle.findAll({
        where: { cabecera_id: cabecera_id }
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
        cabecera_id: req.body.cabecera_id
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