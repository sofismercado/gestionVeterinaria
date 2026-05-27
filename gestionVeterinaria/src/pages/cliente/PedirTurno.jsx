import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import NavbarCliente from "../../components/NavbarCliente";
import { useAuth } from "../../context/AuthContext";
import CalendarGrid from "../administrador/CalendarGrid";
import "./PedirTurno.css";

const API_URL = "http://localhost:3000/api";

const MONTHS_GEN = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

const DAYS_LONG = [
  "domingo", "lunes", "martes", "miercoles", "jueves", "viernes", "sabado",
];

const toDateKey = ({ year, month, day }) => `${year}-${month + 1}-${day}`;

const toApiDate = ({ year, month, day }) => {
  const monthText = String(month + 1).padStart(2, "0");
  const dayText = String(day).padStart(2, "0");
  return `${year}-${monthText}-${dayText}`;
};

const formatSelectedDate = ({ year, month, day }) => {
  const date = new Date(year, month, day);
  const dayName = DAYS_LONG[date.getDay()];
  return `${dayName.charAt(0).toUpperCase() + dayName.slice(1)} ${day} de ${MONTHS_GEN[month]}`;
};

const getInitialDate = () => {
  const today = new Date();
  return {
    year: today.getFullYear(),
    month: today.getMonth(),
    day: today.getDate(),
  };
};

const getDots = (upcomingDays) => {
  return upcomingDays.reduce((acc, day) => {
    acc[day.key] = day.color;
    return acc;
  }, {});
};

function PedirTurno() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const reprogramarTurnoId = searchParams.get("reprogramar");
  const initialDate = useMemo(() => getInitialDate(), []);
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [currentMonth, setCurrentMonth] = useState({ year: initialDate.year, month: initialDate.month });
  const [mascotas, setMascotas] = useState([]);
  const [turnosDisponibles, setTurnosDisponibles] = useState([]);
  const [mascotaId, setMascotaId] = useState("");
  const [horario, setHorario] = useState("");
  const [motivo, setMotivo] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const upcomingDays = useMemo(() => {
    const agrupadas = turnosDisponibles.reduce((acc, turno) => {
      if (turno.estado !== "disponible") return acc;
      const [year, month, day] = turno.fecha.split("-").map(Number);
      const key = `${year}-${month}-${day}`;
      const date = new Date(year, month - 1, day);
      const dow = DAYS_LONG[date.getDay()];

      if (!acc[key]) {
        acc[key] = {
          key,
          dow: dow.charAt(0).toUpperCase() + dow.slice(1),
          date: `${day} de ${MONTHS_GEN[month - 1]}`,
          avail: 0,
          color: "green",
        };
      }

      acc[key].avail += 1;
      acc[key].color = acc[key].avail <= 2 ? "yellow" : "green";
      return acc;
    }, {});

    return Object.values(agrupadas);
  }, [turnosDisponibles]);
  const dots = useMemo(() => getDots(upcomingDays), [upcomingDays]);
  const horariosDisponibles = turnosDisponibles
    .filter((turno) =>
      turno.estado === "disponible" &&
      turno.fecha === toApiDate(selectedDate)
    )
    .map((turno) => ({
      id: turno.id,
      hora: turno.hora.slice(0, 5),
    }));

  useEffect(() => {
    async function cargarDatos() {
      try {
        setLoading(true);
        setError("");

        const [mascotasResponse, turnosResponse] = await Promise.all([
          fetch(`${API_URL}/mascotas`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch(`${API_URL}/turnos?estado=disponible`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        const mascotasData = await mascotasResponse.json();
        const turnosData = await turnosResponse.json();

        if (!mascotasResponse.ok) {
          setError(mascotasData.mensaje || "No se pudieron cargar tus mascotas.");
          return;
        }

        if (!turnosResponse.ok) {
          setError(turnosData.mensaje || "No se pudieron cargar los horarios.");
          return;
        }

        setMascotas(mascotasData);
        setTurnosDisponibles(turnosData);
      } catch (err) {
        setError("No se pudo conectar con el servidor.");
      } finally {
        setLoading(false);
      }
    }

    if (token) cargarDatos();
  }, [token]);

  const cargarTurnosDisponibles = async () => {
    try {
      const response = await fetch(`${API_URL}/turnos?estado=disponible`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      const data = await response.json();
      if (response.ok) setTurnosDisponibles(data);
    } catch (err) {
      setError("No se pudieron actualizar los horarios.");
    }
  };

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
    setMensaje("");
    setError("");
  };

  const handleSelectUpcomingDay = ({ key }) => {
    const [year, month, day] = key.split("-").map(Number);
    setCurrentMonth({ year, month: month - 1 });
    setSelectedDate({ year, month: month - 1, day });
    setHorario("");
    setMensaje("");
    setError("");
  };

  const handleConfirmar = async (event) => {
    event.preventDefault();

    if (!mascotaId || !horario || motivo.trim().length < 3) {
      setError("Selecciona mascota, horario y escribi el motivo.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMensaje("");

      const turnoSeleccionado = horariosDisponibles.find((turno) => turno.hora === horario);

      if (!turnoSeleccionado) {
        setError("Ese horario ya no esta disponible.");
        return;
      }

      const response = await fetch(`${API_URL}/turnos/${turnoSeleccionado.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          motivo,
          mascotaId: Number(mascotaId),
          estado: "pendiente",
          reprogramarTurnoId: reprogramarTurnoId ? Number(reprogramarTurnoId) : null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.mensaje || "No se pudo solicitar el turno.");
        return;
      }

      setMensaje(`${reprogramarTurnoId ? "Turno reprogramado" : "Turno solicitado"} para el ${formatSelectedDate(selectedDate)} a las ${horario} hs.`);
      setHorario("");
      setMotivo("");
      await cargarTurnosDisponibles();
      if (reprogramarTurnoId) {
        navigate("/mis-turnos");
      }
    } catch (err) {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  const puedeConfirmar = mascotaId && horario && motivo.trim().length > 2 && !loading;

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
            <h2 className="pedir-turno-title">{reprogramarTurnoId ? "Reprogramar turno" : "Pedir turno"}</h2>
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
                setMensaje("");
              }}
            >
              <option value="">Seleccionar mascota</option>
              {mascotas.map((mascota) => (
                <option key={mascota.id} value={mascota.id}>
                  {mascota.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="pedir-turno-field">
            <label>Horarios disponibles</label>
            {horariosDisponibles.length === 0 ? (
              <p className="pedir-turno-subtitle">No hay horarios habilitados para este dia.</p>
            ) : (
              <div className="horarios-grid">
              {horariosDisponibles.map(({ id, hora }) => (
                <button
                  key={id}
                  className={`horario-btn ${horario === hora ? "selected" : ""}`}
                  type="button"
                  onClick={() => {
                    setHorario(hora);
                    setMensaje("");
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
                setMensaje("");
              }}
            />
          </div>

          {error && <div className="turno-confirmado">{error}</div>}
          {mensaje && <div className="turno-confirmado">{mensaje}</div>}

          <button className="confirmar-turno-btn" type="submit" disabled={!puedeConfirmar}>
            {loading ? "Solicitando..." : "Confirmar turno"}
          </button>
        </form>
      </main>
    </div>
  );
}

export default PedirTurno;
