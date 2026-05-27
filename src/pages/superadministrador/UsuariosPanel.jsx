import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SuperAdmin.css";

const USUARIOS_INICIALES = [
  {
    id: 1,
    nombre: "Super Administrador",
    email: "superadmin@vet.com",
    rol: "super-admin",
    estado: "Activo",
  },
  {
    id: 2,
    nombre: "Administrador",
    email: "admin@vet.com",
    rol: "admin",
    estado: "Activo",
  },
  {
    id: 3,
    nombre: "Carlos",
    email: "cliente@vet.com",
    rol: "cliente",
    estado: "Activo",
  },
];

const FORM_INICIAL = {
  nombre: "",
  email: "",
  rol: "cliente",
  estado: "Activo",
};

function UsuariosPanel() {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState(USUARIOS_INICIALES);
  const [query, setQuery] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [form, setForm] = useState(FORM_INICIAL);
  const [error, setError] = useState("");

  const usuariosFiltrados = useMemo(() => {
    const texto = query.trim().toLowerCase();
    if (!texto) return usuarios;

    return usuarios.filter((usuario) =>
      usuario.nombre.toLowerCase().includes(texto) ||
      usuario.email.toLowerCase().includes(texto) ||
      usuario.rol.toLowerCase().includes(texto)
    );
  }, [query, usuarios]);

  const abrirAlta = () => {
    setForm(FORM_INICIAL);
    setEditandoId(null);
    setError("");
    setFormOpen(true);
  };

  const abrirEdicion = (usuario) => {
    setForm({
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol,
      estado: usuario.estado,
    });
    setEditandoId(usuario.id);
    setError("");
    setFormOpen(true);
  };

  const cerrarForm = () => {
    setFormOpen(false);
    setEditandoId(null);
    setForm(FORM_INICIAL);
    setError("");
  };

  const validarForm = () => {
    if (!form.nombre.trim() || !form.email.trim()) {
      return "Nombre y email son obligatorios.";
    }

    if (!form.email.includes("@")) {
      return "El email debe tener un formato valido.";
    }

    const emailRepetido = usuarios.some((usuario) =>
      usuario.email.toLowerCase() === form.email.toLowerCase() &&
      usuario.id !== editandoId
    );

    if (emailRepetido) {
      return "Ya existe un usuario con ese email.";
    }

    return "";
  };

  const guardarUsuario = (event) => {
    event.preventDefault();
    const mensajeError = validarForm();

    if (mensajeError) {
      setError(mensajeError);
      return;
    }

    if (editandoId) {
      setUsuarios((prev) =>
        prev.map((usuario) =>
          usuario.id === editandoId ? { ...usuario, ...form } : usuario
        )
      );
    } else {
      setUsuarios((prev) => [{ id: Date.now(), ...form }, ...prev]);
    }

    cerrarForm();
  };

  const eliminarUsuario = (id) => {
    setUsuarios((prev) => prev.filter((usuario) => usuario.id !== id));
  };

  return (
    <div className="contenedor-padre">
      <header className="navbar">
        <div>
          <h1>Gestionar usuarios</h1>
          <p className="super-subtitle">Alta, baja, modificacion y roles</p>
        </div>
        <div className="navbar-links">
          <button className="boton-secundario" onClick={() => navigate("/home_superadministrador")}>
            Volver
          </button>
          <button className="boton-secundario" onClick={abrirAlta}>
            Nuevo usuario
          </button>
        </div>
      </header>

      <main className="usuarios-panel">
        <div className="usuarios-actions">
          <input
            className="usuarios-search"
            type="text"
            placeholder="Buscar por nombre, email o rol"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>

        {formOpen && (
          <form className="usuario-form" onSubmit={guardarUsuario}>
            <input
              type="text"
              placeholder="Nombre"
              value={form.nombre}
              onChange={(event) => setForm((prev) => ({ ...prev, nombre: event.target.value }))}
            />
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
            />
            <select
              value={form.rol}
              onChange={(event) => setForm((prev) => ({ ...prev, rol: event.target.value }))}
            >
              <option value="cliente">Cliente</option>
              <option value="admin">Admin</option>
              <option value="super-admin">Super Admin</option>
            </select>
            <select
              value={form.estado}
              onChange={(event) => setForm((prev) => ({ ...prev, estado: event.target.value }))}
            >
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>

            {error && <p className="usuario-form-error">{error}</p>}

            <div className="usuario-form-actions">
              <button className="boton-secundario" type="button" onClick={cerrarForm}>
                Cancelar
              </button>
              <button className="boton-secundario" type="submit">
                {editandoId ? "Guardar cambios" : "Crear usuario"}
              </button>
            </div>
          </form>
        )}

        <section className="usuarios-lista">
          {usuariosFiltrados.map((usuario) => (
            <article className="usuario-card" key={usuario.id}>
              <div>
                <p className="usuario-nombre">{usuario.nombre}</p>
                <p className="usuario-mail">{usuario.email}</p>
                <div className="usuario-meta">
                  <span className="usuario-badge">{usuario.rol}</span>
                  <span className="usuario-badge">{usuario.estado}</span>
                </div>
              </div>
              <div className="usuario-actions">
                <button className="boton-secundario m-0" onClick={() => abrirEdicion(usuario)}>
                  Editar
                </button>
                <button className="boton-secundario m-0" onClick={() => eliminarUsuario(usuario.id)}>
                  Eliminar
                </button>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}

export default UsuariosPanel;
