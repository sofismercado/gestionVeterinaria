import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import NavbarAdmin from "./NavbarAdmin";

const BotonMenu = ({ texto, descripcion, icono, onClick }) => {
  return (
    <button className="home-action-card" type="button" onClick={onClick}>
      <span className="home-action-icon">
        {icono === "turnos" ? (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <rect x="4" y="5" width="16" height="15" rx="3" />
            <path d="M8 3v4M16 3v4M4 10h16M8 14h3M13 14h3M8 17h3" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        )}
      </span>
      <span className="home-action-text">
        <strong>{texto}</strong>
        <small>{descripcion}</small>
      </span>
      <span className="home-action-arrow">&gt;</span>
    </button>
  );
};

function BlocNotas() {
  const [texto, setTexto] = useState(() => localStorage.getItem("notas_admin") || "");

  useEffect(() => {
    localStorage.setItem("notas_admin", texto);
  }, [texto]);

  return (
    <div className="bloc-notas" style={{ marginTop: 0 }}>
      <div className="bloc-header">
        <span className="bloc-titulo">📋 Notas rápidas</span>
        <button className="bloc-limpiar" onClick={() => setTexto("")}>Limpiar</button>
      </div>
      <textarea
        className="bloc-textarea"
        value={texto}
        onChange={e => setTexto(e.target.value)}
        placeholder="Anotá recordatorios, pendientes, lo que necesites…"
      />
    </div>
  );
}

function Home_administrador() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="contenedor-padre">
      <NavbarAdmin />

      <main className="home-dashboard">
        <div className="home-actions-card">
          <div className="home-card-header">
            <span className="home-card-kicker">Accesos rápidos</span>
            <h2>¿Qué querés hacer hoy?</h2>
          </div>

          <div className="home-actions-list">
            <BotonMenu 
              texto="TURNOS" 
              descripcion="Consulta la informacion registrada de los turnos." 
              icono="turnos" 
              onClick={() => navigate("/turnos")} 
            />
            <BotonMenu 
              texto="NUESTROS CLIENTES" 
              descripcion="Consulta la informacion registrada de tus clientes." 
              icono="clientes" 
              onClick={() => navigate("/clientes")} 
            />
          </div>
        </div>

        <BlocNotas />
      </main>
    </div>
  );
}

export default Home_administrador;