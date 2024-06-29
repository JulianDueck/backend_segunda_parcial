const { Producto }= require('./../models/producto.model');
const { Categoria }= require('./../models/categoria.model');

// GET /api/producto
const findAll = (req, res) => {
    Producto.findAll({
        include: Categoria
    })
        .then(productos => {
            res.json(productos);
        })
        .catch(error => {
            console.error('Error al obtener los productos:', error);
            res.status(500).json({ error: 'Error al obtener los productos.' });
        });
}

// GET /api/producto/:id
const findById = (req, res) => {
    const id = req.params.id;

    Producto.findByPk(id, { include: Categoria })
        .then(producto => {
            if (!producto) {
                return res.status(404).json({ error: 'Producto no encontrado.' });
            }
            res.json(producto);
        })
        .catch(error => {
            console.error(`Error al obtener el producto con id ${id}:`, error);
            res.status(500).json({ error: `Error al obtener el producto con id ${id}.` });
        });
}

// POST /api/producto
const create = (req, res) => {
    const { nombre, precio, id_categoria } = req.body;

    Producto.create({ nombre, precio, id_categoria })
        .then(producto => {
            res.status(201).json(producto);
        })
        .catch(error => {
            console.error('Error al crear el producto:', error);
            res.status(500).json({ error: 'Error al crear el producto.' });
        });
}

// PUT /api/producto/:id
const update = (req, res) => {
    const id = req.params.id;
    const { nombre, precio, id_categoria } = req.body;

    Producto.update({ nombre, precio, id_categoria }, { where: { id } })
        .then(result => {
            if (result[0] === 0) {
                return res.status(404).json({ error: 'Producto no encontrado.' });
            }
            res.sendStatus(204);
        })
        .catch(error => {
            console.error(`Error al actualizar el producto con id ${id}:`, error);
            res.status(500).json({ error: `Error al actualizar el producto con id ${id}.` });
        });
}

// DELETE /api/producto/:id
const deleteById = (req, res) => {
    const id = req.params.id;

    Producto.destroy({ where: { id } })
        .then(result => {
            if (!result) {
                return res.status(404).json({ error: 'Producto no encontrado.' });
            }
            res.sendStatus(204);
        })
        .catch(error => {
            console.error(`Error al eliminar el producto con id ${id}:`, error);
            res.status(500).json({ error: `Error al eliminar el producto con id ${id}.` });
        });
}

module.exports = {
    findAll,
    findById,
    create,
    update,
    delete: deleteById,
};
