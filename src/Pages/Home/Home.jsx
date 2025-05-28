import React from "react";
import Turnos from "../../assets/components/Turnos";
import { useNavigate } from "react-router-dom";

export default function Home() {
    const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-blue-500">
      {/* Header */}
      <header className="bg-blue-800 text-white px-6 py-4 flex items-center space-x-4">
        <img src="/tooth-icon.png" alt="Icono" className="w-8 h-8" />
        <h1 className="text-xl font-semibold">Mariela Castro</h1>
      </header>

      {/* Main content layout */}
      <div className="grid grid-cols-3 gap-4 p-6">
        {/* Turnos próximos */}
            <Turnos/>

        {/* Área central con botones */}
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="w-28 h-28 bg-white rounded-full" />
          <button onClick={() => navigate(`/buscar`)} className="bg-blue-800 text-white font-semibold px-6 py-2 rounded-xl">
            Buscar paciente
          </button>
          <button onClick={() => navigate(`/crear`)} className="border-2 border-white text-white font-semibold px-6 py-2 rounded-xl">
            Crear Ficha
          </button>
        </div>

        {/* Cobros pendientes */}
        <div className="bg-white rounded-2xl p-4 min-h-[800px] w-2/3 m-auto">
          {/* Aquí irá el componente de cobros */}
        </div>
      </div>
    </div>
  );
}
