import { useEffect, useState } from "react";
import NavbarCliente from "../../components/NavbarCliente";
import { useAuth } from "../../context/AuthContext";

const API_URL = "http://localhost:3000/api";

const AVATARES_MASCOTA = {
  perro: "\u{1F436}",
  gato: "\u{1F431}",
  conejo: "\u{1F430}",
  loro: "\u{1F99C}",
  hamster: "\u{1F439}",
  tortuga: "\u{1F422}",
};

const TarjetaMascota = ({ mascota }) => {
  const especie = mascota.especie || "Mascota";
  const raza = mascota.raza || "Sin raza";
  const edad = mascota.edad ? `${mascota.edad} años` : "Edad no cargada";
  const peso = mascota.peso ? `${mascota.peso} kg` : "Peso no cargado";

  return (
    <div className="col-sm-6 col-lg-4 mb-4">
      <article className="mis-mascotas-card h-100">
        <div className="mis-mascotas-avatar-wrap">
          {mascota.foto ? (
            <img src={mascota.foto} alt={mascota.nombre} className="mis-mascotas-img" />
          ) : (
            <div className="mis-mascotas-avatar">
              {AVATARES_MASCOTA[mascota.avatar] || AVATARES_MASCOTA.perro}
            </div>
          )}
        </div>

        <div className="mis-mascotas-body">
          <p className="mis-mascotas-kicker">{especie}</p>
          <h5 className="mis-mascotas-nombre">{mascota.nombre}</h5>

          <div className="mis-mascotas-chips">
            <span>{raza}</span>
            <span>{edad}</span>
            <span>{peso}</span>
          </div>
        </div>
      </article>
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
        <section className="mis-mascotas-header">
          <h2>Mis mascotas</h2>
        </section>

        {error && <p className="sin-mascotas">{error}</p>}
        {loading && <p className="sin-mascotas">Cargando mascotas...</p>}

        {!loading && mascotas.length === 0 ? (
          <p className="sin-mascotas">Todavia no tenes mascotas registradas.</p>
        ) : (
          <div className="row mis-mascotas-grid">
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
