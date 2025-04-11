import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Turnos() {
  const [turnosAgrupados, setTurnosAgrupados] = useState([]);

  useEffect(() => {
    const fetchTurnos = async () => {
      try {
        const res = await axios.get('http://localhost:8001/api/turnos');
        setTurnosAgrupados(res.data); // ← ya viene en el formato esperado
      } catch (error) {
        console.error('Error al cargar turnos:', error);
      }
    };

    fetchTurnos();
  }, []);

  return (
    <div className="bg-white rounded-2xl p-4 w-full max-w-xs shadow-md flex flex-col justify-between h-full">
      <div>
        {turnosAgrupados.map((dia, index) => (
          <div key={index} className="mb-4">
            <h2 className="font-bold text-lg mb-2">{dia.fecha}</h2>
            <div className="space-y-1">
              {dia.turnos.map((turno, i) => (
     <div
     key={i}
     className="flex justify-between items-center border-b border-gray-200 pb-1"
   >
     <span className="text-green-700 font-medium">{turno.hora}</span>
     <span className="text-gray-600">{turno.nombre}</span>
   </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={() => alert('Nuevo turno')}
        className="bg-green-500 text-white py-2 px-4 rounded-full flex items-center justify-center mt-4 hover:bg-green-600"
      >
        <span className="text-xl mr-2">＋</span> Nuevo turno
      </button>
    </div>
  );
}
