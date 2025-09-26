import { useLocation } from "react-router-dom";
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar"; // Asegurate de importar correctamente

export default function GaleriaPaciente() {
  const location = useLocation();
  const paciente = location.state?.paciente; // <-- esto viene del navigate
  const nombreSanitizado = paciente?.nombre?.replace(/\s+/g, "_") || "";

  const [imagenes, setImagenes] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [imgIndex, setImgIndex] = useState(0);

  useEffect(() => {
    if (!nombreSanitizado) return;

    axios
      .get(`http://localhost:8001/api/pacientes/${nombreSanitizado}/imagenes`)
      .then((res) => {setImagenes(res.data.imagenes);console.log("llegó a la galería:",res.data);})
      .catch((err) => console.error("Error al cargar imágenes:", err));
  }, [nombreSanitizado]);

  if (!paciente) return <div className="p-4">No hay paciente seleccionado.</div>;
  if (!imagenes.length) return <h2 className="text-3xl font-bold m-10">No hay imágenes para mostrar.</h2>;

  const abrirModal = (index) => setImgIndex(index) || setModalOpen(true);
  const cerrarModal = () => setModalOpen(false);
  const siguienteImagen = () => setImgIndex((prev) => (prev + 1) % imagenes.length);
  const anteriorImagen = () => setImgIndex((prev) => (prev - 1 + imagenes.length) % imagenes.length);

  return (
    <div>
    <Navbar titulo="Galería" />
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Galería de {paciente.nombre}</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        {imagenes.map((img, i) => (
          <div key={i} className="relative group cursor-pointer">
            <img
              src={`http://localhost:8001${img}`}
              alt={img.titulo}
              className="w-full h-full object-cover rounded-lg shadow hover:scale-105 transition-transform"
              onClick={() => abrirModal(i)}
              loading="lazy"      // importante para que no cargue todo de golpe

            />
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-sm p-1 text-center rounded-b-lg">
              {img.titulo}
            </div>
          </div>
        ))}
      </div>

{modalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
    <div className="relative bg-white rounded-lg overflow-hidden max-w-4xl w-full">
      <button
        className="absolute top-2 right-2 text-white bg-red-600 rounded-full p-2 font-bold"
        onClick={cerrarModal}
      >
        ✕
      </button>

      <img
        src={`http://localhost:8001${imagenes[imgIndex]}`}
        alt={imagenes[imgIndex].titulo}
        className="w-full max-h-[80vh] object-contain p-4"
      />
      <div className="text-center p-2 font-semibold">{imagenes[imgIndex].titulo}</div>

      <button
        className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white bg-gray-700 bg-opacity-50 rounded-full p-2 font-bold"
        onClick={anteriorImagen}
      >
        ‹
      </button>
      <button
        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white bg-gray-700 bg-opacity-50 rounded-full p-2 font-bold"
        onClick={siguienteImagen}
      >
        ›
      </button>
    </div>
  </div>
)}

    </div>
    </div>

  );
}
