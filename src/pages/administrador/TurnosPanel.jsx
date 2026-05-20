import { useState } from "react";
import Sidebar from "./Sidebar";
import CalendarGrid from "./CalendarGrid";
import DayPanel from "./DayPanel";

import "./TurnosPanel.css";
import NuevoTurnoModal from "./NuevoTurnoModal";
//aca estan cargados los datos sin base de datos
// ─── Mock Data ───────────────────────────────────────────────
export const MOCK_DOTS = {
  "2024-5-1": "green",  "2024-5-3": "yellow", "2024-5-6": "green",
  "2024-5-8": "green",  "2024-5-10": "green", "2024-5-13": "yellow",
  "2024-5-15": "green", "2024-5-17": "yellow","2024-5-22": "yellow",
  "2024-5-24": "green", "2024-5-27": "red",   "2024-5-29": "green",
};

export const MOCK_TURNOS = {
  "2024-5-8": [
    { hora: "08:00", nombre: "Luna",   raza: "Perro - Labrador",        motivo: "Consulta general" },
    { hora: "09:00", nombre: "Max",    raza: "Perro - Golden Retriever", motivo: "Vacunación" },
    { hora: "10:00", nombre: "Michi",  raza: "Gato - Común",            motivo: "Control anual" },
    { hora: "11:00", nombre: "Rocky",  raza: "Perro - Bulldog Francés", motivo: "Desparasitación" },
    { hora: "12:00", nombre: "Nina",   raza: "Gata - Siames",           motivo: "Consulta general" },
    { hora: "13:00", nombre: "Toby",   raza: "Perro - Caniche",         motivo: "Vacunación" },
    { hora: "14:00", nombre: "Lola",   raza: "Perra - Beagle",          motivo: "Control anual" },
    { hora: "15:00", nombre: "Simba",  raza: "Gato - Maine Coon",       motivo: "Consulta general" },
    { hora: "16:00", nombre: "Boby",   raza: "Perro - Mestizo",         motivo: "Desparasitación" },
    { hora: "17:00", nombre: "Kira",   raza: "Perra - Pastor Alemán",   motivo: "Vacunación" },
  ],
  "2024-5-10": [
    { hora: "09:00", nombre: "Pelusa", raza: "Gata - Persa",    motivo: "Control anual" },
    { hora: "10:00", nombre: "Bruno",  raza: "Perro - Rottweiler", motivo: "Vacunación" },
    { hora: "11:00", nombre: "Coco",   raza: "Loro - Cacatúa",  motivo: "Consulta general" },
    { hora: "13:00", nombre: "Nala",   raza: "Perra - Labrador", motivo: "Desparasitación" },
    { hora: "15:00", nombre: "Tigre",  raza: "Gato - Bengalí",  motivo: "Control anual" },
    { hora: "16:00", nombre: "Pipi",   raza: "Perro - Poodle",  motivo: "Vacunación" },
  ],
  "2024-5-6": [
    { hora: "08:00", nombre: "Canela", raza: "Perra - Cocker",  motivo: "Consulta general" },
    { hora: "10:00", nombre: "Milo",   raza: "Perro - Dálmata", motivo: "Vacunación" },
    { hora: "14:00", nombre: "Sasha",  raza: "Gata - Angora",   motivo: "Control anual" },
  ],
};

export const UPCOMING_DAYS = [
  { dow: "Jueves",    date: "9 de mayo",  avail: 8, color: "green",  key: "2024-5-9" },
  { dow: "Viernes",   date: "10 de mayo", avail: 6, color: "green",  key: "2024-5-10" },
  { dow: "Lunes",     date: "13 de mayo", avail: 3, color: "yellow", key: "2024-5-13" },
  { dow: "Miércoles", date: "15 de mayo", avail: 7, color: "green",  key: "2024-5-15" },
  { dow: "Viernes",   date: "17 de mayo", avail: 4, color: "yellow", key: "2024-5-17" },
];
// ─────────────────────────────────────────────────────────────

export default function TurnosPanel() {
  const [selectedDate, setSelectedDate] = useState({ year: 2024, month: 4, day: 8 });
  const [currentMonth, setCurrentMonth] = useState({ year: 2024, month: 4 });
  const [modalOpen, setModalOpen] = useState(false); // ← nuevo

  const handlePrevMonth = () => {
    setCurrentMonth(prev => {
      if (prev.month === 0) return { year: prev.year - 1, month: 11 };
      return { ...prev, month: prev.month - 1 };
    });
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => {
      if (prev.month === 11) return { year: prev.year + 1, month: 0 };
      return { ...prev, month: prev.month + 1 };
    });
  };

  const handleSelectDay = (day) => {
    setSelectedDate({ year: currentMonth.year, month: currentMonth.month, day });
  };

  const turnosKey = `${selectedDate.year}-${selectedDate.month + 1}-${selectedDate.day}`;
  const turnosDelDia = MOCK_TURNOS[turnosKey] || [];
  const dots = MOCK_DOTS;

  return (
    <div className="turnos-panel">
      
      <Sidebar onNuevoTurno={() => setModalOpen(true)} /> {/* ← prop nueva */}
      <CalendarGrid
        currentMonth={currentMonth}
        selectedDate={selectedDate}
        dots={dots}
        upcomingDays={UPCOMING_DAYS}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        onSelectDay={handleSelectDay}
      />
      <DayPanel selectedDate={selectedDate} turnos={turnosDelDia} />
         {/* ← Modal nuevo */}
      {modalOpen && (
        <NuevoTurnoModal
          selectedDate={selectedDate}
          turnosDelDia={turnosDelDia}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}