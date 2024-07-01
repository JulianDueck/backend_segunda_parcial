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

// GET /api/cabecera/mesa/ocupacion/:id_mesa
const getOcupacionMesa = (req, res) => {
    const id_mesa = req.params.id_mesa;

    Cabecera.findOne({ where: { id_mesa, estado: "abierto" } })
        .then(cabecera => {
            if (!cabecera) {
                return res.status(404).json({ error: 'Cabecera no encontrada.' });
            }
            res.json(cabecera);
        })
        .catch(error => {
            console.error(`Error al obtener la mesa con id ${id_mesa}:`, error);
            res.status(500).json({ error: `Error al obtener la mesa con id ${id_mesa}.` });
        });

}

// GET /api/cabecera/mesa/:id
const getCabeceraByMesa = (req, res) => {
    const id = req.params.id;

    Cabecera.findOne({ where: { id_mesa: id, estado: "abierto" } })
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
    const { estado, id_cliente, id_mesa } = req.body;

    Cabecera.create({ estado, id_cliente, id_mesa })
        .then(cabecera => {
            res.status(201).json(cabecera);
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
    const total = req.body.total;

    Cabecera.update({ fecha_cierre, estado: "cerrado", total }, { where: { id } })
        .then(result => {
            if (result[0] === 0) {
                return res.status(404).json({ error: 'Cabecera no encontrada.' });
            }
            res.sendStatus(204);
        })
        .catch(error => {
            console.error(`Error al cerrar la cabecera con id ${id}:`, error);
            res.status(500).json({ error: `Error al cerrar la cabecera con id ${id}.` });
        });
}

// PUT /api/cabecera/:id/updateCliente
const updateCliente = (req, res) => {
    const id = req.params.id;
    const { id_cliente } = req.body;

    Cabecera.update({ id_cliente }, { where: { id } })
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
    getCabeceraByMesa,
    updateCliente,
    getOcupacionMesa
};