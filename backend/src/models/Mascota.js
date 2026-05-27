const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Mascota = sequelize.define("Mascota", {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  especie: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  raza: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  edad: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  peso: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
});

module.exports = Mascota;
