const bcrypt = require("bcrypt");
const { Usuario, Mascota, Turno } = require("../models");

async function listarUsuarios(req, res) {
  try {
    const where = req.user.rol === "admin" ? { rol: "cliente" } : {};
    const usuarios = await Usuario.findAll({
      where,
      attributes: { exclude: ["password"] },
      include: [{ model: Mascota, as: "mascotas" }],
      order: [["id", "DESC"]],
    });

    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al listar usuarios.", error: error.message });
  }
}

async function obtenerUsuario(req, res) {
  try {
    const usuario = await Usuario.findByPk(req.params.id, {
      attributes: { exclude: ["password"] },
      include: [{ model: Mascota, as: "mascotas" }],
    });

    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado." });
    }

    if (req.user.rol === "admin" && usuario.rol !== "cliente") {
      return res.status(403).json({ mensaje: "No tenes permiso para ver este usuario." });
    }

    res.json(usuario);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener usuario.", error: error.message });
  }
}

async function crearUsuario(req, res) {
  try {
    const { nombre, email, telefono, password, rol, estado } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({ mensaje: "Nombre, email y password son obligatorios." });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const usuario = await Usuario.create({
      nombre,
      email,
      telefono,
      password: passwordHash,
      rol: req.user.rol === "admin" ? "cliente" : rol || "cliente",
      estado: estado || "activo",
    });

    const usuarioJson = usuario.toJSON();
    delete usuarioJson.password;

    res.status(201).json(usuarioJson);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al crear usuario.", error: error.message });
  }
}

async function actualizarUsuario(req, res) {
  try {
    const usuario = await Usuario.findByPk(req.params.id);

    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado." });
    }

    if (req.user.rol === "admin" && usuario.rol !== "cliente") {
      return res.status(403).json({ mensaje: "No tenes permiso para editar este usuario." });
    }

    const { nombre, email, telefono, password, rol, estado } = req.body;
    const datos = {
      nombre,
      email,
      telefono,
      rol: req.user.rol === "admin" ? "cliente" : rol,
      estado,
    };

    if (password) {
      datos.password = await bcrypt.hash(password, 10);
    }

    await usuario.update(datos);

    const usuarioJson = usuario.toJSON();
    delete usuarioJson.password;

    res.json(usuarioJson);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al actualizar usuario.", error: error.message });
  }
}

async function eliminarUsuario(req, res) {
  try {
    const usuario = await Usuario.findByPk(req.params.id);

    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado." });
    }

    if (req.user.rol === "admin" && usuario.rol !== "cliente") {
      return res.status(403).json({ mensaje: "No tenes permiso para eliminar este usuario." });
    }

    await Turno.destroy({ where: { clienteId: usuario.id } });
    await Turno.update({ adminId: null }, { where: { adminId: usuario.id } });
    await Mascota.destroy({ where: { usuarioId: usuario.id } });
    await usuario.destroy();

    res.json({ mensaje: "Usuario eliminado correctamente." });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar usuario.", error: error.message });
  }
}

module.exports = {
  listarUsuarios,
  obtenerUsuario,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
};
