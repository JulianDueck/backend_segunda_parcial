const { Categoria } = require('./../models/categoria.model');

// GET /api/categoria
const findAll = (req, res) => {
    Categoria.findAll()
        .then(categorias => {
            res.json(categorias);
        })
        .catch(error => {
            console.error('Error al obtener las categorías:', error);
            res.status(500).json({ error: 'Error al obtener las categorías.' });
        });
}

// GET /api/categoria/:id
const findById = (req, res) => {
    const id = req.params.id;

    Categoria.findByPk(id)
        .then(categoria => {
            if (!categoria) {
                return res.status(404).json({ error: 'Categoría no encontrada.' });
            }
            res.json(categoria);
        })
        .catch(error => {
            console.error(`Error al obtener la categoría con id ${id}:`, error);
            res.status(500).json({ error: `Error al obtener la categoría con id ${id}.` });
        });
}

// POST /api/categoria
const create = (req, res) => {
    const { nombre } = req.body;

    Categoria.create({ nombre })
        .then(categoria => {
            res.status(201).json(categoria);
        })
        .catch(error => {
            console.error('Error al crear la categoría:', error);
            res.status(500).json({ error: 'Error al crear la categoría.' });
        });
}

// PUT /api/categoria/:id
const update = (req, res) => {
    const id = req.params.id;
    const { nombre } = req.body;

    Categoria.update({ nombre }, { where: { id } })
        .then(result => {
            if (result[0] === 0) {
                return res.status(404).json({ error: 'Categoría no encontrada.' });
            }
            res.sendStatus(204);
        })
        .catch(error => {
            console.error(`Error al actualizar la categoría con id ${id}:`, error);
            res.status(500).json({ error: `Error al actualizar la categoría con id ${id}.` });
        });
}

// DELETE /api/categoria/:id
const deleteById = (req, res) => {
    const id = req.params.id;

    Categoria.destroy({ where: { id } })
        .then(result => {
            if (result === 0) {
                return res.status(404).json({ error: 'Categoría no encontrada.' });
            }
            res.sendStatus(204);
        })
        .catch(error => {
            console.error(`Error al eliminar la categoría con id ${id}:`, error);
            res.status(500).json({ error: `Error al eliminar la categoría con id ${id}.` });
        });
}

module.exports = {
    findAll,
    findById,
    create,
    update,
    delete: deleteById,
};