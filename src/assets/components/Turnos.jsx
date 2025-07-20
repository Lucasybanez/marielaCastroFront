import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Turnos() {
  const [turnosAgrupados, setTurnosAgrupados] = useState([]);
  const [cuil, setCuil] = useState('');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [modoEdicion, setModoEdicion] = useState(false);
  const [idTurnoEditando, setIdTurnoEditando] = useState(null);
  const [menuAbierto, setMenuAbierto] = useState(null);

  useEffect(() => {
    fetchTurnos();
  }, []);

  const fetchTurnos = async () => {
    try {
      const res = await axios.get('http://localhost:8001/api/turnos');
      setTurnosAgrupados(res.data);
    } catch (error) {
      console.error('Error al cargar turnos:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const turnoPost = {
      id_paciente: cuil,
      fecha,
      hora,
    };

    try {
      if (modoEdicion) {
        await axios.put(`http://localhost:8001/api/turno/${idTurnoEditando}`, turnoPost);
        setModoEdicion(false);
        setIdTurnoEditando(null);
      } else {
        await axios.post('http://localhost:8001/api/turno', turnoPost);
      }
      setCuil('');
      setFecha('');
      setHora('');
      fetchTurnos();
    } catch (error) {
      console.error('Error al guardar turno:', error);
      console.log("->", turnoPost);
    }
  };

  const handleEditar = (turno) => {
    console.log("->",turno)
    setCuil(turno.cuil);
    setFecha(turno.fecha);
    setHora(turno.hora);
    setModoEdicion(true);
    setIdTurnoEditando(turno.id_turno);
    setMenuAbierto(null);
  };

  const handleEliminar = async (id_turno) => {
    try {
      await axios.delete(`http://localhost:8001/api/turno/${id_turno}`);
      fetchTurnos();
    } catch (error) {
      console.error('Error al eliminar turno:', error);
    }
  };

  const cancelarEdicion = () => {
    setModoEdicion(false);
    setIdTurnoEditando(null);
    setCuil('');
    setFecha('');
    setHora('');
  };

  return (
    <div className="bg-white rounded-2xl p-4 w-full shadow-md flex flex-col justify-between h-full">
      <div>
        {turnosAgrupados.map((dia, index) => (
          <div key={index} className="mb-4">
            <h2 className="font-bold text-lg mb-2">{dia.fecha}</h2>
            <div className="flex flex-col gap-1">
              {dia.turnos.map((turno) => (
                <div key={turno.id} className="flex items-center justify-between">
                    <span className="text-green-700 font-medium">{turno.hora}</span>
                    <span className="text-gray-600">{turno.nombre}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditar(turno)}
                        className="p-2 text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <i className="fas fa-pen"></i>
                      </button>
                      <button
                        onClick={() => handleEliminar(turno.id_turno)}
                        className="p-2 text-red-600 hover:text-red-800 transition-colors"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>

                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-2">
        <input
          type="text"
          value={cuil}
          onChange={(e) => setCuil(e.target.value)}
          placeholder="CUIL del paciente"
          className="border p-2 rounded"
        />
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="time"
          value={hora}
          onChange={(e) => setHora(e.target.value)}
          className="border p-2 rounded"
        />

        <button type="submit" className="bg-blue-500 text-white py-2 rounded">
          {modoEdicion ? 'Editar turno' : 'Agregar turno'}
        </button>

        {modoEdicion && (
          <button
            type="button"
            onClick={cancelarEdicion}
            className="text-sm text-red-500 underline mt-1"
          >
            Cancelar edición
          </button>
        )}
      </form>
    </div>
  );
}
