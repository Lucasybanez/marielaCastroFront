import React, { useEffect, useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
dayjs.locale('es');

export default function Turnos() {
  const [turnos, setTurnos] = useState([]);
  const [now, setNow] = useState(dayjs()); // ⏱️ Estado que actualiza cada minuto

  useEffect(() => {
    fetchTurnos();
  }, []);

  // 🔁 Actualiza la hora actual cada 60 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(dayjs());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const fetchTurnos = async () => {
    try {
      const res = await axios.get('http://localhost:8001/api/turnos');
      setTurnos(res.data || []);
    } catch (error) {
      console.error('Error al cargar turnos:', error);
    }
  };

  const hoy = dayjs().format('YYYY-MM-DD');
  const manana = dayjs().add(1, 'day').format('YYYY-MM-DD');

  const turnosFiltrados = turnos.filter(t => t.fecha === hoy || t.fecha === manana);

  const turnosPorDia = turnosFiltrados.reduce((acc, turno) => {
    if (!acc[turno.fecha]) acc[turno.fecha] = [];
    acc[turno.fecha].push(turno);
    return acc;
  }, {});

  const formatearFecha = (fecha) =>
    dayjs(fecha).format("dddd DD/MM").replace(/^[a-z]/, (c) => c.toUpperCase());

  // ---------- lógica para identificar la franja de 30 minutos actual ----------
  const minutoSlot = now.minute() < 30 ? 0 : 30;
  const slotNowStr = now.minute(minutoSlot).second(0).format('HH:mm');

  const turnoActual = turnosFiltrados.find(
    t => t.fecha === hoy && String(t.hora).startsWith(slotNowStr)
  ) || null;
  // ---------------------------------------------------------------------------

  return (
    <div className="bg-white rounded-2xl p-4 w-full shadow-md flex flex-col justify-between h-full">

      <div className="overflow-y-auto max-h-[650px] pr-2">
        {Object.entries(turnosPorDia).map(([fecha, lista]) => (
          <div key={fecha} className="mb-4">
            <h2 className="font-bold text-lg mb-2">{formatearFecha(fecha)}</h2>

            <div className="flex flex-col gap-1">
              {lista.map((turno) => {
                const isActivo =
                  turnoActual && turno.id_turno === turnoActual.id_turno;

                const isActivoAlt =
                  !turnoActual &&
                  turno.fecha === hoy &&
                  String(turno.hora).startsWith(slotNowStr);

                return (
                  <div
                    key={turno.id_turno ?? `${turno.fecha}-${turno.hora}`}
                    className={`flex items-center justify-between p-2 rounded ${
                      isActivo || isActivoAlt
                        ? 'border-2 border-blue-600 bg-blue-50 shadow-sm'
                        : ''
                    }`}
                  >
                    <span className="text-green-700 font-medium">
                      {String(turno.hora).slice(0, 5)}
                    </span>
                    <span className="text-gray-600">{turno.paciente}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => window.location.href = '/turnos'}
        className="mt-4 bg-blue-600 text-white py-3 rounded-lg font-semibold text-center"
      >
        Ir a Agenda
      </button>
    </div>
  );
}
