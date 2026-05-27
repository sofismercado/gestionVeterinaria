import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

function Calendario({ onChangeFecha }) {

  const [fecha, setFecha] = useState(new Date());

  return (
    <div>
      <Calendar
        onChange={(date) => {
        setFecha(date);
        onChangeFecha(date);
        }}
        value={fecha}

        tileContent={({ date, view }) => {

      if(view === 'month'){

          const dia = date.getDate();

        if(dia === 8){
          return <div className="punto-verde"></div>;
        }

        if(dia === 15){
        return <div className="punto-amarillo"></div>;
        }

        if(dia === 22){
        return <div className="punto-rojo"></div>;
        }
      }

    }}
/>

      <p>Fecha seleccionada: {fecha.toDateString()}</p>
    </div>
  );
}

export default Calendario;