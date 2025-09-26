import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const colores = ["Nada", "Color Rojo", "Color Azul"];
const simbolos = [
  "X",
  "=",
  "●",
  "▭",
  "ㄇ",
  "O",
  "PM",
  "PD",
  "Rx",
];

export default function PiezaOdontograma(props) {
  const [estados, setEstados] = useState({
    center: "Nada",
    top: "Nada",
    bottom: "Nada",
    left: "Nada",
    right: "Nada",
  });

  const [estadoPieza, setEstadoPieza] = useState("Nada");

  const [modalAbierto, setModalAbierto] = useState(false);
  const [zonaSeleccionada, setZonaSeleccionada] = useState(null);

  // Cargar datos desde props al montar el componente
  useEffect(() => {
    if (!props.datos || props.datos.length === 0) return;

    const nuevosEstados = { ...estados };

    props.datos.forEach((d) => {
      if (d.parte === "pieza") {
        setEstadoPieza(d.contenido);
      } else {
        nuevosEstados[d.parte] = d.contenido;
      }
    });

    setEstados(nuevosEstados);
  }, [props.datos]);

  const abrirModal = (zona) => {
    setZonaSeleccionada(zona);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setZonaSeleccionada(null);
  };

const guardarEnBD = async (parte, contenido) => {
  if (!props.idDiente || !props.cuil) return;

  const payload = {
    id_diente: props.idDiente,
    id_paciente: props.cuil,
    parte,
    contenido,
  };

  const existente = props.datos?.find((d) => d.parte === parte);

  try {
    if (existente) {
      await axios.put(`http://localhost:8001/api/odontograma/${existente.id}`, payload);
      console.log("SE INTENTÓ UPDEAR EN BD", payload);
    } else {
      await axios.post("http://localhost:8001/api/odontograma", payload);
      console.log("SE INTENTÓ GUARDAR EN BD", payload);
      props.onRefresh?.(); // 🔁 actualiza los datos en el padre si existe esta prop
    }
  } catch (error) {
    Swal.fire("Error", "Ocurrió un error al guardar en la base de datos.", "error");
    console.log("SE INTENTÓ CON ERROR", payload);
  }
};



const seleccionarColor = (color) => {
  const nuevoEstado = { ...estados, [zonaSeleccionada]: color };
  setEstados(nuevoEstado);         // ✅ primero actualiza estado
  guardarEnBD(zonaSeleccionada, color);  // ✅ luego guarda en BD
  cerrarModal();
};

  const seleccionarSimbolo = (simbolo) => {
    setEstadoPieza(simbolo);
    guardarEnBD("pieza", simbolo);
    cerrarModal();
  };

  const renderContenidoSimbolo = () => {
    if (estadoPieza === "Nada") return null;
    if (estadoPieza === "circulo negro") {
      return (
        <div className="absolute w-12 h-12 rounded-full bg-black opacity-80" />
      );
    }
    return (
  <span className="absolute text-7xl font-bold text-black opacity-80 pointer-events-none">
        {estadoPieza}
      </span>
    );
  };

  const getFondo = (zona) => {
    const estado = estados[zona];
    if (estado === "Color Rojo") return "bg-red-500";
    if (estado === "Color Azul") return "bg-blue-500";
    return "bg-white";
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gray-100">
      {/* Modal */}
      {modalAbierto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-2">Color para la zona</h2>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {colores.map((color) => (
                <button
                  key={color}
                  className="border border-gray-300 rounded px-2 py-1 hover:bg-gray-200 text-sm"
                  onClick={() => seleccionarColor(color)}
                >
                  {color}
                </button>
              ))}
            </div>
            <h2 className="text-lg font-semibold mb-2">Estado de la pieza</h2>
            <div className="grid grid-cols-3 gap-2">
              {simbolos.map((simbolo) => (
                <button
                  key={simbolo}
                  className="border border-gray-300 rounded px-2 py-1 hover:bg-gray-200 text-sm"
                  onClick={() => seleccionarSimbolo(simbolo)}
                >
                  {simbolo}
                </button>
              ))}
            </div>
            <button
              className="mt-4 w-full bg-red-500 text-white py-1 rounded"
              onClick={cerrarModal}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      <h2 className="text-xs mb-1">{props.idDiente}</h2>

      {/* Top */}
      <div
        className={`w-12 h-6 border border-gray-400 cursor-pointer flex items-center justify-center ${getFondo("top")}`}
        onClick={() => abrirModal("top")}
      />

      <div className="flex">
        {/* Left */}
        <div
          className={`w-6 h-12 border border-gray-400 cursor-pointer flex items-center justify-center ${getFondo("left")}`}
          onClick={() => abrirModal("left")}
        />

        {/* Center */}
        <div
          className={`relative w-12 h-12 border border-gray-400 cursor-pointer flex items-center justify-center ${getFondo("center")}`}
          onClick={() => abrirModal("center")}
        >
          {renderContenidoSimbolo()}
        </div>

        {/* Right */}
        <div
          className={`w-6 h-12 border border-gray-400 cursor-pointer flex items-center justify-center ${getFondo("right")}`}
          onClick={() => abrirModal("right")}
        />
      </div>

      {/* Bottom */}
      <div
        className={`w-12 h-6 border border-gray-400 cursor-pointer flex items-center justify-center ${getFondo("bottom")}`}
        onClick={() => abrirModal("bottom")}
      />
    </div>
  );
}
