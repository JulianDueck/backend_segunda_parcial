const { Cabecera } = require('../models/cabecera.model');
const { Cliente } = require('../models/cliente.model');
const { Mesa } = require('../models/mesa.model');

// GET /api/cabecera
const findAll = (req, res) => {
    Cabecera.findAll()
        .then(data => {
            res.send(data);
        })
        .catch(error => {
            res.status(500).send({
                message:
                    error.message || "Ha ocurrido un error al recuperar las cabeceras."
            });
        });
};

// GET /api/cabecera/:id
const findById = (req, res) => {
    const id = req.params.id;

    Cabecera.findByPk(id, { include: [Cliente, Mesa] })
        .then(cabecera => {
            if (!cabecera) {
                return res.status(404).json({ error: 'Cabecera no encontrada.' });
            }
            res.json(cabecera);
        })
        .catch(error => {
            console.error(`Error al obtener la cabecera con id ${id}:`, error);
            res.status(500).json({ error: `Error al obtener la cabecera con id ${id}.` });
        });
}

// GET /api/cabecera/mesa/:id
const getCabeceraByMesa = (req, res) => {
    const id = req.params.id;

    Cabecera.findOne({
         where: { id_mesa: id, estado: "abierto" },
         include: [
            {
                model: Cliente,
                attributes: ['nombre', 'apellido', 'cedula']
            },
        ]
     })
        .then(cabecera => {
            if (!cabecera) {
                return res.status(404).json({ error: 'Cabecera no encontrada.' });
            }
            res.json(cabecera);
        })
        .catch(error => {
            console.error(`Error al obtener la cabecera con id ${id}:`, error);
            res.status(500).json({ error: `Error al obtener la cabecera con id ${id}.` });
        });
}


// POST /api/cabecera
const create = (req, res) => {
    const { estado, total, id_cliente, id_mesa } = req.body;
    Cabecera.create({ estado, total, id_cliente, id_mesa })
        .then(cabecera => {
            return Mesa.update({ estado: 'ocupado' }, {
                where: {
                    id: id_mesa,
                    estado: 'desocupado'
                }
            })
            .then(() => {
                res.status(201).json(cabecera);
            });
        })
        .catch(error => {
            console.error('Error al crear la cabecera:', error);
            res.status(500).json({ error: 'Error al crear la cabecera.' });
        });
}

// PUT /api/cabecera/cerrar/:id
const cerrar = (req, res) => {
    const id = req.params.id;
    const fecha_cierre = new Date();

    Cabecera.update({ fecha_cierre, estado: "cerrado" }, { where: { id } })
        .then(result => {
            if (result[0] === 0) {
                return res.status(404).json({ error: 'Cabecera no encontrada.' });
            }
            return Cabecera.findByPk(id, { include: [Cliente, Mesa] })
                .then(cabecera => {
                    if (!cabecera) {
                        return res.status(404).json({ error: 'Cabecera no encontrada.' });
                    }
                    return Mesa.update({ estado: 'desocupado' }, {
                        where: {
                            id: cabecera.id_mesa,
                            estado: 'ocupado'
                        }
                    })
                    .then(() => {
                        res.json(cabecera);
                    });
                })
                .catch(error => {
                    console.error(`Error al obtener la cabecera con id ${id}:`, error);
                    res.status(500).json({ error: `Error al obtener la cabecera con id ${id}.` });
                });

        })
        .catch(error => {
            console.error(`Error al cerrar la cabecera con id ${id}:`, error);
            res.status(500).json({ error: `Error al cerrar la cabecera con id ${id}.` });
        });
}

// PUT /api/cabecera/:id
const update = (req, res) => {
    const id = req.params.id;
    const { estado, total, id_cliente, id_mesa } = req.body;

    Cabecera.update({ estado, total, id_cliente, id_mesa }, { where: { id } })
        .then(result => {
            if (result[0] === 0) {
                return res.status(404).json({ error: 'Cabecera no encontrada.' });
            }
            res.sendStatus(204);
        })
        .catch(error => {
            console.error(`Error al actualizar la cabecera con id ${id}:`, error);
            res.status(500).json({ error: `Error al actualizar la cabecera con id ${id}.` });
        });
}

module.exports = {
    findAll,
    findById,
    create,
    update,
    cerrar,
    getCabeceraByMesa
};