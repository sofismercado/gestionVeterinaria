import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const NavbarAdmin = () => {
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
        <button className="boton-secundario" onClick={() => navigate(-1)}>
          ← Volver
        </button>
        <button className="boton-secundario" onClick={() => navigate("/admin")}>
          Inicio
        </button>
        <button className="boton-secundario" onClick={() => navigate("/admin/turnos")}>
          Turnos
        </button>
        <button className="boton-secundario" onClick={() => navigate("/admin/mascotas")}>
          Mascotas
        </button>
        <button className="boton-secundario" onClick={() => navigate("/admin/usuarios")}>
          Usuarios
        </button>
        <button className="boton-secundario" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </nav>
    </header>
  );
};

export default NavbarAdmin;