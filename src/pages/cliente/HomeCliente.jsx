import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const BotonMenu = ({ texto, onClick }) => {
  return <button className="boton-principal" onClick={onClick}>{texto}</button>;
};

function HomeCliente() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="contenedor-padre">
      <header className="navbar">
        <h1>Hola {user?.nombre}! 🐾</h1>
        <button className="boton-secundario" onClick={handleLogout}>Cerrar sesión</button>
      </header>
      <main className="contenido">
        <div className="columna-botones">
          <BotonMenu texto="MIS MASCOTAS" onClick={() => navigate("/mis-mascotas")} />
          <BotonMenu texto="TURNOS" onClick={() => navigate("/mis-turnos")} />
          <BotonMenu texto="PEDIR TURNO" onClick={() => navigate("/pedir-turno")} />
        </div>
        <div className="placeholder-img"></div>
      </main>
    </div>
  );
}

export default HomeCliente;