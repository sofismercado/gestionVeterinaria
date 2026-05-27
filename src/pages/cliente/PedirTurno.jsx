import { useMemo, useState } from "react";
import NavbarCliente from "../../components/NavbarCliente";
import CalendarGrid from "../administrador/CalendarGrid";
import "./PedirTurno.css";

const mascotasMock = [
  { id: 1, nombre: "Luna" },
  { id: 2, nombre: "Michi" },
  { id: 3, nombre: "Toby" },
];

const disponibilidadMock = {
  "2026-5-25": ["09:00", "10:30", "12:00", "16:00"],
  "2026-5-26": ["08:30", "11:00", "15:30"],
  "2026-5-28": ["09:00", "10:00", "14:00", "17:00"],
  "2026-6-2": ["09:30", "13:00", "16:30"],
  "2026-6-4": ["08:00", "12:30", "18:00"],
};

const MONTHS_GEN = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

const DAYS_LONG = [
  "domingo", "lunes", "martes", "miercoles", "jueves", "viernes", "sabado",
];

const getDateKey = ({ year, month, day }) => `${year}-${month + 1}-${day}`;

const formatSelectedDate = ({ year, month, day }) => {
  const date = new Date(year, month, day);
  const dayName = DAYS_LONG[date.getDay()];
  return `${dayName.charAt(0).toUpperCase() + dayName.slice(1)} ${day} de ${MONTHS_GEN[month]}`;
};

const getDots = () => {
  return Object.entries(disponibilidadMock).reduce((acc, [key, horarios]) => {
    acc[key] = horarios.length >= 4 ? "green" : "yellow";
    return acc;
  }, {});
};

const getUpcomingDays = () => {
  return Object.entries(disponibilidadMock).map(([key, horarios]) => {
    const [year, month, day] = key.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    const dow = DAYS_LONG[date.getDay()];

    return {
      key,
      dow: dow.charAt(0).toUpperCase() + dow.slice(1),
      date: `${day} de ${MONTHS_GEN[month - 1]}`,
      avail: horarios.length,
      color: horarios.length >= 4 ? "green" : "yellow",
    };
  });
};

function PedirTurno() {
  const [selectedDate, setSelectedDate] = useState({ year: 2026, month: 4, day: 25 });
  const [currentMonth, setCurrentMonth] = useState({ year: 2026, month: 4 });
  const [mascotaId, setMascotaId] = useState("");
  const [horario, setHorario] = useState("");
  const [motivo, setMotivo] = useState("");
  const [confirmado, setConfirmado] = useState(false);

  const dots = useMemo(() => getDots(), []);
  const upcomingDays = useMemo(() => getUpcomingDays(), []);
  const selectedKey = getDateKey(selectedDate);
  const horariosDisponibles = disponibilidadMock[selectedKey] || [];

  const handlePrevMonth = () => {
    setCurrentMonth((prev) => {
      if (prev.month === 0) return { year: prev.year - 1, month: 11 };
      return { ...prev, month: prev.month - 1 };
    });
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => {
      if (prev.month === 11) return { year: prev.year + 1, month: 0 };
      return { ...prev, month: prev.month + 1 };
    });
  };

  const handleSelectDay = (day) => {
    setSelectedDate({ year: currentMonth.year, month: currentMonth.month, day });
    setHorario("");
    setConfirmado(false);
  };

  const handleSelectUpcomingDay = ({ key }) => {
    const [year, month, day] = key.split("-").map(Number);
    setCurrentMonth({ year, month: month - 1 });
    setSelectedDate({ year, month: month - 1, day });
    setHorario("");
    setConfirmado(false);
  };

  const handleConfirmar = (event) => {
    event.preventDefault();
    setConfirmado(true);
  };

  const puedeConfirmar = mascotaId && horario && motivo.trim().length > 2;

  return (
    <div className="contenedor-padre">
      <NavbarCliente />

      <main className="pedir-turno-main">
        <CalendarGrid
          currentMonth={currentMonth}
          selectedDate={selectedDate}
          dots={dots}
          upcomingDays={upcomingDays}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          onSelectDay={handleSelectDay}
          onSelectUpcomingDay={handleSelectUpcomingDay}
        />

        <form className="pedir-turno-panel" onSubmit={handleConfirmar}>
          <div>
            <h2 className="pedir-turno-title">Pedir turno</h2>
            <p className="pedir-turno-subtitle">Elegi dia, horario y mascota.</p>
          </div>

          <div className="pedir-turno-date">{formatSelectedDate(selectedDate)}</div>

          <div className="pedir-turno-field">
            <label htmlFor="mascota">Mascota</label>
            <select
              id="mascota"
              value={mascotaId}
              onChange={(event) => {
                setMascotaId(event.target.value);
                setConfirmado(false);
              }}
            >
              <option value="">Seleccionar mascota</option>
              {mascotasMock.map((mascota) => (
                <option key={mascota.id} value={mascota.id}>
                  {mascota.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="pedir-turno-field">
            <label>Horarios disponibles</label>
            {horariosDisponibles.length === 0 ? (
              <p className="pedir-turno-subtitle">No hay horarios para este dia.</p>
            ) : (
              <div className="horarios-grid">
                {horariosDisponibles.map((hora) => (
                  <button
                    key={hora}
                    className={`horario-btn ${horario === hora ? "selected" : ""}`}
                    type="button"
                    onClick={() => {
                      setHorario(hora);
                      setConfirmado(false);
                    }}
                  >
                    {hora}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="pedir-turno-field">
            <label htmlFor="motivo">Motivo</label>
            <textarea
              id="motivo"
              value={motivo}
              placeholder="Ej: control general, vacunacion, consulta..."
              onChange={(event) => {
                setMotivo(event.target.value);
                setConfirmado(false);
              }}
            />
          </div>

          {confirmado && (
            <div className="turno-confirmado">
              Turno solicitado para el {formatSelectedDate(selectedDate)} a las {horario} hs.
            </div>
          )}

          <button className="confirmar-turno-btn" type="submit" disabled={!puedeConfirmar}>
            Confirmar turno
          </button>
        </form>
      </main>
    </div>
  );
}

export default PedirTurno;
