const { DataTypes } = require('sequelize');
const sequelize = require('./../configs/sequelize.config');
const { Categoria } = require('./categoria.model');

const Producto = sequelize.define('producto', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    precio: {
        type: DataTypes.DECIMAL,
        allowNull: false
    },
});

Producto.belongsTo(Categoria, { foreignKey: 'id_categoria' });

module.exports = {
    Producto
};