import { useEffect, useState } from "react";
import NavbarCliente from "../../components/NavbarCliente";
import { useAuth } from "../../context/AuthContext";

const API_URL = "http://localhost:3000/api";

const TarjetaMascota = ({ mascota }) => {
  return (
    <div className="col-sm-6 col-lg-4 mb-4">
      <div className="card h-100 shadow-sm mascota-card">
        <div className="mascota-foto">
          {mascota.foto ? (
            <img src={mascota.foto} alt={mascota.nombre} className="card-img-top" />
          ) : (
            <div className="foto-placeholder">Mascota</div>
          )}
        </div>
        <div className="card-body">
          <h5 className="card-title">{mascota.nombre}</h5>
          <ul className="list-unstyled card-text">
            <li><span className="dato-label">Especie:</span> {mascota.especie || "-"}</li>
            <li><span className="dato-label">Raza:</span> {mascota.raza || "-"}</li>
            <li><span className="dato-label">Edad:</span> {mascota.edad ? `${mascota.edad} anios` : "-"}</li>
            <li><span className="dato-label">Peso:</span> {mascota.peso ? `${mascota.peso} kg` : "-"}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

function MisMascotas() {
  const { token } = useAuth();
  const [mascotas, setMascotas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function cargarMascotas() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/mascotas`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.mensaje || "No se pudieron cargar las mascotas.");
          return;
        }

        setMascotas(data);
      } catch (err) {
        setError("No se pudo conectar con el servidor.");
      } finally {
        setLoading(false);
      }
    }

    if (token) cargarMascotas();
  }, [token]);

  return (
    <div className="contenedor-padre">
      <NavbarCliente />
      <main>
        {error && <p className="sin-mascotas">{error}</p>}
        {loading && <p className="sin-mascotas">Cargando mascotas...</p>}

        {!loading && mascotas.length === 0 ? (
          <p className="sin-mascotas">Todavia no tenes mascotas registradas.</p>
        ) : (
          <div className="row">
            {mascotas.map((m) => (
              <TarjetaMascota key={m.id} mascota={m} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default MisMascotas;
