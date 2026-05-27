import "./DayPanel.css";

const DAYS_LONG = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"];
const MONTHS_GEN = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

function formatDate({ year, month, day }) {
  const date = new Date(year, month, day);
  const dow = date.getDay();
  const dowIdx = dow === 0 ? 6 : dow - 1;
  const dowStr = DAYS_LONG[dowIdx];
  return `${dowStr.charAt(0).toUpperCase() + dowStr.slice(1)} ${day} de ${MONTHS_GEN[month]}`;
}

export default function DayPanel({ selectedDate, turnos, horarios = [], diaNoAtencion, error, onActualizarEstado, onEliminarTurno }) {
  return (
    <aside className="day-panel">
      <div className="panel-header">
        <span className="panel-date">{formatDate(selectedDate)}</span>
        <span className={`panel-badge ${turnos.length > 0 ? "badge-green" : "badge-gray"}`}>
          {diaNoAtencion ? "Sin atencion" : turnos.length > 0 ? `${turnos.length} turnos pedidos` : `${horarios.length} horarios habilitados`}
        </span>
      </div>

      <div className="turno-list">
        {diaNoAtencion && (
          <div className="turno-item">
            <div className="turno-info">
              <p className="turno-nombre">Día marcado sin atencion</p>
              <p className="turno-motivo">{diaNoAtencion.motivo || "Sin atencion"}</p>
            </div>
            <button className="ver-btn danger" onClick={() => onEliminarTurno(diaNoAtencion.id)}>Borrar</button>
          </div>
        )}

        {error ? (
          <p className="turno-empty">{error}</p>
        ) : !diaNoAtencion && turnos.length === 0 ? (
          <p className="turno-empty">No hay turnos pedidos para este día</p>
        ) : !diaNoAtencion && (
          turnos.map((t) => (
            <div key={t.id} className="turno-item">
              <span className="turno-hora">{t.hora}</span>
              <div className="turno-info">
                <p className="turno-nombre">{t.nombre}</p>
                <p className="turno-raza">{t.raza}</p>
                <p className="turno-motivo">{t.motivo}</p>
                <p className="turno-motivo">Cliente: {t.cliente || "-"}</p>
                <p className="turno-motivo">Estado: {t.estado}</p>
              </div>
              {t.estado === "pendiente" ? (
                <div className="usuario-actions">
                  <button className="ver-btn" onClick={() => onActualizarEstado(t.id, "confirmado")}>Aceptar</button>
                  <button className="ver-btn" onClick={() => onActualizarEstado(t.id, "disponible")}>Rechazar</button>
                  <button className="ver-btn danger" onClick={() => onEliminarTurno(t.id)}>Borrar</button>
                </div>
              ) : (
                <button className="ver-btn danger" onClick={() => onEliminarTurno(t.id)}>Borrar</button>
              )}
            </div>
          ))
        )}

        {!diaNoAtencion && horarios.length > 0 && (
          <>
            <p className="turno-empty">Horarios habilitados</p>
            {horarios.map((d) => (
              <div key={d.id} className="turno-item">
                <span className="turno-hora">{d.hora?.slice(0, 5)}</span>
                <div className="turno-info">
                  <p className="turno-nombre">{d.estado}</p>
                </div>
                <button className="ver-btn danger" onClick={() => onEliminarTurno(d.id)}>Borrar</button>
              </div>
            ))}
          </>
        )}
      </div>
    </aside>
  );
}
