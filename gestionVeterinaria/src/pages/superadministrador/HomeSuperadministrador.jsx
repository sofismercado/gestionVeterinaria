import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./SuperAdmin.css";

const AccesoSuperAdmin = ({ titulo, descripcion, onClick }) => (
  <button className="super-card" onClick={onClick}>
    <span className="super-card-title">{titulo}</span>
    <span className="super-card-text">{descripcion}</span>
  </button>
);

function HomeSuperadministrador() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="contenedor-padre">
      <header className="navbar">
        <div>
          <h1>🐾Hola, {user?.nombre}</h1>
        </div>
        <button className="boton-secundario" onClick={handleLogout}>
          Cerrar sesion
        </button>
      </header>

      <main className="super-grid">
        <AccesoSuperAdmin
          titulo="Gestionar usuarios"
          descripcion="Alta, baja, modificacion y cambio de roles."
          onClick={() => navigate("/usuarios")}
        />
        <AccesoSuperAdmin
          titulo="Ver turnos"
          descripcion="Acceso de supervision al calendario de turnos."
          onClick={() => navigate("/turnos")}
        />
        <AccesoSuperAdmin
          titulo="Ver clientes"
          descripcion="Acceso de supervision al listado de clientes."
          onClick={() => navigate("/clientes")}
        />
      </main>
    </div>
  );
}

export default HomeSuperadministrador;
