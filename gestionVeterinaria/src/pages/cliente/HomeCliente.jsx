import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const acciones = [
  {
    titulo: "Mis mascotas",
    descripcion: "Consulta la informacion registrada de tus mascotas.",
    icono: "mascotas",
    ruta: "/mis-mascotas",
  },
  {
    titulo: "Mis turnos",
    descripcion: "Revisa tus turnos pendientes y el historial.",
    icono: "turnos",
    ruta: "/mis-turnos",
  },
  {
    titulo: "Pedir turno",
    descripcion: "Reserva un nuevo horario disponible para atencion.",
    icono: "pedir",
    ruta: "/pedir-turno",
  },
];

const tips = [
  { icono: "01", texto: "Recorda vacunar a tu mascota regularmente." },
  { icono: "02", texto: "Cambia el agua de tu mascota todos los dias." },
  { icono: "03", texto: "Cepilla sus dientes al menos una vez por semana." },
  { icono: "04", texto: "Los perros necesitan ejercicio diario." },
  { icono: "05", texto: "Evita darle comida humana sin indicacion veterinaria." },
];

function AccionCard({ accion, onClick }) {
  return (
    <button className="home-action-card" type="button" onClick={onClick}>
      <span className="home-action-icon">
        <IconoAccion tipo={accion.icono} />
      </span>
      <span className="home-action-text">
        <strong>{accion.titulo}</strong>
        <small>{accion.descripcion}</small>
      </span>
      <span className="home-action-arrow">&gt;</span>
    </button>
  );
}

function IconoAccion({ tipo }) {
  if (tipo === "turnos") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="4" y="5" width="16" height="15" rx="3" />
        <path d="M8 3v4M16 3v4M4 10h16M8 14h3M13 14h3M8 17h3" />
      </svg>
    );
  }

  if (tipo === "pedir") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="8" />
        <path d="M12 8v8M8 12h8" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="7" cy="8" r="2" />
      <circle cx="12" cy="6" r="2" />
      <circle cx="17" cy="8" r="2" />
      <circle cx="9" cy="13" r="2" />
      <circle cx="15" cy="13" r="2" />
      <path d="M7 17c1.5-2.2 3-3.2 5-3.2s3.5 1 5 3.2c.8 1.2 0 3-1.5 3h-7c-1.5 0-2.3-1.8-1.5-3Z" />
    </svg>
  );
}

function TipsPanel() {
  return (
    <aside className="home-tips-card">
      <div className="home-card-header">
        <span className="home-card-kicker">Consejos</span>
        <h3>Tips para tu mascota</h3>
      </div>

      <div className="home-tips-list">
        {tips.map((tip) => (
          <article className="home-tip-item" key={tip.texto}>
            <span>{tip.icono}</span>
            <p>{tip.texto}</p>
          </article>
        ))}
      </div>
    </aside>
  );
}

function HomeCliente() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="contenedor-padre">
      <header className="home-cliente-header">
        <div>
          <h1>🐾Hola, {user?.nombre || "cliente"}</h1>
        </div>
        <button className="home-logout-btn" type="button" onClick={handleLogout}>
          Cerrar sesion
        </button>
      </header>

      <main className="home-dashboard">
        <section className="home-actions-card">
          <div className="home-card-header">
            <span className="home-card-kicker">Accesos rapidos</span>
            <h2>Que queres hacer hoy?</h2>
          </div>

          <div className="home-actions-list">
            {acciones.map((accion) => (
              <AccionCard
                accion={accion}
                key={accion.ruta}
                onClick={() => navigate(accion.ruta)}
              />
            ))}
          </div>
        </section>

        <TipsPanel />
      </main>
    </div>
  );
}

export default HomeCliente;
