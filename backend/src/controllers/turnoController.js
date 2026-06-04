const { sequelize, Turno, Mascota, Usuario } = require("../models");

async function listarTurnos(req, res) {
  try {
    const where = {};

    if (req.query.estado) {
      where.estado = req.query.estado;
    }

    if (req.user.rol === "cliente" && !["disponible", "sin_atencion"].includes(req.query.estado)) {
      where.clienteId = req.user.id;
    }

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
  let transaction;

  try {
    const { fecha, hora, motivo, estado = "disponible" } = req.body;

    if (!fecha) {
      return res.status(400).json({ mensaje: "La fecha es obligatoria." });
    }

    if (estado === "disponible" && !hora) {
      return res.status(400).json({ mensaje: "La hora es obligatoria para habilitar un turno." });
    }

    if (estado === "sin_atencion") {
      transaction = await sequelize.transaction();
      const diaExistente = await Turno.findOne({
        where: { fecha, estado: "sin_atencion" },
        transaction,
      });
      if (diaExistente) {
        await transaction.rollback();
        return res.status(400).json({ mensaje: "Ese dia ya esta marcado sin atencion." });
      }

      const turnoPedido = await Turno.findOne({
        where: { fecha, estado: "pendiente" },
        transaction,
      });
      const turnoConfirmado = await Turno.findOne({
        where: { fecha, estado: "confirmado" },
        transaction,
      });
      if (turnoPedido || turnoConfirmado) {
        await transaction.rollback();
        return res.status(400).json({ mensaje: "No se puede marcar sin atencion un dia con turnos pedidos." });
      }

      await Turno.destroy({ where: { fecha, estado: "disponible" }, transaction });
    }

    if (estado === "disponible") {
      const diaSinAtencion = await Turno.findOne({ where: { fecha, estado: "sin_atencion" } });
      if (diaSinAtencion) {
        return res.status(400).json({ mensaje: "No se pueden habilitar horarios en un dia sin atencion." });
      }

      const horarioExistente = await Turno.findOne({ where: { fecha, hora } });
      if (horarioExistente) {
        return res.status(400).json({ mensaje: "Ese horario ya existe para ese dia." });
      }
    }

    const turno = await Turno.create({
      fecha,
      hora: hora || null,
      motivo: motivo || null,
      estado,
      adminId: req.user.id,
    }, { transaction });

    if (transaction) {
      await transaction.commit();
    }

    res.status(201).json(turno);
  } catch (error) {
    if (transaction && !transaction.finished) {
      await transaction.rollback();
    }
    res.status(500).json({ mensaje: "Error al crear turno.", error: error.message });
  }
}

async function actualizarTurno(req, res) {
  try {
    const turno = await Turno.findByPk(req.params.id);

    if (!turno) {
      return res.status(404).json({ mensaje: "Turno no encontrado." });
    }

    if (req.user.rol === "cliente") {
      const { estado, mascotaId, motivo, reprogramarTurnoId } = req.body;

      if (estado === "disponible") {
        if (turno.clienteId !== req.user.id) {
          return res.status(403).json({ mensaje: "No podes cancelar un turno que no es tuyo." });
        }

        if (!["pendiente", "confirmado"].includes(turno.estado)) {
          return res.status(400).json({ mensaje: "Ese turno no se puede cancelar." });
        }

        await turno.update({
          estado: "disponible",
          clienteId: null,
          mascotaId: null,
          motivo: null,
        });

        return res.json(turno);
      }

      if (turno.estado !== "disponible") {
        return res.status(400).json({ mensaje: "Ese horario ya no esta disponible." });
      }

      if (!mascotaId || !motivo || motivo.trim().length < 3) {
        return res.status(400).json({ mensaje: "Mascota y motivo son obligatorios." });
      }

      const mascota = await Mascota.findOne({
        where: { id: mascotaId, usuarioId: req.user.id },
      });

      if (!mascota) {
        return res.status(403).json({ mensaje: "La mascota no pertenece al usuario." });
      }

      if (reprogramarTurnoId) {
        await sequelize.transaction(async (transaction) => {
          const turnoAnterior = await Turno.findOne({
            where: { id: reprogramarTurnoId, clienteId: req.user.id },
            transaction,
          });

          if (!turnoAnterior || !["pendiente", "confirmado"].includes(turnoAnterior.estado)) {
            const error = new Error("No se encontro un turno valido para reprogramar.");
            error.status = 400;
            throw error;
          }

          await turnoAnterior.update({
            estado: "disponible",
            clienteId: null,
            mascotaId: null,
            motivo: null,
          }, { transaction });

          await turno.update({
            estado: "pendiente",
            clienteId: req.user.id,
            mascotaId,
            motivo,
          }, { transaction });
        });
      } else {
        await turno.update({
          estado: "pendiente",
          clienteId: req.user.id,
          mascotaId,
          motivo,
        });
      }

      return res.json(turno);
    }

    const datos = { ...req.body };

    if (datos.estado === "confirmado") {
      datos.adminId = req.user.id;
    }

    if (datos.estado === "disponible") {
      datos.clienteId = null;
      datos.mascotaId = null;
      datos.motivo = null;
    }

    if (datos.estado === "sin_atencion") {
      datos.hora = null;
      datos.clienteId = null;
      datos.mascotaId = null;
      datos.motivo = datos.motivo || "Sin atencion";
      datos.adminId = req.user.id;
    }

    await turno.update(datos);
    res.json(turno);
  } catch (error) {
    res.status(error.status || 500).json({
      mensaje: error.status ? error.message : "Error al actualizar turno.",
      error: error.message,
    });
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
