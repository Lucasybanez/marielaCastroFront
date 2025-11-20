import React, { useEffect, useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import 'dayjs/locale/es';

dayjs.locale('es');
dayjs.extend(isoWeek);

export default function Agenda() {
  const [turnos, setTurnos] = useState([]);
  const [semanaActual, setSemanaActual] = useState(dayjs().startOf('isoWeek'));

  // Horarios cada 30 minutos desde 08:00 a 20:00
  const horas = [];
  for (let h = 8; h <= 20; h++) {
    horas.push(`${String(h).padStart(2, "0")}:00`);
    if (h !== 20) horas.push(`${String(h).padStart(2, "0")}:30`);
  }

  useEffect(() => {
    obtenerTurnos();
  }, []);

  const obtenerTurnos = async () => {
    try {
      const respuesta = await axios.get('http://localhost:8001/api/turnos');
      setTurnos(respuesta.data);   // <-- ahora vienen crudos
    } catch (error) {
      console.error('Error al cargar los turnos:', error);
    }
  };

  const diasDeLaSemana = Array.from({ length: 7 }, (_, i) =>
    semanaActual.add(i, 'day')
  );

  // Turnos en crudo → convertir fecha string a dayjs
  const listaPlana = turnos.map(t => ({
    fecha: dayjs(t.fecha),
    hora: t.hora,
    nombre: t.paciente,
  }));

  // Devuelve el turno correspondiente a día+hora
  const obtenerTurno = (dia, hora) => {
    return (
      listaPlana.find(
        t =>
          t.fecha.isValid() &&
          t.fecha.isSame(dia, "day") &&
          t.hora.startsWith(hora)
      ) || null
    );
  };

  const hoy = dayjs();

  const colorTurno = (dia, turno) => {
    if (!turno) return "bg-white";

    if (dia.isBefore(hoy, "day")) return "bg-gray-400 text-gray-900"; // pasado
    if (dia.isSame(hoy, "day")) return "bg-blue-500 text-white"; // hoy
    return "bg-blue-200 text-gray-900"; // futuro
  };

  const avanzarSemana = () => setSemanaActual(semanaActual.add(1, 'week'));
  const retrocederSemana = () => setSemanaActual(semanaActual.subtract(1, 'week'));

  return (
    <div className="w-full h-screen p-6 bg-gray-100 flex flex-col">

      <div className="flex flex-col items-center mb-6">
        <h2 className="text-5xl font-extrabold text-gray-900 mb-2 tracking-wide">
          {semanaActual.format("MMMM").charAt(0).toUpperCase() + semanaActual.format("MMMM").slice(1)}
        </h2>

        <div className="flex justify-between items-center w-full max-w-4xl">
          <button
            onClick={retrocederSemana}
            className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
          >
            &lt; Semana anterior
          </button>

          <h1 className="text-3xl font-bold text-gray-800">
            Semana del {semanaActual.format('DD/MM/YYYY')}
          </h1>

          <button
            onClick={avanzarSemana}
            className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
          >
            Semana siguiente &gt;
          </button>
        </div>
      </div>

      {/* Agenda */}
      <div className="flex-1 overflow-auto bg-white rounded-xl shadow-md border border-gray-400">

        <div
          className="grid"
          style={{
            gridTemplateColumns: "90px repeat(7, 1fr)",
            gridAutoRows: "60px",
          }}
        >

          {/* Esquina vacía */}
          <div className="border-b border-r border-gray-400 bg-gray-100"></div>

          {/* Encabezado días */}
          {diasDeLaSemana.map((dia) => (
            <div
              key={dia.format('YYYY-MM-DD')}
              className="flex items-center justify-center font-semibold text-gray-700
                         border-b border-r border-gray-400 bg-gray-50"
            >
              {dia.format("dddd DD")}
            </div>
          ))}

          {/* Filas */}
          {horas.map((h) => (
            <React.Fragment key={h}>

              <div
                className="flex items-center justify-center text-sm font-medium 
                           border-b border-r border-gray-500 bg-gray-100 text-gray-700"
              >
                {h}
              </div>

              {diasDeLaSemana.map((dia) => {
                const turno = obtenerTurno(dia, h);

                return (
                  <div
                    key={dia.format("YYYY-MM-DD") + h}
                    className={`flex items-center justify-center border-b border-r 
                                border-gray-400 text-sm font-medium transition-colors
                                ${colorTurno(dia, turno)}`}
                  >
                    {turno ? turno.nombre : ""}
                  </div>
                );
              })}

            </React.Fragment>
          ))}

        </div>
      </div>
    </div>
  );
}
