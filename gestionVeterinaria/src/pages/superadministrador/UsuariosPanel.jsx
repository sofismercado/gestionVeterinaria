import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./SuperAdmin.css";

const API_URL = "http://localhost:3000/api";

const FORM_INICIAL = {
  nombre: "",
  email: "",
  telefono: "",
  password: "",
  rol: "cliente",
  estado: "activo",
};

function UsuariosPanel() {
  const navigate = useNavigate();
  const { token, logout } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [query, setQuery] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [form, setForm] = useState(FORM_INICIAL);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const authHeaders = useMemo(() => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  }), [token]);

  const cargarUsuarios = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/usuarios`, {
        headers: authHeaders,
      });

      const data = await response.json();

      if (response.status === 401 || response.status === 403) {
        logout();
        navigate("/");
        return;
      }

      if (!response.ok) {
        setError(data.mensaje || "No se pudieron cargar los usuarios.");
        return;
      }

      setUsuarios(data);
    } catch (err) {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

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
      nombre: usuario.nombre || "",
      email: usuario.email || "",
      telefono: usuario.telefono || "",
      password: "",
      rol: usuario.rol || "Cliente",
      estado: usuario.estado || "Activo",
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
      return "El email debe tener un formato vÁlido.";
    }

    if (!editandoId && !form.password.trim()) {
      return "La contraseña es obligatoria al crear un usuario.";
    }

    return "";
  };

  const guardarUsuario = async (event) => {
    event.preventDefault();
    const mensajeError = validarForm();

    if (mensajeError) {
      setError(mensajeError);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const payload = { ...form };
      if (editandoId && !payload.password.trim()) {
        delete payload.password;
      }

      const response = await fetch(
        editandoId ? `${API_URL}/usuarios/${editandoId}` : `${API_URL}/usuarios`,
        {
          method: editandoId ? "PUT" : "POST",
          headers: authHeaders,
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.mensaje || "No se pudo guardar el usuario.");
        return;
      }

      await cargarUsuarios();
      cerrarForm();
    } catch (err) {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  const eliminarUsuario = async (id) => {
    const usuario = usuarios.find((item) => item.id === id);
    const confirmado = window.confirm(
      `¿Estás seguro de que querés eliminar al usuario ${usuario?.nombre || ""}?`
    );

    if (!confirmado) return;

    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/usuarios/${id}`, {
        method: "DELETE",
        headers: authHeaders,
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.mensaje || "No se pudo eliminar el usuario.");
        return;
      }

      setUsuarios((prev) => prev.filter((usuario) => usuario.id !== id));
    } catch (err) {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
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
            <input
              type="text"
              placeholder="Teléfono"
              value={form.telefono}
              onChange={(event) => setForm((prev) => ({ ...prev, telefono: event.target.value }))}
            />
            <input
              type="password"
              placeholder={editandoId ? "Nueva contraseña" : "Contraseña"}
              value={form.password}
              onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
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
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>

            {error && <p className="usuario-form-error">{error}</p>}

            <div className="usuario-form-actions">
              <button className="boton-secundario" type="button" onClick={cerrarForm}>
                Cancelar
              </button>
              <button className="boton-secundario" type="submit" disabled={loading}>
                {editandoId ? "Guardar cambios" : "Crear usuario"}
              </button>
            </div>
          </form>
        )}

        {error && !formOpen && <p className="usuario-form-error">{error}</p>}
        {loading && <p className="sin-mascotas">Cargando...</p>}

        <section className="usuarios-lista">
          {usuariosFiltrados.map((usuario) => (
            <article className="usuario-card" key={usuario.id}>
              <div>
                <p className="usuario-nombre">{usuario.nombre}</p>
                <p className="usuario-mail">{usuario.email}</p>
                {usuario.telefono && <p className="usuario-mail">{usuario.telefono}</p>}
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
