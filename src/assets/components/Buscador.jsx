import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar"; // Asegurate de importar correctamente

// Dentro del return


export default function BuscarPaciente() {
  const [pacientes, setPacientes] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8001/api/pacientes")
      .then((res) => res.json())
      .then((data) => setPacientes(data))
      .catch((error) => console.error("Error al obtener pacientes:", error));
  }, []);

  const pacientesFiltrados = pacientes.filter((p) =>
    `${p.nombre} ${p.apellido}`.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-blue-500 flex flex-col">
      <Navbar titulo="Buscar Paciente" />

      {/* Contenido principal */}
      <main className="flex-grow p-6 max-w-4xl mx-auto w-full">
          <input
            type="text"
            placeholder="Buscar por nombre o apellido"
            className="mb-6 p-3 w-full rounded-xl border-2 border-black focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white text-black font-semibold"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        <div className="overflow-x-auto rounded-2xl shadow-lg bg-white">
          <table className="min-w-full divide-y divide-gray-300 rounded-2xl">
            <thead className="bg-blue-800 text-white rounded-2xl">
              <tr>
                <th className="text-left px-6 py-3 rounded-tl-2xl">Nombre</th>
                <th className="text-left px-6 py-3 rounded-tr-2xl">CUIL</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {pacientesFiltrados.map((paciente) => (
                <tr
                  key={paciente.id}
                  className="hover:bg-blue-100 cursor-pointer transition-colors"
                  onClick={() => navigate("/paciente", { state: { paciente } })}
                >
                  <td className="px-6 py-4 font-semibold text-blue-900">
                    {paciente.nombre} {paciente.apellido}
                  </td>
                  <td className="px-6 py-4 text-blue-700">{paciente.cuil}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {pacientesFiltrados.length === 0 && (
            <p className="p-6 text-center text-gray-500">No se encontraron pacientes</p>
          )}
        </div>
      </main>
    </div>
  );
}
