const { Mascota, Usuario } = require("../models");

async function listarMascotas(req, res) {
  try {
    const where = req.user.rol === "cliente" ? { usuarioId: req.user.id } : {};
    const mascotas = await Mascota.findAll({
      where,
      include: [{ model: Usuario, as: "duenio", attributes: ["id", "nombre", "email"] }],
      order: [["id", "DESC"]],
    });

    res.json(mascotas);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al listar mascotas.", error: error.message });
  }
}

async function crearMascota(req, res) {
  try {
    const { nombre, especie, raza, edad, peso, usuarioId } = req.body;

    if (!nombre || !especie || !usuarioId) {
      return res.status(400).json({ mensaje: "Nombre, especie y usuarioId son obligatorios." });
    }

    const mascota = await Mascota.create({ nombre, especie, raza, edad, peso, usuarioId });
    res.status(201).json(mascota);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al crear mascota.", error: error.message });
  }
}

async function actualizarMascota(req, res) {
  try {
    const mascota = await Mascota.findByPk(req.params.id);

    if (!mascota) {
      return res.status(404).json({ mensaje: "Mascota no encontrada." });
    }

    await mascota.update(req.body);
    res.json(mascota);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al actualizar mascota.", error: error.message });
  }
}

async function eliminarMascota(req, res) {
  try {
    const mascota = await Mascota.findByPk(req.params.id);

    if (!mascota) {
      return res.status(404).json({ mensaje: "Mascota no encontrada." });
    }

    await mascota.destroy();
    res.json({ mensaje: "Mascota eliminada correctamente." });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar mascota.", error: error.message });
  }
}

module.exports = {
  listarMascotas,
  crearMascota,
  actualizarMascota,
  eliminarMascota,
};
