const { DataTypes } = require('sequelize');
const sequelize = require('../configs/sequelize.config');
const { Mesa } = require('./mesa.model');
const { Cliente } = require('./cliente.model');

const Cabecera = sequelize.define('cabecera', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    estado: {
        type: DataTypes.STRING(10),
        allowNull: false,
    },
    total: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    fecha_cierre: {
        type: DataTypes.DATE,
        allowNull: true,
    },
});

Consumo.belongsTo(Mesa, { foreignKey: 'id_mesa' });

Consumo.belongsTo(Cliente, { foreignKey: 'id_cliente' });

module.exports = { Cabecera };