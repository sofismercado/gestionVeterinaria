const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Turno = sequelize.define("Turno", {
  fecha: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  hora: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  motivo: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  estado: {
    type: DataTypes.ENUM("disponible", "pendiente", "confirmado", "cancelado", "finalizado", "sin_atencion"),
    allowNull: false,
    defaultValue: "disponible",
  },
}, {
  indexes: [
    {
      name: "turnos_fecha_hora_unique",
      unique: true,
      fields: ["fecha", "hora"],
    },
  ],
});

module.exports = Turno;
