import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const BotonMenu = ({ texto, onClick }) => {
  return <button className="boton-principal" onClick={onClick}>{texto}</button>;
};

const tips = [
  { emoji: "💉", texto: "Recordá vacunar a tu mascota regularmente." },
  { emoji: "💧", texto: "Cambiá el agua de tu mascota todos los días." },
  { emoji: "🦷", texto: "Cepillá los dientes de tu mascota al menos una vez por semana." },
  { emoji: "🏃", texto: "Los perros necesitan ejercicio diario para mantenerse sanos." },
  { emoji: "🍎", texto: "Evitá darle comida humana a tu mascota, puede hacerle daño." },
  { emoji: "🔍", texto: "Revisá a tu mascota por pulgas y garrapatas periódicamente." },
];

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

        <div className="tablero-tips">
          <h3 className="tips-titulo">💡 Tips para tu mascota</h3>
          <div className="tips-lista">
            {tips.map((tip, index) => (
              <div key={index} className="tip-card">
                <span className="tip-emoji">{tip.emoji}</span>
                <p>{tip.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
export default HomeCliente;