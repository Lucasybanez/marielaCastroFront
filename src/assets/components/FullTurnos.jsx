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

  // Modal
  const [mostrarModal, setMostrarModal] = useState(false);
  const [cuil, setCuil] = useState('');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [error, setError] = useState('');

  // Menú contextual
  const [contextMenu, setContextMenu] = useState(null); // { x, y }
  const [turnoSeleccionado, setTurnoSeleccionado] = useState(null);

  const horas = [];
  for (let h = 8; h <= 20; h++) {
    horas.push(`${String(h).padStart(2, "0")}:00`);
    if (h !== 20) horas.push(`${String(h).padStart(2, "0")}:30`);
  }

  useEffect(() => {
    obtenerTurnos();

    // cerrar menú contextual si hace click izquierdo en cualquier lado
    const handleClickGlobal = (e) => {
      // Si clic fuera del menú contextual, lo cerramos
      if (contextMenu) {
        setContextMenu(null);
      }
    };

    window.addEventListener('click', handleClickGlobal);
    return () => window.removeEventListener('click', handleClickGlobal);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contextMenu]);

  const obtenerTurnos = async () => {
    try {
      const respuesta = await axios.get('http://localhost:8001/api/turnos');
      setTurnos(respuesta.data || []);
    } catch (error) {
      console.error('Error al cargar los turnos:', error);
    }
  };

  const diasDeLaSemana = Array.from({ length: 7 }, (_, i) => semanaActual.add(i, 'day'));

  // mapeo flexible de id (id_turno o id)
  const listaPlana = turnos.map(t => ({
    id: t.id_turno ?? t.id ?? null,
    fecha: dayjs(t.fecha),
    hora: t.hora,
    nombre: t.paciente,
  }));

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
    if (dia.isBefore(hoy, "day")) return "bg-gray-400 text-gray-900";
    if (dia.isSame(hoy, "day")) return "bg-blue-500 text-white";
    return "bg-blue-200 text-gray-900";
  };

  const abrirModal = (dia, h) => {
    setFecha(dia.format('YYYY-MM-DD'));
    setHora(h);
    setCuil('');
    setError('');
    setMostrarModal(true);
  };

  const guardarTurno = async (e) => {
    e.preventDefault();
    if (!cuil.trim() || !fecha || !hora) {
      setError('Todos los campos son obligatorios');
      return;
    }

    const turnoPost = { paciente: cuil.trim(), fecha, hora };

    try {
      await axios.post('http://localhost:8001/api/turno', turnoPost);
      await obtenerTurnos();
      setMostrarModal(false);
    } catch (error) {
      console.error('Error al guardar turno:', error);
      setError('Error al guardar turno');
    }
  };

  // abrir menú contextual al click derecho sobre un turno
  const handleContextMenuOnTurno = (e, turno) => {
    e.preventDefault();
    // guardamos el turno seleccionado con su id completo (si existe)
    setTurnoSeleccionado(turno);
    setContextMenu({ x: e.clientX, y: e.clientY });
    // evitar que el listener global cierre inmediatamente (el event order ya evita eso normalmente)
  };

  const eliminarTurno = async () => {
    if (!turnoSeleccionado) return;
    const id = turnoSeleccionado.id;
    if (!id) {
      console.error('Turno sin id, imposible eliminar');
      setContextMenu(null);
      return;
    }

    const confirmado = window.confirm('¿Eliminar este turno? Esta acción no se puede deshacer.');
    if (!confirmado) {
      setContextMenu(null);
      return;
    }

    try {
      await axios.delete(`http://localhost:8001/api/turno/${id}`);
      await obtenerTurnos();
      setContextMenu(null);
      setTurnoSeleccionado(null);
    } catch (error) {
      console.error('Error al eliminar turno:', error);
      alert('Error al eliminar turno');
    }
  };

  const avanzarSemana = () => setSemanaActual(semanaActual.add(1, 'week'));
  const retrocederSemana = () => setSemanaActual(semanaActual.subtract(1, 'week'));

  return (
    <div className="w-full h-screen p-4 bg-gray-100 flex flex-col">

      <div className="flex flex-col items-center mb-4">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-wide">
          {semanaActual.format("MMMM").charAt(0).toUpperCase() + semanaActual.format("MMMM").slice(1)}
        </h2>

        <div className="flex justify-between items-center w-full max-w-4xl">
          <button onClick={retrocederSemana} className="px-3 py-1 bg-gray-300 rounded-lg hover:bg-gray-400 transition">
            &lt; Semana anterior
          </button>

          <h1 className="text-2xl font-bold text-gray-800">
            Semana del {semanaActual.format('DD/MM/YYYY')}
          </h1>

          <button onClick={avanzarSemana} className="px-3 py-1 bg-gray-300 rounded-lg hover:bg-gray-400 transition">
            Semana siguiente &gt;
          </button>
        </div>
      </div>

      {/* Agenda */}
      <div className="flex-1 overflow-auto bg-white rounded-xl shadow-md border border-gray-400 relative">

        <div className="grid" style={{ gridTemplateColumns: "70px repeat(7, 1fr)", gridAutoRows: "45px" }}>

          {/* Fila fija */}
          <div className="border-b border-r border-gray-400 bg-gray-100 sticky top-0 z-10"></div>

          {diasDeLaSemana.map((dia) => (
            <div key={dia.format('YYYY-MM-DD')} className="flex items-center justify-center font-semibold text-gray-700 border-b border-r border-gray-400 bg-gray-50 sticky top-0 z-10">
              {dia.format("dddd DD")}
            </div>
          ))}

          {/* Filas */}
          {horas.map((h) => (
            <React.Fragment key={h}>

              <div className="flex items-center justify-center text-xs font-medium border-b border-r border-gray-500 bg-gray-100 text-gray-700">
                {h}
              </div>

              {diasDeLaSemana.map((dia) => {
                const turno = obtenerTurno(dia, h);

                return (
                  <div
                    key={dia.format("YYYY-MM-DD") + h}
                    onClick={() => !turno && abrirModal(dia, h)}
                    onContextMenu={(e) => {
                      if (!turno) return;
                      handleContextMenuOnTurno(e, turno);
                    }}
                    className={`flex items-center justify-center border-b border-r border-gray-400 text-base font-bold transition-colors cursor-pointer ${colorTurno(dia, turno)}`}
                  >
                    {turno ? turno.nombre : ''}
                  </div>
                );
              })}

            </React.Fragment>
          ))}

        </div>
      </div>

      {/* Menú contextual (click derecho) */}
      {contextMenu && (
        <div
          className="fixed bg-white shadow-xl border border-gray-300 rounded-lg z-[9999]"
          style={{
            top: contextMenu.y,
            left: contextMenu.x,
            transform: 'translate(0, 0)',
            minWidth: 160,
          }}
          onClick={(e) => e.stopPropagation()} /* evitar que el click dentro lo cierre inmediatamente */
        >
          <button
            onClick={eliminarTurno}
            className="px-4 py-2 w-full text-left text-red-600 hover:bg-red-100"
          >
            Eliminar turno
          </button>
        </div>
      )}

      {/* MODAL */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-80 flex flex-col gap-3">
            <h2 className="text-xl font-bold text-gray-800">Nuevo turno</h2>

            {error && <div className="text-red-600 font-semibold bg-red-100 border border-red-400 p-2 rounded">{error}</div>}

            <form onSubmit={guardarTurno} className="flex flex-col gap-3">
              <input type="text" value={cuil} onChange={(e) => setCuil(e.target.value)} placeholder="Nombre del paciente" className="border p-2 rounded" />

              <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} className="border p-2 rounded" />

              <input type="time" value={hora} onChange={(e) => setHora(e.target.value)} className="border p-2 rounded" />

              <button type="submit" className="bg-blue-500 text-white py-2 rounded">Guardar turno</button>

              <button type="button" onClick={() => setMostrarModal(false)} className="text-sm text-red-500 underline mt-1">
                Cancelar
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
