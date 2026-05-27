import NavbarCliente from "../../components/NavbarCliente";

const turnosMock = [
  {
    id: 1,
    fecha: "2026-05-28",
    hora: "10:30",
    mascota: "Luna",
    motivo: "Vacunacion anual",
    veterinario: "Dra. Martinez",
    estado: "Confirmado",
  },
  {
    id: 2,
    fecha: "2026-06-03",
    hora: "16:00",
    mascota: "Michi",
    motivo: "Control general",
    veterinario: "Dr. Gomez",
    estado: "Pendiente",
  },
  {
    id: 3,
    fecha: "2026-04-12",
    hora: "09:00",
    mascota: "Luna",
    motivo: "Desparasitacion",
    veterinario: "Dra. Martinez",
    estado: "Finalizado",
  },
];

const estadoBadge = {
  Confirmado: "bg-success",
  Pendiente: "bg-warning text-dark",
  Cancelado: "bg-danger",
  Finalizado: "bg-secondary",
};

const formatearFecha = (fecha) => {
  const [year, month, day] = fecha.split("-");
  return `${day}/${month}/${year}`;
};

const TarjetaTurno = ({ turno, esProximo }) => {
  return (
    <div className="col-md-6 col-xl-4 mb-4">
      <div className="card h-100 shadow-sm mascota-card">
        <div className="card-body d-flex flex-column gap-2">
          <div className="d-flex justify-content-between align-items-start gap-2">
            <div>
              <h5 className="card-title mb-1">{turno.mascota}</h5>
              <p className="card-text mb-0">
                {formatearFecha(turno.fecha)} - {turno.hora} hs
              </p>
            </div>
            <span className={`badge ${estadoBadge[turno.estado] || "bg-secondary"}`}>
              {turno.estado}
            </span>
          </div>

          <ul className="list-unstyled card-text mb-3">
            <li>
              <span className="dato-label">Motivo:</span> {turno.motivo}
            </li>
            <li>
              <span className="dato-label">Veterinario:</span> {turno.veterinario}
            </li>
          </ul>

          <div className="mt-auto d-flex gap-2 flex-wrap">
            <button className="boton-secundario m-0">Ver detalle</button>
            {esProximo && (
              <>
                <button className="boton-secundario m-0">Reprogramar</button>
                <button className="boton-secundario m-0">Cancelar</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

function MisTurnos() {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const proximosTurnos = turnosMock.filter((turno) => new Date(turno.fecha) >= hoy);
  const historialTurnos = turnosMock.filter((turno) => new Date(turno.fecha) < hoy);

  return (
    <div className="contenedor-padre">
      <NavbarCliente />

      <main>
        <section className="mb-5">
          <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
            <h2 className="text-white mb-0">Mis turnos</h2>
            <span className="text-white">
              {proximosTurnos.length} proximo/s turno/s
            </span>
          </div>

          {proximosTurnos.length === 0 ? (
            <p className="sin-mascotas">No tenes turnos proximos.</p>
          ) : (
            <div className="row">
              {proximosTurnos.map((turno) => (
                <TarjetaTurno key={turno.id} turno={turno} esProximo />
              ))}
            </div>
          )}
        </section>

        <section>
          <h3 className="text-white mb-3">Historial</h3>
          {historialTurnos.length === 0 ? (
            <p className="sin-mascotas">Todavia no tenes turnos anteriores.</p>
          ) : (
            <div className="row">
              {historialTurnos.map((turno) => (
                <TarjetaTurno key={turno.id} turno={turno} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default MisTurnos;
