import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import NavbarAdmin from "./NavbarAdmin";// ajustá el path si es necesario

const BotonMenu = ({ texto, onClick }) => {
  return <button className="boton-principal" onClick={onClick}>{texto}</button>;
};

function BlocNotas() {
  const [texto, setTexto] = useState(() => localStorage.getItem("notas_admin") || "");

  useEffect(() => {
    localStorage.setItem("notas_admin", texto);
  }, [texto]);

  return (
    <div className="bloc-notas">
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

      <main className="contenido">
        <div className="columna-botones">
          <BotonMenu texto="TURNOS" onClick={() => navigate("/turnos")} />
          <BotonMenu texto="NUESTROS CLIENTES" onClick={() => navigate("/clientes")} />

        </div>
        <BlocNotas />
      </main>

    </div>
  );
}

export default Home_administrador;


