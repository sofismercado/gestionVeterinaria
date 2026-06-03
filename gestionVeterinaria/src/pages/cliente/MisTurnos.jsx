import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavbarCliente from "../../components/NavbarCliente";
import { useAuth } from "../../context/AuthContext";

const API_URL = "http://localhost:3000/api";

const estadoBadge = {
  confirmado: "bg-success",
  pendiente: "bg-warning text-dark",
  cancelado: "bg-danger",
  finalizado: "bg-secondary",
};

const estadoTexto = {
  confirmado: "Confirmado",
  pendiente: "Pendiente",
  cancelado: "Cancelado",
  finalizado: "Finalizado",
};

const formatearFecha = (fecha) => {
  if (!fecha) return "-";
  const [year, month, day] = fecha.split("-");
  return `${day}/${month}/${year}`;
};

const formatearHora = (hora) => {
  if (!hora) return "-";
  return hora.slice(0, 5);
};

const TarjetaTurno = ({ turno, esProximo, onCancelar, onReprogramar }) => {
  const estado = turno.estado || "pendiente";
  const nombreMascota = turno.mascota?.nombre || "Mascota";

  return (
    <div className="col-md-6 col-xl-4 mb-4">
      <div className="card h-100 shadow-sm mascota-card">
        <div className="card-body d-flex flex-column gap-2">
          <div className="d-flex justify-content-between align-items-start gap-2">
            <div>
              <h5 className="card-title mb-1">{nombreMascota}</h5>
              <p className="card-text mb-0">
                {formatearFecha(turno.fecha)} - {formatearHora(turno.hora)} hs
              </p>
            </div>
            <span className={`badge ${estadoBadge[estado] || "bg-secondary"}`}>
              {estadoTexto[estado] || estado}
            </span>
          </div>

          <ul className="list-unstyled card-text mb-3">
            <li>
              <span className="dato-label">Motivo:</span> {turno.motivo}
            </li>
          </ul>

          <div className="mt-auto d-flex gap-2 flex-wrap">
            {esProximo && estado !== "cancelado" && estado !== "finalizado" && (
              <>
                <button className="boton-secundario m-0" onClick={() => onReprogramar(turno)}>
                  Reprogramar
                </button>
                <button className="boton-secundario m-0" onClick={() => onCancelar(turno.id)}>
                  Cancelar
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

function MisTurnos() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [turnos, setTurnos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function cargarTurnos() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/turnos`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.mensaje || "No se pudieron cargar los turnos.");
        return;
      }

      setTurnos(data);
    } catch (err) {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (token) cargarTurnos();
  }, [token]);

  const cancelarTurno = async (turnoId) => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/turnos/${turnoId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ estado: "disponible" }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.mensaje || "No se pudo cancelar el turno.");
        return;
      }

      await cargarTurnos();
    } catch (err) {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  const reprogramarTurno = (turno) => {
    navigate(`/pedir-turno?reprogramar=${turno.id}`);
  };

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const proximosTurnos = turnos.filter((turno) => new Date(`${turno.fecha}T00:00:00`) >= hoy);
  const historialTurnos = turnos.filter((turno) => new Date(`${turno.fecha}T00:00:00`) < hoy);

  return (
    <div className="contenedor-padre">
      <NavbarCliente />

      <main>
        {error && <p className="sin-mascotas">{error}</p>}
        {loading && <p className="sin-mascotas">Cargando turnos...</p>}

        <section className="mb-5">
          <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
            <h2 className="text-white mb-0">Mis turnos</h2>
            <span className="text-white">
              {proximosTurnos.length} proximo/s turno/s
            </span>
          </div>

          {!loading && proximosTurnos.length === 0 ? (
            <p className="sin-mascotas">No tenes turnos proximos.</p>
          ) : (
            <div className="row">
              {proximosTurnos.map((turno) => (
                <TarjetaTurno
                  key={turno.id}
                  turno={turno}
                  esProximo
                  onCancelar={cancelarTurno}
                  onReprogramar={reprogramarTurno}
                />
              ))}
            </div>
          )}
        </section>

        <section>
          <h3 className="text-white mb-3">Historial</h3>
          {!loading && historialTurnos.length === 0 ? (
            <p className="sin-mascotas">Todavia no tenes turnos anteriores.</p>
          ) : (
            <div className="row">
              {historialTurnos.map((turno) => (
                <TarjetaTurno
                  key={turno.id}
                  turno={turno}
                  onCancelar={cancelarTurno}
                  onReprogramar={reprogramarTurno}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default MisTurnos;
