import "./Sidebar.css";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div>
        <p className="sidebar-title">Turnos asignados</p>
        <div className="sidebar-buttons">
          <button className="sidebar-btn active">
            <CalendarIcon />
            Calendario
          </button>
          <button className="sidebar-btn">
            <PlusIcon />
            Nuevo turno
          </button>
        </div>
      </div>

      <div className="legend">
        <p className="legend-title">Referencias del calendario</p>
        <div className="legend-item"><span className="dot dot-green" /> Día con turnos disponibles</div>
        <div className="legend-item"><span className="dot dot-yellow" /> Día con pocos turnos disponibles</div>
        <div className="legend-item"><span className="dot dot-red" /> Sin turnos disponibles</div>
        <div className="legend-item"><span className="dot dot-gray" /> Día sin atención</div>
      </div>
    </aside>
  );
}

function CalendarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="16" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  );
}