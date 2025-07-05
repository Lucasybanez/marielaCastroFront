import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function BuscarPaciente() {
  const [pacientes, setPacientes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5050/api/pacientes")
      .then((res) => res.json())
      .then((data) => setPacientes(data))
      .catch((error) => console.error("Error al obtener pacientes:", error));
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Lista de Pacientes</h2>
      <ul className="divide-y divide-gray-300">
        {pacientes.map((paciente) => (
            <li
                key={paciente.id}
                className="p-4 cursor-pointer hover:bg-blue-100 rounded"
                onClick={() =>
                navigate(`/paciente`, { state: { paciente } })
                }
            >
                {paciente.nombre} {paciente.apellido}
            </li>
            ))}
      </ul>
    </div>
  );
}
