import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./ClientesPanel.css";

const MOCK_CLIENTES = [
  {
    id: 1,
    nombre: "Carlos Rodriguez",
    tel: "341-555-0101",
    mail: "carlos.r@gmail.com",
    mascotas: [
      { n: "Luna", especie: "Perro", r: "Labrador", edad: "4", peso: "24" },
      { n: "Simba", especie: "Gato", r: "Maine Coon", edad: "2", peso: "6" },
    ],
    ultimoTurno: "8 de mayo 2024",
  },
  {
    id: 2,
    nombre: "Ana Martinez",
    tel: "341-555-0202",
    mail: "ana.m@hotmail.com",
    mascotas: [{ n: "Max", especie: "Perro", r: "Golden Retriever", edad: "5", peso: "29" }],
    ultimoTurno: "8 de mayo 2024",
  },
  {
    id: 3,
    nombre: "Laura Perez",
    tel: "341-555-0303",
    mail: "lperez@gmail.com",
    mascotas: [
      { n: "Michi", especie: "Gato", r: "Comun", edad: "3", peso: "4" },
      { n: "Nina", especie: "Gato", r: "Siames", edad: "1", peso: "3" },
    ],
    ultimoTurno: "8 de mayo 2024",
  },
  {
    id: 4,
    nombre: "Diego Fernandez",
    tel: "341-555-0404",
    mail: "diego.f@yahoo.com",
    mascotas: [{ n: "Rocky", especie: "Perro", r: "Bulldog Frances", edad: "6", peso: "13" }],
    ultimoTurno: "10 de mayo 2024",
  },
  {
    id: 5,
    nombre: "Sofia Lopez",
    tel: "341-555-0505",
    mail: "sofi.lopez@gmail.com",
    mascotas: [
      { n: "Toby", especie: "Perro", r: "Caniche", edad: "7", peso: "8" },
      { n: "Lola", especie: "Perro", r: "Beagle", edad: "2", peso: "11" },
    ],
    ultimoTurno: "6 de mayo 2024",
  },
];

const CLIENTE_FORM_INICIAL = {
  nombre: "",
  tel: "",
  mail: "",
  mascota: "",
  especie: "",
  raza: "",
  edad: "",
  peso: "",
};

const MASCOTA_FORM_INICIAL = {
  n: "",
  especie: "",
  r: "",
  edad: "",
  peso: "",
};

function initials(nombre) {
  return nombre.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

function formatMascota(mascota) {
  const especieRaza = [mascota.especie, mascota.r].filter(Boolean).join(" - ");
  const edad = mascota.edad ? `${mascota.edad} anios` : "Edad sin cargar";
  const peso = mascota.peso ? `${mascota.peso} kg` : "Peso sin cargar";
  return `${especieRaza || "Sin especie"} · ${edad} · ${peso}`;
}

export default function ClientesPanel() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const homePath = user?.rol === "super-admin" ? "/home_superadministrador" : "/home_administrador";
  const [clientes, setClientes] = useState(MOCK_CLIENTES);
  const [query, setQuery] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState(CLIENTE_FORM_INICIAL);
  const [agregandoMascotaId, setAgregandoMascotaId] = useState(null);
  const [mascotaForm, setMascotaForm] = useState(MASCOTA_FORM_INICIAL);

  const filtered = clientes.filter((c) => {
    const q = query.toLowerCase();
    return c.nombre.toLowerCase().includes(q) || c.mascotas.some((m) => m.n.toLowerCase().includes(q));
  });

  function toggleExpand(id) {
    setExpandedId((prev) => prev === id ? null : id);
    setAgregandoMascotaId(null);
  }

  function eliminar(id) {
    setClientes((prev) => prev.filter((c) => c.id !== id));
    if (expandedId === id) setExpandedId(null);
  }

  function guardar() {
    if (!form.nombre.trim() || !form.mascota.trim()) return;

    const nuevo = {
      id: Date.now(),
      nombre: form.nombre,
      tel: form.tel,
      mail: form.mail,
      mascotas: [
        {
          n: form.mascota,
          especie: form.especie,
          r: form.raza,
          edad: form.edad,
          peso: form.peso,
        },
      ],
      ultimoTurno: "-",
    };

    setClientes((prev) => [nuevo, ...prev]);
    setForm(CLIENTE_FORM_INICIAL);
    setFormOpen(false);
    setExpandedId(nuevo.id);
  }

  function abrirAgregarMascota(id) {
    setAgregandoMascotaId(id);
    setMascotaForm(MASCOTA_FORM_INICIAL);
  }

  function guardarMascota(id) {
    if (!mascotaForm.n.trim()) return;

    setClientes((prev) =>
      prev.map((cliente) =>
        cliente.id === id
          ? { ...cliente, mascotas: [...cliente.mascotas, mascotaForm] }
          : cliente
      )
    );
    setAgregandoMascotaId(null);
    setMascotaForm(MASCOTA_FORM_INICIAL);
  }

  return (
    <div className="cp-wrap">
      <div className="cp-topbar">
        <button className="cp-back" onClick={() => navigate(homePath)}>
          Volver al menu
        </button>
        <h1 className="cp-title">Nuestros clientes</h1>
      </div>

      <div className="cp-actions">
        <div className="cp-search-wrap">
          <span className="cp-search-icon">Buscar</span>
          <input
            className="cp-search"
            type="text"
            placeholder="Buscar por duenio o mascota"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <button className="cp-btn-nuevo" onClick={() => setFormOpen((v) => !v)}>
          + Nuevo cliente
        </button>
      </div>

      {formOpen && (
        <div className="cp-form-card">
          <p className="cp-form-title">Agregar nuevo cliente</p>
          <div className="cp-form-grid">
            <div className="cp-field">
              <label>Nombre del duenio</label>
              <input value={form.nombre} onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))} placeholder="Ej: Maria Garcia" />
            </div>
            <div className="cp-field">
              <label>Telefono</label>
              <input value={form.tel} onChange={(e) => setForm((f) => ({ ...f, tel: e.target.value }))} placeholder="Ej: 341-555-1234" />
            </div>
            <div className="cp-field cp-full">
              <label>Mail</label>
              <input value={form.mail} onChange={(e) => setForm((f) => ({ ...f, mail: e.target.value }))} placeholder="Ej: maria@gmail.com" />
            </div>
            <div className="cp-field">
              <label>Nombre de mascota</label>
              <input value={form.mascota} onChange={(e) => setForm((f) => ({ ...f, mascota: e.target.value }))} placeholder="Ej: Lola" />
            </div>
            <div className="cp-field">
              <label>Especie</label>
              <input value={form.especie} onChange={(e) => setForm((f) => ({ ...f, especie: e.target.value }))} placeholder="Ej: Perro" />
            </div>
            <div className="cp-field">
              <label>Raza</label>
              <input value={form.raza} onChange={(e) => setForm((f) => ({ ...f, raza: e.target.value }))} placeholder="Ej: Beagle" />
            </div>
            <div className="cp-field">
              <label>Edad</label>
              <input value={form.edad} onChange={(e) => setForm((f) => ({ ...f, edad: e.target.value }))} placeholder="Ej: 3" />
            </div>
            <div className="cp-field">
              <label>Peso</label>
              <input value={form.peso} onChange={(e) => setForm((f) => ({ ...f, peso: e.target.value }))} placeholder="Ej: 12" />
            </div>
          </div>
          <div className="cp-form-footer">
            <button className="cp-btn-cancelar" onClick={() => setFormOpen(false)}>Cancelar</button>
            <button className="cp-btn-guardar" onClick={guardar}>Guardar cliente</button>
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
                  <p className="cp-mascotas">{c.mascotas.map((m) => m.n).join(", ") || "Sin mascotas"}</p>
                </div>
                <span className={`cp-chevron ${isOpen ? "open" : ""}`}>v</span>
              </div>

              {isOpen && (
                <div className="cp-detail">
                  <div className="cp-detail-grid">
                    <div className="cp-detail-item">
                      <span className="cp-detail-label">Mail</span>
                      <span className="cp-detail-value">{c.mail || "-"}</span>
                    </div>
                    <div className="cp-detail-item">
                      <span className="cp-detail-label">Telefono</span>
                      <span className="cp-detail-value">{c.tel || "-"}</span>
                    </div>
                    <div className="cp-detail-item">
                      <span className="cp-detail-label">Ultimo turno</span>
                      <span className="cp-detail-value">{c.ultimoTurno}</span>
                    </div>
                  </div>

                  <div className="cp-mascotas-section">
                    <p className="cp-detail-label">Mascotas</p>
                    <div className="cp-chips">
                      {c.mascotas.length > 0
                        ? c.mascotas.map((m, i) => (
                          <span key={i} className="cp-chip">
                            {m.n} · {formatMascota(m)}
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
                          <input value={mascotaForm.n} onChange={(e) => setMascotaForm((f) => ({ ...f, n: e.target.value }))} placeholder="Ej: Mora" />
                        </div>
                        <div className="cp-field">
                          <label>Especie</label>
                          <input value={mascotaForm.especie} onChange={(e) => setMascotaForm((f) => ({ ...f, especie: e.target.value }))} placeholder="Ej: Gato" />
                        </div>
                        <div className="cp-field">
                          <label>Raza</label>
                          <input value={mascotaForm.r} onChange={(e) => setMascotaForm((f) => ({ ...f, r: e.target.value }))} placeholder="Ej: Comun" />
                        </div>
                        <div className="cp-field">
                          <label>Edad</label>
                          <input value={mascotaForm.edad} onChange={(e) => setMascotaForm((f) => ({ ...f, edad: e.target.value }))} placeholder="Ej: 2" />
                        </div>
                        <div className="cp-field">
                          <label>Peso</label>
                          <input value={mascotaForm.peso} onChange={(e) => setMascotaForm((f) => ({ ...f, peso: e.target.value }))} placeholder="Ej: 5" />
                        </div>
                      </div>
                      <div className="cp-form-footer">
                        <button className="cp-btn-cancelar" onClick={() => setAgregandoMascotaId(null)}>Cancelar</button>
                        <button className="cp-btn-guardar" onClick={() => guardarMascota(c.id)}>Guardar mascota</button>
                      </div>
                    </div>
                  )}

                  <div className="cp-detail-actions">
                    <button className="cp-btn-editar">Editar cliente</button>
                    <button className="cp-btn-editar" onClick={() => abrirAgregarMascota(c.id)}>Agregar mascota</button>
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
