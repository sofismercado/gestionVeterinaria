import React from 'react';

// El componente de botón lo podés declarar aquí mismo o en otro archivo
const BotonMenu = ({ texto }) => {
  return <button className="boton-principal">{texto}</button>;
};

function HomeCliente() {
  return (
    <div className="contenedor-padre">
      <header className="navbar">
        <h1>Hola Sofi! 🐾</h1>
        <button className="boton-secundario">Cerrar sesión</button>
      </header>
      <main className="contenido">
        <div className="columna-botones">
          <BotonMenu texto="MIS MASCOTAS" />
          <BotonMenu texto="TURNOS" />
        </div>
        <div className="placeholder-img">🐶🐱</div>
      </main>
    </div>
  );
}

export default HomeCliente;