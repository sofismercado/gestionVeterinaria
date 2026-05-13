import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import NavbarAdmin from "./NavbarAdmin";// ajustá el path si es necesario

const BotonMenu = ({ texto, onClick }) => {
  return <button className="boton-principal" onClick={onClick}>{texto}</button>;
};

function Home_administrador() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="contenedor-padre">

      <NavbarAdmin />

      <main className="contenido">
        <div className="columna-botones">
          <BotonMenu texto="TURNOS" onClick={() => navigate("/turnos")} />
          <BotonMenu texto="NUESTROS CLIENTES" onClick={() => navigate("")} />
          <BotonMenu texto="NUEVO CLIENTE" onClick={() => navigate("")} />
        </div>
        <div className="placeholder-img"></div>
      </main>

    </div>
  );
}

export default Home_administrador;


