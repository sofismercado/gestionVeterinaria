import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const NavbarAdmin = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <header className="navbar navbar-admin-home">
      <h1> 🐾Hola, {user?.nombre}</h1>
      <nav className="navbar-links">
        
        <button className="boton-secundario" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </nav>
    </header>
  );
};

export default NavbarAdmin;
