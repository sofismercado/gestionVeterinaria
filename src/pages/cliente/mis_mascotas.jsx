import { useState, useEffect } from "react";
import NavbarCliente from "../../components/NavbarCliente";

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
  const [mascotas, setMascotas] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/mascotas")
      .then(res => res.json())
      .then(data => setMascotas([...data]))
      .catch(err => console.log(err));
  }, []);

  return (
    <div className="contenedor-padre">
      <NavbarCliente />
      <main>
        {mascotas.length === 0 ? (
          <p className="sin-mascotas">Todavía no tenés mascotas registradas.</p>
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