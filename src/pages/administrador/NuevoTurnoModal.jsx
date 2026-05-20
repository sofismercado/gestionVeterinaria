import "./NuevoTurnoModal.css";
import { useState } from "react";
const DAYS_LONG = ["lunes","martes","miércoles","jueves","viernes","sábado","domingo"];
const MONTHS_GEN = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
const ALL_SLOTS = ["08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00"];

function formatDate({ year, month, day }) {
  const date = new Date(year, month, day);
  const dow = date.getDay();
  const dowIdx = dow === 0 ? 6 : dow - 1;
  const dowStr = DAYS_LONG[dowIdx];
  return `${dowStr.charAt(0).toUpperCase() + dowStr.slice(1)} ${day} de ${MONTHS_GEN[month]}`;
}

export default function NuevoTurnoModal({ selectedDate, turnosDelDia, onClose }) {
  const [mascota, setMascota] = useState("");
  const [motivo, setMotivo] = useState("");
  const [horario, setHorario] = useState(null);

  const horariosOcupados = new Set(turnosDelDia.map(t => t.hora));
  const hayDisponibilidad = ALL_SLOTS.some(s => !horariosOcupados.has(s));
  const puedeConfirmar = mascota && motivo && horario;

  function handleConfirmar() {
    // Acá después conectás con tu backend/base de datos
    alert(`Turno confirmado:\n${formatDate(selectedDate)} a las ${horario}\nMascota: ${mascota}\nMotivo: ${motivo}`);
    onClose();
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div className="modal-header">
          <div>
            <h2 className="modal-title">Nuevo turno</h2>
            <p className="modal-subtitle">{formatDate(selectedDate)}</p>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          {!hayDisponibilidad ? (
            <p className="sin-disponibilidad">No hay horarios disponibles para este día.</p>
          ) : (
            <>
              <div className="field">
                <label>Mascota</label>
                <select value={mascota} onChange={e => setMascota(e.target.value)}>
                  <option value="">Seleccioná una mascota</option>
                  <option>Luna – Perro Labrador</option>
                  <option>Michi – Gato Común</option>
                  <option>Nina – Gata Siames</option>
                </select>
              </div>

              <div className="field">
                <label>Motivo de consulta</label>
                <select value={motivo} onChange={e => setMotivo(e.target.value)}>
                  <option value="">Seleccioná el motivo</option>
                  <option>Consulta general</option>
                  <option>Vacunación</option>
                  <option>Control anual</option>
                  <option>Desparasitación</option>
                  <option>Urgencia</option>
                </select>
              </div>

              <div className="field">
                <label>Horario disponible</label>
                <div className="time-slots">
                  {ALL_SLOTS.map(slot => {
                    const ocupado = horariosOcupados.has(slot);
                    return (
                      <button
                        key={slot}
                        className={`slot ${ocupado ? "slot-taken" : ""} ${horario === slot ? "slot-selected" : ""}`}
                        disabled={ocupado}
                        onClick={() => setHorario(slot)}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-cancelar" onClick={onClose}>Cancelar</button>
          <button className="btn-confirmar" disabled={!puedeConfirmar} onClick={handleConfirmar}>
            Confirmar turno
          </button>
        </div>
      </div>
    </div>
  );
}