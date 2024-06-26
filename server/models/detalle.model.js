const { DataTypes } = require('sequelize');
const sequelize = require('./../configs/sequelize.config');
const { Cabecera } = require('./cabecera.model');
const { Producto } = require('./producto.model');

const Detalle = sequelize.define('detalle', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    cantidad: {
        type: DataTypes.FLOAT,
        allowNull: false,
    }
});

Detalle.belongsTo(Cabecera, { foreignKey: 'id_cabecera' });
Detalle.belongsTo(Producto, { foreignKey: 'id_producto' });

module.exports = { Detalle };