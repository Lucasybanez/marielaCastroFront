// src/components/Turnos.jsx
import React from 'react';

const turnosDeEjemplo = [
  {
    fecha: 'Hoy: Lunes 07/08',
    turnos: [
      { hora: '11:30', nombre: 'Lucas Ybañez' },
      { hora: '12:00', nombre: 'Omar Pérez' },
      { hora: '17:00', nombre: 'Gabriel Tejada' },
    ],
  },
  {
    fecha: 'Mañana: Martes 08/08',
    turnos: [
      { hora: '11:30', nombre: 'Lucas Ybañez' },
      { hora: '11:30', nombre: 'Lucas Ybañez' },
      { hora: '11:30', nombre: 'Lucas Ybañez' },
    ],
  },
  {
    fecha: 'Miércoles 09/08',
    turnos: [
      { hora: '11:30', nombre: 'Lucas Ybañez' },
      { hora: '11:30', nombre: 'Lucas Ybañez' },
      { hora: '11:30', nombre: 'Lucas Ybañez' },
      { hora: '11:30', nombre: 'Lucas Ybañez' },
    ],
  },
];

export default function Turnos() {
  return (
    <div className="bg-white rounded-2xl p-4 w-full max-w-xs shadow-md flex flex-col justify-between h-full">
      <div>
        {turnosDeEjemplo.map((dia, index) => (
          <div key={index} className="mb-4">
            <h2 className="font-bold text-lg mb-2">{dia.fecha}</h2>
            <div className="space-y-1">
              {dia.turnos.map((turno, i) => (
                <div key={i} className="flex justify-between border-b border-gray-400 pb-1 text-sm">
                  <span className="text-green-600 font-bold">{turno.hora}</span>
                  <span className='text-gray-900 font-bold'>{turno.nombre}</span>
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
