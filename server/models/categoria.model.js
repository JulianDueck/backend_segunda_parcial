const { DataTypes } = require('sequelize');
const sequelize = require('./../configs/sequelize.config');

const Categoria = sequelize.define('categoria', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

module.exports = {
    Categoria
};