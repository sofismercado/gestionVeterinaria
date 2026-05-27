import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./ClientesPanel.css";

const MOCK_CLIENTES = [
  { id:1, nombre:"Carlos Rodríguez", tel:"341-555-0101", mail:"carlos.r@gmail.com", mascotas:[{n:"Luna",r:"Perra - Labrador"},{n:"Simba",r:"Gato - Maine Coon"}], ultimoTurno:"8 de mayo 2024" },
  { id:2, nombre:"Ana Martínez", tel:"341-555-0202", mail:"ana.m@hotmail.com", mascotas:[{n:"Max",r:"Perro - Golden Retriever"}], ultimoTurno:"8 de mayo 2024" },
  { id:3, nombre:"Laura Pérez", tel:"341-555-0303", mail:"lperez@gmail.com", mascotas:[{n:"Michi",r:"Gato - Común"},{n:"Nina",r:"Gata - Siames"}], ultimoTurno:"8 de mayo 2024" },
  { id:4, nombre:"Diego Fernández", tel:"341-555-0404", mail:"diego.f@yahoo.com", mascotas:[{n:"Rocky",r:"Perro - Bulldog Francés"}], ultimoTurno:"10 de mayo 2024" },
  { id:5, nombre:"Sofía López", tel:"341-555-0505", mail:"sofi.lopez@gmail.com", mascotas:[{n:"Toby",r:"Perro - Caniche"},{n:"Lola",r:"Perra - Beagle"}], ultimoTurno:"6 de mayo 2024" },
];

function initials(nombre) {
  return nombre.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase();
}

export default function ClientesPanel() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const homePath = user?.rol === "super-admin" ? "/home_superadministrador" : "/home_administrador";
  const [clientes, setClientes] = useState(MOCK_CLIENTES);
  const [query, setQuery] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState({ nombre:"", tel:"", mail:"", mascota:"", raza:"" });

  const filtered = clientes.filter(c => {
    const q = query.toLowerCase();
    return c.nombre.toLowerCase().includes(q) || c.mascotas.some(m => m.n.toLowerCase().includes(q));
  });

  function toggleExpand(id) {
    setExpandedId(prev => prev === id ? null : id);
  }

  function eliminar(id) {
    setClientes(prev => prev.filter(c => c.id !== id));
    if (expandedId === id) setExpandedId(null);
  }

  function guardar() {
    if (!form.nombre.trim()) return;
    const nuevo = {
      id: Date.now(),
      nombre: form.nombre,
      tel: form.tel,
      mail: form.mail,
      mascotas: form.mascota ? [{ n: form.mascota, r: form.raza || "–" }] : [],
      ultimoTurno: "–",
    };
    setClientes(prev => [nuevo, ...prev]);
    setForm({ nombre:"", tel:"", mail:"", mascota:"", raza:"" });
    setFormOpen(false);
    setExpandedId(nuevo.id);
  }

  return (
    <div className="cp-wrap">
      <div className="cp-topbar">
        <button className="cp-back" onClick={() => navigate(homePath)}>
          ← Volver al menú
        </button>
        <h1 className="cp-title">Nuestros clientes</h1>
      </div>

      <div className="cp-actions">
        <div className="cp-search-wrap">
          <span className="cp-search-icon">🔍</span>
          <input
            className="cp-search"
            type="text"
            placeholder="Buscar por dueño o mascota…"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>
        <button className="cp-btn-nuevo" onClick={() => setFormOpen(v => !v)}>
          + Nuevo cliente
        </button>
      </div>

      {formOpen && (
        <div className="cp-form-card">
          <p className="cp-form-title">Agregar nuevo cliente</p>
          <div className="cp-form-grid">
            <div className="cp-field">
              <label>Nombre del dueño</label>
              <input value={form.nombre} onChange={e => setForm(f=>({...f,nombre:e.target.value}))} placeholder="Ej: María García" />
            </div>
            <div className="cp-field">
              <label>Teléfono</label>
              <input value={form.tel} onChange={e => setForm(f=>({...f,tel:e.target.value}))} placeholder="Ej: 341-555-1234" />
            </div>
            <div className="cp-field cp-full">
              <label>Mail</label>
              <input value={form.mail} onChange={e => setForm(f=>({...f,mail:e.target.value}))} placeholder="Ej: maria@gmail.com" />
            </div>
            <div className="cp-field">
              <label>Mascota</label>
              <input value={form.mascota} onChange={e => setForm(f=>({...f,mascota:e.target.value}))} placeholder="Ej: Lola" />
            </div>
            <div className="cp-field">
              <label>Raza</label>
              <input value={form.raza} onChange={e => setForm(f=>({...f,raza:e.target.value}))} placeholder="Ej: Perra - Beagle" />
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
        filtered.map(c => {
          const isOpen = expandedId === c.id;
          return (
            <div key={c.id} className="cp-card">
              <div className="cp-row" onClick={() => toggleExpand(c.id)}>
                <div className="cp-avatar">{initials(c.nombre)}</div>
                <div className="cp-info">
                  <p className="cp-nombre">{c.nombre}</p>
                  <p className="cp-mascotas">🐾 {c.mascotas.map(m=>m.n).join(", ") || "Sin mascotas"}</p>
                </div>
                <span className={`cp-chevron ${isOpen ? "open" : ""}`}>▾</span>
              </div>

              {isOpen && (
                <div className="cp-detail">
                  <div className="cp-detail-grid">
                    <div className="cp-detail-item">
                      <span className="cp-detail-label">Mail</span>
                      <span className="cp-detail-value">{c.mail || "–"}</span>
                    </div>
                    <div className="cp-detail-item">
                      <span className="cp-detail-label">Teléfono</span>
                      <span className="cp-detail-value">{c.tel || "–"}</span>
                    </div>
                    <div className="cp-detail-item">
                      <span className="cp-detail-label">Último turno</span>
                      <span className="cp-detail-value">{c.ultimoTurno}</span>
                    </div>
                  </div>
                  <div className="cp-mascotas-section">
                    <p className="cp-detail-label">Mascotas</p>
                    <div className="cp-chips">
                      {c.mascotas.length > 0
                        ? c.mascotas.map((m,i) => <span key={i} className="cp-chip">🐾 {m.n} · {m.r}</span>)
                        : <span className="cp-sin-mascotas">Sin mascotas registradas</span>
                      }
                    </div>
                  </div>
                  <div className="cp-detail-actions">
                    <button className="cp-btn-editar">✏️ Editar</button>
                    <button className="cp-btn-eliminar" onClick={() => eliminar(c.id)}>🗑 Eliminar</button>
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
