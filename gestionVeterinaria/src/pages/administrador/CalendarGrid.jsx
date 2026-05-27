import "./CalendarGrid.css";

const MONTHS = [
  "Enero","Febrero","Marzo","Abril","Mayo","Junio",
  "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre",
];
const DAYS_SHORT = ["LUN","MAR","MIÉ","JUE","VIE","SÁB","DOM"];

const DOT_COLORS = {
  green:  "#4a9c6a",
  yellow: "#d4a017",
  red:    "#c0392b",
};

export default function CalendarGrid({
  currentMonth, selectedDate, dots, upcomingDays,
  onPrevMonth, onNextMonth, onSelectDay, onSelectUpcomingDay,
}) {
  const { year, month } = currentMonth;


  const firstDow = new Date(year, month, 1).getDay();
  const startOffset = firstDow === 0 ? 6 : firstDow - 1;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  const cells = [];


  for (let i = 0; i < startOffset; i++) {
    cells.push({ day: prevMonthDays - startOffset + 1 + i, otherMonth: true });
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const key = `${year}-${month + 1}-${d}`;
    cells.push({ day: d, otherMonth: false, dot: dots[key] });
  }

  const remaining = cells.length % 7 === 0 ? 0 : 7 - (cells.length % 7);
  for (let i = 1; i <= remaining; i++) {
    cells.push({ day: i, otherMonth: true });
  }

  const isSelected = (d) =>
    !d.otherMonth &&
    selectedDate.day === d.day &&
    selectedDate.month === month &&
    selectedDate.year === year;

  const handleUpcomingClick = (upcomingDay) => {
    if (onSelectUpcomingDay) {
      onSelectUpcomingDay(upcomingDay);
      return;
    }

    const [upcomingYear, upcomingMonth, upcomingDayNumber] = upcomingDay.key.split("-").map(Number);
    if (upcomingYear === year && upcomingMonth - 1 === month) {
      onSelectDay(upcomingDayNumber);
    }
  };

  return (
    <section className="calendar-section">
      {/* Header */}
      <div className="cal-header">
        <button className="cal-nav" onClick={onPrevMonth}>&#8249;</button>
        <span className="cal-title">{MONTHS[month]} {year}</span>
        <button className="cal-nav" onClick={onNextMonth}>&#8250;</button>
      </div>

      {/* Grilla días */}
      <div className="cal-grid">
        {DAYS_SHORT.map(d => (
          <div key={d} className="cal-dow">{d}</div>
        ))}
        {cells.map((cell, i) => (
          <div
            key={i}
            className={[
              "cal-day",
              cell.otherMonth ? "other-month" : "",
              isSelected(cell) ? "selected" : "",
            ].join(" ").trim()}
            onClick={() => !cell.otherMonth && onSelectDay(cell.day)}
          >
            <span className="day-num">{cell.day}</span>
            {cell.dot && (
              <span
                className="day-dot"
                style={{ background: DOT_COLORS[cell.dot] }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Próximos días */}
      <div className="upcoming">
        <p className="upcoming-title">Próximos días con turnos disponibles</p>
        <p className="upcoming-sub">Seleccioná un día para ver sus turnos</p>
        <div className="upcoming-scroll">
          {upcomingDays.map((u) => (
            <div
              key={u.key}
              className="upcoming-card"
              onClick={() => handleUpcomingClick(u)}
            >
              <p className="upcoming-card-day">{u.dow}</p>
              <p className="upcoming-card-date">{u.date}</p>
              <span className={`avail-badge avail-${u.color}`}>
                {u.avail} disponibles
              </span>
              <button
                className="ver-dia-btn"
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  handleUpcomingClick(u);
                }}
              >
                Ver día
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
