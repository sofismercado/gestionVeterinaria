import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Sidebar from "./Sidebar";
import CalendarGrid from "./CalendarGrid";
import DayPanel from "./DayPanel";
import NuevoTurnoModal from "./NuevoTurnoModal";
import "./TurnosPanel.css";

const API_URL = "http://localhost:3000/api";

const MONTHS_GEN = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

const DAYS_LONG = [
  "domingo", "lunes", "martes", "miercoles", "jueves", "viernes", "sabado",
];

const getInitialDate = () => {
  const today = new Date();
  return {
    year: today.getFullYear(),
    month: today.getMonth(),
    day: today.getDate(),
  };
};

const toDateKey = ({ year, month, day }) => `${year}-${month + 1}-${day}`;

const formatDateKeyFromApi = (fecha) => {
  const [year, month, day] = fecha.split("-").map(Number);
  return `${year}-${month}-${day}`;
};

const formatTurno = (turno) => ({
  id: turno.id,
  fecha: turno.fecha,
  hora: turno.hora?.slice(0, 5),
  nombre: turno.mascota?.nombre || "Mascota",
  raza: [turno.mascota?.especie, turno.mascota?.raza].filter(Boolean).join(" - "),
  motivo: turno.motivo,
  estado: turno.estado,
  cliente: turno.cliente?.nombre,
});

function buildUpcomingDays(turnos) {
  const agrupadas = turnos.reduce((acc, turno) => {
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
}

export default function TurnosPanel() {
  const { token } = useAuth();
  const initialDate = useMemo(() => getInitialDate(), []);
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [currentMonth, setCurrentMonth] = useState({ year: initialDate.year, month: initialDate.month });
  const [modalOpen, setModalOpen] = useState(false);
  const [turnos, setTurnos] = useState([]);
  const [error, setError] = useState("");

  const cargarDatos = async () => {
    try {
      setError("");
      const turnosResponse = await fetch(`${API_URL}/turnos`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const turnosData = await turnosResponse.json();

      if (!turnosResponse.ok) {
        setError(turnosData.mensaje || "No se pudieron cargar los turnos.");
        return;
      }

      setTurnos(turnosData);
    } catch (err) {
      setError("No se pudo conectar con el servidor.");
    }
  };

  useEffect(() => {
    if (token) cargarDatos();
  }, [token]);

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
  };

  const handleSelectUpcomingDay = ({ key }) => {
    const [year, month, day] = key.split("-").map(Number);
    setCurrentMonth({ year, month: month - 1 });
    setSelectedDate({ year, month: month - 1, day });
  };

  const selectedKey = toDateKey(selectedDate);
  const turnosDelDia = turnos
    .filter((turno) =>
      formatDateKeyFromApi(turno.fecha) === selectedKey &&
      turno.estado !== "disponible" &&
      turno.estado !== "sin_atencion"
    )
    .map(formatTurno);

  const turnosSolicitados = turnos
    .filter((turno) => turno.estado === "pendiente")
    .sort((a, b) => `${a.fecha} ${a.hora || ""}`.localeCompare(`${b.fecha} ${b.hora || ""}`))
    .map(formatTurno);

  const horariosDelDia = turnos.filter((turno) =>
    formatDateKeyFromApi(turno.fecha) === selectedKey &&
    turno.hora &&
    turno.estado !== "sin_atencion"
  );
  const horariosDisponiblesDelDia = horariosDelDia.filter((turno) => turno.estado === "disponible");
  const diaNoAtencionSeleccionado = turnos.find((turno) =>
    formatDateKeyFromApi(turno.fecha) === selectedKey &&
    turno.estado === "sin_atencion"
  );

  const upcomingDays = buildUpcomingDays(turnos);
  const dots = turnos.reduce((acc, turno) => {
    const key = formatDateKeyFromApi(turno.fecha);

    if (turno.estado === "sin_atencion") {
      acc[key] = "gray";
      return acc;
    }

    const horariosDeEseDia = turnos.filter((t) =>
      formatDateKeyFromApi(t.fecha) === key &&
      t.hora &&
      t.estado !== "sin_atencion"
    );
    const disponibles = horariosDeEseDia.filter((t) => t.estado === "disponible").length;

    if (horariosDeEseDia.length > 0 && disponibles === 0) {
      acc[key] = "red";
    } else if (disponibles > 0 && disponibles <= 2) {
      acc[key] = "yellow";
    } else if (disponibles > 2) {
      acc[key] = "green";
    }

    return acc;
  }, {});

  const actualizarEstadoTurno = async (turnoId, estado) => {
    try {
      setError("");
      const response = await fetch(`${API_URL}/turnos/${turnoId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ estado }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.mensaje || "No se pudo actualizar el turno.");
        return;
      }

      await cargarDatos();
    } catch (err) {
      setError("No se pudo conectar con el servidor.");
    }
  };

  const eliminarTurno = async (turnoId) => {
    try {
      setError("");
      const response = await fetch(`${API_URL}/turnos/${turnoId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.mensaje || "No se pudo borrar el turno.");
        return;
      }

      await cargarDatos();
    } catch (err) {
      setError("No se pudo conectar con el servidor.");
    }
  };

  return (
    <div className="turnos-panel">
      <Sidebar onNuevoTurno={() => setModalOpen(true)} />
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
      <DayPanel
        selectedDate={selectedDate}
        turnos={turnosDelDia}
        turnosSolicitados={turnosSolicitados}
        horarios={horariosDisponiblesDelDia}
        diaNoAtencion={diaNoAtencionSeleccionado}
        error={error}
        onActualizarEstado={actualizarEstadoTurno}
        onEliminarTurno={eliminarTurno}
      />
      {modalOpen && (
        <NuevoTurnoModal
          selectedDate={selectedDate}
          horariosDelDia={horariosDelDia}
          diaNoAtencion={diaNoAtencionSeleccionado}
          onClose={() => setModalOpen(false)}
          onSaved={cargarDatos}
        />
      )}
    </div>
  );
}
