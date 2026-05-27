const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Turno = sequelize.define("Turno", {
  fecha: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  hora: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  motivo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  estado: {
    type: DataTypes.ENUM("pendiente", "confirmado", "cancelado", "finalizado"),
    allowNull: false,
    defaultValue: "pendiente",
  },
});

module.exports = Turno;
