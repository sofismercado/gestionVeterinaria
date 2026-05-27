import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NavbarCliente = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    localStorage.removeItem("veterinaria-token");
    navigate("/");
  };

  return (
    <header className="navbar">
      <h1>🐾 {user?.nombre}</h1>
      <nav className="navbar-links">
        <button className="boton-secundario" onClick={() => navigate("/home")}>
          Inicio
        </button>
        <button className="boton-secundario" onClick={() => navigate("/mis-mascotas")}>
          Mis Mascotas
        </button>
        <button className="boton-secundario" onClick={() => navigate("/mis-turnos")}>
          Mis Turnos
        </button>
        <button className="boton-secundario" onClick={() => navigate("/pedir-turno")}>
          Pedir Turno
        </button>
        <button className="boton-secundario" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </nav>
    </header>
  );
};

export default NavbarCliente;