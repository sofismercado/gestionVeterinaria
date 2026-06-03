import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./ClientesPanel.css";

const API_URL = "http://localhost:3000/api";

const AVATARES_MASCOTA = [
  { value: "perro", label: "Perro", emoji: "\u{1F436}" },
  { value: "gato", label: "Gato", emoji: "\u{1F431}" },
  { value: "conejo", label: "Conejo", emoji: "\u{1F430}" },
  { value: "loro", label: "Loro", emoji: "\u{1F99C}" },
  { value: "hamster", label: "Hamster", emoji: "\u{1F439}" },
  { value: "tortuga", label: "Tortuga", emoji: "\u{1F422}" },
];

const CLIENTE_FORM_INICIAL = {
  nombre: "",
  tel: "",
  mail: "",
  password: "",
  mascota: "",
  especie: "",
  raza: "",
  edad: "",
  peso: "",
  avatar: "perro",
};

const MASCOTA_FORM_INICIAL = {
  nombre: "",
  especie: "",
  raza: "",
  edad: "",
  peso: "",
  avatar: "perro",
};

function getAvatar(avatar) {
  return AVATARES_MASCOTA.find((item) => item.value === avatar) || AVATARES_MASCOTA[0];
}

function SelectorAvatar({ value, onChange }) {
  return (
    <div className="cp-field cp-full">
      <label>Avatar de la mascota</label>
      <div className="cp-avatar-options">
        {AVATARES_MASCOTA.map((avatar) => (
          <button
            key={avatar.value}
            className={`cp-avatar-option ${value === avatar.value ? "selected" : ""}`}
            type="button"
            onClick={() => onChange(avatar.value)}
            title={avatar.label}
          >
            <span className="cp-avatar-emoji">{avatar.emoji}</span>
            <span>{avatar.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function initials(nombre = "") {
  return nombre.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

function formatMascota(mascota) {
  const especieRaza = [mascota.especie, mascota.raza].filter(Boolean).join(" - ");
  const edad = mascota.edad ? `${mascota.edad} años` : "Edad sin cargar";
  const peso = mascota.peso ? `${mascota.peso} kg` : "Peso sin cargar";
  return `${especieRaza || "Sin especie"} - ${edad} - ${peso}`;
}

export default function ClientesPanel() {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const homePath = user?.rol === "super-admin" ? "/home_superadministrador" : "/home_administrador";

  const [clientes, setClientes] = useState([]);
  const [query, setQuery] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [form, setForm] = useState(CLIENTE_FORM_INICIAL);
  const [agregandoMascotaId, setAgregandoMascotaId] = useState(null);
  const [mascotaForm, setMascotaForm] = useState(MASCOTA_FORM_INICIAL);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function cargarClientes() {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(`${API_URL}/usuarios`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.mensaje || "No se pudieron cargar los clientes.");
        return;
      }

      setClientes(data.filter((usuario) => usuario.rol === "cliente"));
    } catch (err) {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (token) cargarClientes();
  }, [token]);

  const filtered = clientes.filter((c) => {
    const q = query.toLowerCase();
    return (
      c.nombre.toLowerCase().includes(q) ||
      (c.mascotas || []).some((m) => m.nombre.toLowerCase().includes(q))
    );
  });

  function toggleExpand(id) {
    setExpandedId((prev) => prev === id ? null : id);
    setAgregandoMascotaId(null);
  }

  function abrirAlta() {
    setEditandoId(null);
    setForm(CLIENTE_FORM_INICIAL);
    setError("");
    setFormOpen(true);
  }

  function abrirEdicion(cliente) {
    setEditandoId(cliente.id);
    setForm({
      ...CLIENTE_FORM_INICIAL,
      nombre: cliente.nombre || "",
      tel: cliente.telefono || "",
      mail: cliente.email || "",
    });
    setError("");
    setFormOpen(true);
  }

  function cerrarForm() {
    setEditandoId(null);
    setForm(CLIENTE_FORM_INICIAL);
    setFormOpen(false);
  }

  async function guardar() {
    if (!form.nombre.trim() || !form.mail.trim()) {
      setError("Nombre y mail son obligatorios.");
      return;
    }

    if (!editandoId && (!form.password.trim() || !form.mascota.trim())) {
      setError("Nombre, mail, contraseña y mascota son obligatorios.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      if (editandoId) {
        const cliente = clientes.find((c) => c.id === editandoId);
        const payload = {
          nombre: form.nombre,
          email: form.mail,
          telefono: form.tel,
          rol: "cliente",
          estado: cliente?.estado || "activo",
        };

        if (form.password.trim()) {
          payload.password = form.password;
        }

        const res = await fetch(`${API_URL}/usuarios/${editandoId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.mensaje || "No se pudo actualizar el cliente.");
          return;
        }

        await cargarClientes();
        cerrarForm();
        setExpandedId(editandoId);
        return;
      }

      const resUsuario = await fetch(`${API_URL}/usuarios`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nombre: form.nombre,
          email: form.mail,
          telefono: form.tel,
          password: form.password,
          rol: "cliente",
          estado: "activo",
        }),
      });

      const usuarioCreado = await resUsuario.json();

      if (!resUsuario.ok) {
        setError(usuarioCreado.mensaje || "No se pudo crear el cliente.");
        return;
      }

      const resMascota = await fetch(`${API_URL}/mascotas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nombre: form.mascota,
          especie: form.especie,
          raza: form.raza,
          edad: form.edad || null,
          peso: form.peso || null,
          avatar: form.avatar,
          usuarioId: usuarioCreado.id,
        }),
      });

      const mascotaCreada = await resMascota.json();

      if (!resMascota.ok) {
        setError(mascotaCreada.mensaje || "El cliente se creo, pero no se pudo crear la mascota.");
        return;
      }

      await cargarClientes();
      cerrarForm();
      setExpandedId(usuarioCreado.id);
    } catch (err) {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  }

  async function guardarMascota(id) {
    if (!mascotaForm.nombre.trim() || !mascotaForm.especie.trim()) {
      setError("Nombre y especie de la mascota son obligatorios.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await fetch(`${API_URL}/mascotas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nombre: mascotaForm.nombre,
          especie: mascotaForm.especie,
          raza: mascotaForm.raza,
          edad: mascotaForm.edad || null,
          peso: mascotaForm.peso || null,
          avatar: mascotaForm.avatar,
          usuarioId: id,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.mensaje || "No se pudo agregar la mascota.");
        return;
      }

      await cargarClientes();
      setAgregandoMascotaId(null);
      setMascotaForm(MASCOTA_FORM_INICIAL);
    } catch (err) {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  }

  async function eliminar(id) {
    const cliente = clientes.find((c) => c.id === id);
    const confirmado = window.confirm(
      `¿Estas seguro de que queres eliminar al cliente ${cliente?.nombre || ""}?`
    );

    if (!confirmado) return;

    try {
      setLoading(true);
      setError("");

      const res = await fetch(`${API_URL}/usuarios/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.mensaje || "No se pudo eliminar el cliente.");
        return;
      }

      setClientes((prev) => prev.filter((c) => c.id !== id));
      if (expandedId === id) setExpandedId(null);
    } catch (err) {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  }

  async function eliminarMascota(id, nombre) {
    const confirmado = window.confirm(
      `¿Estas seguro de que queres eliminar la mascota ${nombre}?`
    );

    if (!confirmado) return;

    try {
      setLoading(true);
      setError("");

      const res = await fetch(`${API_URL}/mascotas/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.mensaje || "No se pudo eliminar la mascota.");
        return;
      }

      await cargarClientes();
    } catch (err) {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="cp-wrap">
      <div className="cp-topbar">
        <button className="cp-back" onClick={() => navigate(homePath)}>
          Volver al menú
        </button>
        <h1 className="cp-title">Nuestros clientes</h1>
      </div>

      <div className="cp-actions">
        <div className="cp-search-wrap">
          <span className="cp-search-icon"></span>
          <input
            className="cp-search"
            type="text"
            placeholder="Buscar por dueño o mascota"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <button className="cp-btn-nuevo" onClick={abrirAlta}>
          + Nuevo cliente
        </button>
      </div>

      {error && <p className="cp-empty">{error}</p>}
      {loading && <p className="cp-count">Cargando...</p>}

      {formOpen && (
        <div className="cp-form-card">
          <p className="cp-form-title">{editandoId ? "Editar cliente" : "Agregar nuevo cliente"}</p>
          <div className="cp-form-grid">
            <div className="cp-field">
              <label>Nombre del dueño</label>
              <input value={form.nombre} onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}  />
            </div>
            <div className="cp-field">
              <label>Teléfono</label>
              <input value={form.tel} onChange={(e) => setForm((f) => ({ ...f, tel: e.target.value }))}  />
            </div>
            <div className="cp-field">
              <label>Mail</label>
              <input value={form.mail} onChange={(e) => setForm((f) => ({ ...f, mail: e.target.value }))}  />
            </div>
            <div className="cp-field">
              <label>Contraseña</label>
              <input type="password" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} placeholder={editandoId ? "Nueva contraseña (opcional)" : ""} />
            </div>
            {!editandoId && (
              <>
                <div className="cp-field">
                  <label>Nombre de mascota</label>
                  <input value={form.mascota} onChange={(e) => setForm((f) => ({ ...f, mascota: e.target.value }))}  />
                </div>
                <div className="cp-field">
                  <label>Especie</label>
                  <input value={form.especie} onChange={(e) => setForm((f) => ({ ...f, especie: e.target.value }))}  />
                </div>
                <div className="cp-field">
                  <label>Raza</label>
                  <input value={form.raza} onChange={(e) => setForm((f) => ({ ...f, raza: e.target.value }))}  />
                </div>
                <div className="cp-field">
                  <label>Edad</label>
                  <input value={form.edad} onChange={(e) => setForm((f) => ({ ...f, edad: e.target.value }))}  />
                </div>
                <div className="cp-field">
                  <label>Peso</label>
                  <input value={form.peso} onChange={(e) => setForm((f) => ({ ...f, peso: e.target.value }))}  />
                </div>
                <SelectorAvatar
                  value={form.avatar}
                  onChange={(avatar) => setForm((f) => ({ ...f, avatar }))}
                />
              </>
            )}
          </div>
          <div className="cp-form-footer">
            <button className="cp-btn-cancelar" onClick={cerrarForm}>Cancelar</button>
            <button className="cp-btn-guardar" onClick={guardar}>
              {editandoId ? "Guardar cambios" : "Guardar cliente"}
            </button>
          </div>
        </div>
      )}

      <p className="cp-count">{filtered.length} cliente{filtered.length !== 1 ? "s" : ""}</p>

      {filtered.length === 0 ? (
        <p className="cp-empty">No se encontraron clientes</p>
      ) : (
        filtered.map((c) => {
          const isOpen = expandedId === c.id;
          return (
            <div key={c.id} className="cp-card">
              <div className="cp-row" onClick={() => toggleExpand(c.id)}>
                <div className="cp-avatar">{initials(c.nombre)}</div>
                <div className="cp-info">
                  <p className="cp-nombre">{c.nombre}</p>
                  <p className="cp-mascotas">
                    {(c.mascotas || []).map((m) => m.nombre).join(", ") || "Sin mascotas"}
                  </p>
                </div>
                <span className={`cp-chevron ${isOpen ? "open" : ""}`}>v</span>
              </div>

              {isOpen && (
                <div className="cp-detail">
                  <div className="cp-detail-grid">
                    <div className="cp-detail-item">
                      <span className="cp-detail-label">Mail</span>
                      <span className="cp-detail-value">{c.email || "-"}</span>
                    </div>
                    <div className="cp-detail-item">
                      <span className="cp-detail-label">Telefono</span>
                      <span className="cp-detail-value">{c.telefono || "-"}</span>
                    </div>
                  </div>

                  <div className="cp-mascotas-section">
                    <p className="cp-detail-label">Mascotas</p>
                    <div className="cp-chips">
                      {(c.mascotas || []).length > 0
                        ? c.mascotas.map((m) => (
                          <span key={m.id} className="cp-chip">
                            <span className="cp-chip-avatar">{getAvatar(m.avatar).emoji}</span>
                            {m.nombre} - {formatMascota(m)}
                            <button
                              className="cp-chip-eliminar"
                              onClick={() => eliminarMascota(m.id, m.nombre)}
                              title={`Eliminar a ${m.nombre}`}
                            >
                              x
                            </button>
                          </span>
                        ))
                        : <span className="cp-sin-mascotas">Sin mascotas registradas</span>
                      }
                    </div>
                  </div>

                  {agregandoMascotaId === c.id && (
                    <div className="cp-add-pet-card">
                      <p className="cp-form-title">Agregar mascota</p>
                      <div className="cp-form-grid">
                        <div className="cp-field">
                          <label>Nombre</label>
                          <input value={mascotaForm.nombre} onChange={(e) => setMascotaForm((f) => ({ ...f, nombre: e.target.value }))}  />
                        </div>
                        <div className="cp-field">
                          <label>Especie</label>
                          <input value={mascotaForm.especie} onChange={(e) => setMascotaForm((f) => ({ ...f, especie: e.target.value }))}  />
                        </div>
                        <div className="cp-field">
                          <label>Raza</label>
                          <input value={mascotaForm.raza} onChange={(e) => setMascotaForm((f) => ({ ...f, raza: e.target.value }))}  />
                        </div>
                        <div className="cp-field">
                          <label>Edad</label>
                          <input value={mascotaForm.edad} onChange={(e) => setMascotaForm((f) => ({ ...f, edad: e.target.value }))} />
                        </div>
                        <div className="cp-field">
                          <label>Peso</label>
                          <input value={mascotaForm.peso} onChange={(e) => setMascotaForm((f) => ({ ...f, peso: e.target.value }))}  />
                        </div>
                        <SelectorAvatar
                          value={mascotaForm.avatar}
                          onChange={(avatar) => setMascotaForm((f) => ({ ...f, avatar }))}
                        />
                      </div>
                      <div className="cp-form-footer">
                        <button className="cp-btn-cancelar" onClick={() => setAgregandoMascotaId(null)}>Cancelar</button>
                        <button className="cp-btn-guardar" onClick={() => guardarMascota(c.id)}>Guardar mascota</button>
                      </div>
                    </div>
                  )}

                  <div className="cp-detail-actions">
                    <button className="cp-btn-editar" onClick={() => abrirEdicion(c)}>Editar cliente</button>
                    <button className="cp-btn-editar" onClick={() => setAgregandoMascotaId(c.id)}>Agregar mascota</button>
                    <button className="cp-btn-eliminar" onClick={() => eliminar(c.id)}>Eliminar</button>
                  </div>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
