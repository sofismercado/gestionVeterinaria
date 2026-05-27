const sequelize = require("../config/db");
const Usuario = require("./Usuario");
const Mascota = require("./Mascota");
const Turno = require("./Turno");

Usuario.hasMany(Mascota, {
  foreignKey: "usuarioId",
  as: "mascotas",
});

Mascota.belongsTo(Usuario, {
  foreignKey: "usuarioId",
  as: "duenio",
});

Usuario.hasMany(Turno, {
  foreignKey: "clienteId",
  as: "turnosCliente",
});

Turno.belongsTo(Usuario, {
  foreignKey: "clienteId",
  as: "cliente",
});

Usuario.hasMany(Turno, {
  foreignKey: "adminId",
  as: "turnosAsignados",
});

Turno.belongsTo(Usuario, {
  foreignKey: "adminId",
  as: "admin",
});

Mascota.hasMany(Turno, {
  foreignKey: "mascotaId",
  as: "turnos",
});

Turno.belongsTo(Mascota, {
  foreignKey: "mascotaId",
  as: "mascota",
});

module.exports = {
  sequelize,
  Usuario,
  Mascota,
  Turno,
};
