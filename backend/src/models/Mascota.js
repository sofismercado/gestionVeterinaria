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
    type: DataTypes.DECIMAL(6, 2),
    allowNull: true,
  },
  avatar: {
    type: DataTypes.ENUM("perro", "gato", "conejo", "loro", "hamster", "tortuga"),
    allowNull: false,
    defaultValue: "perro",
  },
});

module.exports = Mascota;
