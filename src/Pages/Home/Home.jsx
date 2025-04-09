import React from "react";

export default function Home() {
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
        <div className="bg-white rounded-2xl p-4 min-h-[800px] w-2/3 m-auto">
          {/* Aquí irá el componente de turnos */}
        </div>

        {/* Área central con botones */}
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="w-28 h-28 bg-white rounded-full" />
          <button className="bg-blue-800 text-white font-semibold px-6 py-2 rounded-xl">
            Buscar paciente
          </button>
          <button className="border-2 border-white text-white font-semibold px-6 py-2 rounded-xl">
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
