import "./DayPanel.css";

const DAYS_LONG = ["lunes","martes","miércoles","jueves","viernes","sábado","domingo"];
const MONTHS_GEN = [
  "enero","febrero","marzo","abril","mayo","junio",
  "julio","agosto","septiembre","octubre","noviembre","diciembre",
];

function formatDate({ year, month, day }) {
  const date = new Date(year, month, day);
  const dow = date.getDay();
  const dowIdx = dow === 0 ? 6 : dow - 1;
  const dowStr = DAYS_LONG[dowIdx];
  return `${dowStr.charAt(0).toUpperCase() + dowStr.slice(1)} ${day} de ${MONTHS_GEN[month]}`;
}

export default function DayPanel({ selectedDate, turnos }) {
  return (
    <aside className="day-panel">
      <div className="panel-header">
        <span className="panel-date">{formatDate(selectedDate)}</span>
        <span className={`panel-badge ${turnos.length > 0 ? "badge-green" : "badge-gray"}`}>
          {turnos.length > 0 ? `${turnos.length} turnos disponibles` : "Sin turnos"}
        </span>
      </div>

      <div className="turno-list">
        {turnos.length === 0 ? (
          <p className="turno-empty">No hay turnos para este día</p>
        ) : (
          turnos.map((t, i) => (
            <div key={i} className="turno-item">
              <span className="turno-hora">{t.hora}</span>
              <div className="turno-info">
                <p className="turno-nombre">{t.nombre} 🐾</p>
                <p className="turno-raza">{t.raza}</p>
                <p className="turno-motivo">{t.motivo}</p>
              </div>
              <button className="ver-btn">Ver</button>
            </div>
          ))
        )}
      </div>

      <button className="ver-todos-btn">Ver todos los turnos del día</button>
    </aside>
  );
}