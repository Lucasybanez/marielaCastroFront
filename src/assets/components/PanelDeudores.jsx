import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function PanelDeudores() {
  const [deudores, setDeudores] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDeudores = async () => {
      try {
        const res = await axios.get('http://localhost:8001/api/deudores');
        setDeudores(res.data);
      } catch (error) {
        console.error('Error al obtener deudores:', error);
      }
    };

    const fetchPacientes = async () => {
      try {
        const res = await axios.get('http://localhost:8001/api/pacientes');
        setPacientes(res.data);
      } catch (error) {
        console.error('Error al obtener pacientes:', error);
      }
    };

    fetchDeudores();
    fetchPacientes();
  }, []);

  const handleDobleClick = (cuil) => {
    const paciente = pacientes.find((p) => p.cuil === cuil);
    if (paciente) {
      navigate('/paciente', { state: { paciente } });
    } else {
      console.warn('Paciente no encontrado con CUIL:', cuil);
    }
  };

return (
  <div className="flex flex-col h-full">
    <h2 className="text-xl font-semibold text-center mb-4 text-blue-800">
      Cobros Pendientes
    </h2>

    <div className="overflow-y-auto flex-1 space-y-2 pr-2 max-h-180">
      {deudores.length === 0 ? (
        <p className="text-gray-500 text-center">No hay cobros pendientes</p>
      ) : (
        deudores.map((d, index) => (
          <div
            key={index}
            className="border rounded-xl p-3 shadow-sm bg-blue-50 flex justify-between items-center cursor-pointer hover:bg-blue-100 transition"
            onDoubleClick={() => handleDobleClick(d.cuil)}
            title="Doble click para ver paciente"
          >
            <div>
              <p className="text-sm font-semibold text-blue-900">{d.nombre}</p>
              <p className="text-xs text-gray-600">
                Fecha: {new Date(d.fecha).toLocaleDateString()}
              </p>
            </div>
            <div className="text-red-600 font-bold text-sm">
              ${Number(d.debe).toLocaleString("es-AR")}
            </div>
          </div>
        ))
      )}
    </div>
  </div>
);

}
