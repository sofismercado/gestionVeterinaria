import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import "./NuevoTurnoModal.css";

const API_URL = "http://localhost:3000/api";
const DAYS_LONG = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"];
const MONTHS_GEN = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
const ALL_SLOTS = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"];

function formatDate({ year, month, day }) {
  const date = new Date(year, month, day);
  const dow = date.getDay();
  const dowIdx = dow === 0 ? 6 : dow - 1;
  const dowStr = DAYS_LONG[dowIdx];
  return `${dowStr.charAt(0).toUpperCase() + dowStr.slice(1)} ${day} de ${MONTHS_GEN[month]}`;
}

function toApiDate({ year, month, day }) {
  const monthText = String(month + 1).padStart(2, "0");
  const dayText = String(day).padStart(2, "0");
  return `${year}-${monthText}-${dayText}`;
}

export default function NuevoTurnoModal({ selectedDate, horariosDelDia = [], diaNoAtencion, onClose, onSaved }) {
  const { token } = useAuth();
  const [horario, setHorario] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const horariosYaHabilitados = new Set(horariosDelDia.map((d) => d.hora?.slice(0, 5)));
  const puedeConfirmar = horario && !loading;
  const fecha = toApiDate(selectedDate);

  async function handleConfirmar() {
    if (!horario) return;

    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/turnos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fecha: toApiDate(selectedDate),
          hora: horario,
          estado: "disponible",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.mensaje || "No se pudo habilitar el horario.");
        return;
      }

      await onSaved?.();
      onClose();
    } catch (err) {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSinAtencion() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/turnos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fecha,
          hora: null,
          estado: "sin_atencion",
          motivo: "Sin atencion",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.mensaje || "No se pudo marcar el dia sin atencion.");
        return;
      }

      await onSaved?.();
      onClose();
    } catch (err) {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div className="modal-header">
          <div>
            <h2 className="modal-title">Habilitar turno</h2>
            <p className="modal-subtitle">{formatDate(selectedDate)}</p>
          </div>
          <button className="modal-close" onClick={onClose}>x</button>
        </div>

        <div className="modal-body">
          {diaNoAtencion && <p className="sin-horarios">Este dia ya esta marcado sin atencion.</p>}
          <div className="field">
            <label>Horario a habilitar</label>
            <div className="time-slots">
              {ALL_SLOTS.map((slot) => {
                const habilitado = horariosYaHabilitados.has(slot);
                return (
                  <button
                    key={slot}
                    className={`slot ${habilitado ? "slot-taken" : ""} ${horario === slot ? "slot-selected" : ""}`}
                    disabled={habilitado || Boolean(diaNoAtencion)}
                    onClick={() => setHorario(slot)}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
          </div>
          {error && <p className="sin-horarios">{error}</p>}
        </div>

        <div className="modal-footer">
          <button className="btn-cancelar" onClick={onClose}>Cancelar</button>
          <button className="btn-cancelar" disabled={loading || Boolean(diaNoAtencion)} onClick={handleSinAtencion}>
            Marcar sin atencion
          </button>
          <button className="btn-confirmar" disabled={!puedeConfirmar || Boolean(diaNoAtencion)} onClick={handleConfirmar}>
            {loading ? "Guardando..." : "Habilitar horario"}
          </button>
        </div>
      </div>
    </div>
  );
}
