const sequelize = require("../config/db");
const Usuario = require("./Usuario");
const Mascota = require("./Mascota");
const Turno = require("./Turno");

Usuario.hasMany(Mascota, {
  foreignKey: "usuarioId",
  as: "mascotas",
  onDelete: "CASCADE",
});

Mascota.belongsTo(Usuario, {
  foreignKey: "usuarioId",
  as: "duenio",
  onDelete: "CASCADE",
});

Usuario.hasMany(Turno, {
  foreignKey: "clienteId",
  as: "turnosCliente",
  onDelete: "CASCADE",
});

Turno.belongsTo(Usuario, {
  foreignKey: "clienteId",
  as: "cliente",
  onDelete: "CASCADE",
});

Usuario.hasMany(Turno, {
  foreignKey: "adminId",
  as: "turnosAsignados",
  onDelete: "SET NULL",
});

Turno.belongsTo(Usuario, {
  foreignKey: "adminId",
  as: "admin",
  onDelete: "SET NULL",
});

Mascota.hasMany(Turno, {
  foreignKey: "mascotaId",
  as: "turnos",
  onDelete: "CASCADE",
});

Turno.belongsTo(Mascota, {
  foreignKey: "mascotaId",
  as: "mascota",
  onDelete: "CASCADE",
});

module.exports = {
  sequelize,
  Usuario,
  Mascota,
  Turno,
};
