const { Turno, Mascota, Usuario } = require("../models");

async function listarTurnos(req, res) {
  try {
    const where = req.user.rol === "cliente" ? { clienteId: req.user.id } : {};
    const turnos = await Turno.findAll({
      where,
      include: [
        { model: Mascota, as: "mascota" },
        { model: Usuario, as: "cliente", attributes: ["id", "nombre", "email"] },
        { model: Usuario, as: "admin", attributes: ["id", "nombre", "email"] },
      ],
      order: [["fecha", "ASC"], ["hora", "ASC"]],
    });

    res.json(turnos);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al listar turnos.", error: error.message });
  }
}

async function crearTurno(req, res) {
  try {
    const { fecha, hora, motivo, estado, mascotaId, clienteId, adminId } = req.body;

    if (!fecha || !hora || !motivo || !mascotaId || !clienteId) {
      return res.status(400).json({ mensaje: "Fecha, hora, motivo, mascotaId y clienteId son obligatorios." });
    }

    const turno = await Turno.create({
      fecha,
      hora,
      motivo,
      estado: estado || "pendiente",
      mascotaId,
      clienteId,
      adminId: adminId || null,
    });

    res.status(201).json(turno);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al crear turno.", error: error.message });
  }
}

async function actualizarTurno(req, res) {
  try {
    const turno = await Turno.findByPk(req.params.id);

    if (!turno) {
      return res.status(404).json({ mensaje: "Turno no encontrado." });
    }

    await turno.update(req.body);
    res.json(turno);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al actualizar turno.", error: error.message });
  }
}

async function eliminarTurno(req, res) {
  try {
    const turno = await Turno.findByPk(req.params.id);

    if (!turno) {
      return res.status(404).json({ mensaje: "Turno no encontrado." });
    }

    await turno.destroy();
    res.json({ mensaje: "Turno eliminado correctamente." });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar turno.", error: error.message });
  }
}

module.exports = {
  listarTurnos,
  crearTurno,
  actualizarTurno,
  eliminarTurno,
};
