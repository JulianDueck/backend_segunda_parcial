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
        defaultValue: 0,
    },
    fecha_cierre: {
        type: DataTypes.DATE,
        allowNull: true,
    },
});

Cabecera.belongsTo(Mesa, { foreignKey: 'id_mesa' });

Cabecera.belongsTo(Cliente, { foreignKey: 'id_cliente' });

module.exports = { Cabecera };