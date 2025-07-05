import React, { useState } from "react";

const opciones = [
  "Nada",
  "Color Rojo",
  "Color Azul",
  "X",
  "=",
  "circulo negro",
  "▭",
  "ㄇ",
  "O",
  "PM",
  "PD",
  "Rx",
];

export default function PiezaOdontograma() {
  const [estados, setEstados] = useState({
    center: "Nada",
    top: "Nada",
    bottom: "Nada",
    left: "Nada",
    right: "Nada",
  });

  const [modalAbierto, setModalAbierto] = useState(false);
  const [zonaSeleccionada, setZonaSeleccionada] = useState(null);

  const abrirModal = (zona) => {
    setZonaSeleccionada(zona);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setZonaSeleccionada(null);
  };

  const seleccionarOpcion = (opcion) => {
    setEstados((prev) => ({ ...prev, [zonaSeleccionada]: opcion }));
    cerrarModal();
  };

  const renderContenido = (valor) => {
    if (valor === "Color Rojo" || valor === "Color Azul" || valor === "Nada") return null;
    if (valor === "circulo negro") {
      return <div className="w-6 h-6 rounded-full bg-black" />;
    }
    return <span className="text-4xl font-bold">{valor}</span>;
  };

  const getFondo = (zona) => {
    const estado = estados[zona];
    if (estado === "Color Rojo") return "bg-red-500";
    if (estado === "Color Azul") return "bg-blue-500";
    return "bg-white";
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {/* Modal */}
      {modalAbierto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-4">Selecciona una opción</h2>
            <div className="grid grid-cols-3 gap-2">
              {opciones.map((opcion) => (
                <button
                  key={opcion}
                  className="border border-gray-300 rounded px-2 py-1 hover:bg-gray-200 text-sm"
                  onClick={() => seleccionarOpcion(opcion)}
                >
                  {opcion}
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

      {/* Top */}
      <div
        className={`w-32 h-16 border border-gray-400 cursor-pointer flex items-center justify-center ${getFondo(
          "top"
        )}`}
        onClick={() => abrirModal("top")}
      >
        {renderContenido(estados.top)}
      </div>

      <div className="flex">
        {/* Left */}
        <div
          className={`w-16 h-32 border border-gray-400 cursor-pointer flex items-center justify-center ${getFondo(
            "left"
          )}`}
          onClick={() => abrirModal("left")}
        >
          {renderContenido(estados.left)}
        </div>

        {/* Center */}
        <div
          className={`w-32 h-32 border border-gray-400 cursor-pointer flex items-center justify-center ${getFondo(
            "center"
          )}`}
          onClick={() => abrirModal("center")}
        >
          {renderContenido(estados.center)}
        </div>

        {/* Right */}
        <div
          className={`w-16 h-32 border border-gray-400 cursor-pointer flex items-center justify-center ${getFondo(
            "right"
          )}`}
          onClick={() => abrirModal("right")}
        >
          {renderContenido(estados.right)}
        </div>
      </div>

      {/* Bottom */}
      <div
        className={`w-32 h-16 border border-gray-400 cursor-pointer flex items-center justify-center ${getFondo(
          "bottom"
        )}`}
        onClick={() => abrirModal("bottom")}
      >
        {renderContenido(estados.bottom)}
      </div>
    </div>
  );
}
