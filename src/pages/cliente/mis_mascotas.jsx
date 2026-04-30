import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// Datos de prueba hasta que esté el backend
const mascotasMock = [
  {
    id: 1,
    nombre: "Luna",
    especie: "Perro",
    raza: "Labrador",
    edad: 3,
    peso: 28,
    nroVeterinaria: "VET-001",
    foto: null,
  },
  {
    id: 2,
    nombre: "Michi",
    especie: "Gato",
    raza: "Persa",
    edad: 5,
    peso: 4,
    nroVeterinaria: "VET-002",
    foto: null,
  },
];

const TarjetaMascota = ({ mascota }) => {
  return (
    <div className="col-sm-6 col-lg-4 mb-4">
      <div className="card h-100 shadow-sm mascota-card">
        <div className="mascota-foto">
          {mascota.foto ? (
            <img src={mascota.foto} alt={mascota.nombre} className="card-img-top" />
          ) : (
            <div className="foto-placeholder">🐾</div>
          )}
        </div>
        <div className="card-body">
          <h5 className="card-title">{mascota.nombre}</h5>
          <ul className="list-unstyled card-text">
            <li><span className="dato-label">Especie:</span> {mascota.especie}</li>
            <li><span className="dato-label">Raza:</span> {mascota.raza}</li>
            <li><span className="dato-label">Edad:</span> {mascota.edad} años</li>
            <li><span className="dato-label">Peso:</span> {mascota.peso} kg</li>
            <li><span className="dato-label">N° Veterinaria:</span> {mascota.nroVeterinaria}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

function MisMascotas() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="contenedor-padre">
      <header className="navbar">
        <h1>Mis Mascotas 🐾</h1>
        <div>
          <button className="boton-secundario" onClick={() => navigate("/home")}>
            Volver
          </button>
          <button className="boton-secundario" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      </header>

      <main>
        {mascotasMock.length === 0 ? (
          <p className="sin-mascotas">Todavía no tenés mascotas registradas. Consultá con el administrador.</p>
        ) : (
          <div className="row">
            {mascotasMock.map((m) => (
              <TarjetaMascota key={m.id} mascota={m} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default MisMascotas;