import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function ModalNuevoTurno() {
  const [turnosAgrupados, setTurnosAgrupados] = useState([]);
  const [nombre, setNombre] = useState('');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');

  useEffect(() => {
    fetchTurnos();
  }, []);

  const fetchTurnos = async () => {
    try {
      const res = await axios.get('http://localhost:5050/api/turnos');
      setTurnosAgrupados(res.data);
    } catch (error) {
      console.error('Error al cargar turnos:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5050/api/turnos', {
        nombre,
        fecha,
        hora,
      });
      setNombre('');
      setFecha('');
      setHora('');
      fetchTurnos(); // recarga los turnos después de agregar uno nuevo
    } catch (error) {
      console.error('Error al crear turno:', error);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-4 w-full max-w-xs shadow-md flex flex-col justify-between h-full">
      <div>
        {turnosAgrupados.map((dia, index) => (
          <div key={index} className="mb-4">
            <h2 className="font-bold text-lg mb-2">{dia.fecha}</h2>
            <div className="space-y-1">
              {dia.turnos.map((turno, i) => (
                <div key={i} className="flex justify-between items-center border-b border-gray-200 pb-1">
                  <span className="text-green-700 font-medium">{turno.hora}</span>
                  <span className="text-gray-600">{turno.nombre}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="mt-4 space-y-2">
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="border rounded p-2 w-full"
          required
        />
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          className="border rounded p-2 w-full"
          required
        />
        <input
          type="time"
          value={hora}
          onChange={(e) => setHora(e.target.value)}
          className="border rounded p-2 w-full"
          required
        />
        <button
          type="submit"
          className="bg-green-500 text-white py-2 px-4 rounded-full w-full hover:bg-green-600"
        >
          Agregar turno
        </button>
      </form>
    </div>
  );
}
