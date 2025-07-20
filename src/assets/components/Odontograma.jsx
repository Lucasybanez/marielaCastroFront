import React, { useEffect, useState } from "react";
import axios from "axios";
import PiezaOdontograma from "./PiezaOdontograma";

export default function Odontograma({ cuil }) {
  const [datos, setDatos] = useState([]);

  const cargarDatos = async () => {
    if (!cuil) return;
    try {
      const res = await axios.get(`http://localhost:8001/api/odontograma/paciente/${cuil}`);
      setDatos(res.data);
      console.log("ODONTOGRAMA DEL PACIENTE:", res.data);
    } catch (err) {
      console.error("Error al obtener datos del odontograma:", err.message);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, [cuil]);

  const renderFila = (inicio, fin, invertido = false) => {
    const dientes = [];
    const rango = invertido
      ? Array.from({ length: inicio - fin + 1 }, (_, i) => inicio - i)
      : Array.from({ length: fin - inicio + 1 }, (_, i) => inicio + i);

    for (const i of rango) {
      const datosDiente = datos.filter((d) => d.id_diente == i);
      dientes.push(
        <PiezaOdontograma
          key={i}
          idDiente={i}
          datos={datosDiente}
          cuil={cuil}
          onRefresh={cargarDatos} // 🔁 Pasamos esta función al hijo
        />
      );
    }

    return <div className="flex gap-1">{dientes}</div>;
  };

  return (
    <div className="p-4 flex flex-col items-center gap-4">
      {/* Fila superior */}
      <div className="flex gap-8">
        {renderFila(18, 11, true)}
        {renderFila(21, 28)}
      </div>

      {/* Fila inferior */}
      <div className="flex gap-8">
        {renderFila(48, 41, true)}
        {renderFila(31, 38)}
      </div>
    </div>
  );
}
