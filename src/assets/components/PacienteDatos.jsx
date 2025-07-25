import { useParams, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'
import PiezaOdontograma from './PiezaOdontograma'
import { useNavigate } from "react-router-dom";
import Odontograma from './Odontograma'
import OdontogramaInfantil from './OdontogramaInfantil'
import Navbar from "./Navbar"; // Asegurate de importar correctamente


export default function PacienteDatos() {
  const location = useLocation()
  const paciente = location.state?.paciente
  console.log("Llegó->", paciente)
  const [preguntas, setPreguntas] = useState([])
  const [atenciones, setAtenciones] = useState([])
  const navigate = useNavigate();

  // PARA PAGOS
  const [showModal, setShowModal] = useState(false)
  const [pagoActual, setPagoActual] = useState(0)
  const [nuevoPago, setNuevoPago] = useState('')
  const [atencionSeleccionada, setAtencionSeleccionada] = useState(null)
  //

  useEffect(() => {
    if (!paciente) return;

    axios.get(`http://localhost:8001/api/respuestas/paciente/${paciente.cuil}`)
      .then(response => {
        setPreguntas(response.data)
        console.log("RESPUESTAS->", response.data)
      })
      .catch(error => console.error('Error al cargar preguntas:', error))

    cargarAtenciones()
  }, [paciente])

  const cargarAtenciones = () => {
    axios.get('http://localhost:8001/api/atenciones')
      .then(response => {
        const filtradas = response.data.filter(a => a.id_paciente === paciente.cuil)
        setAtenciones(filtradas)
        console.log("ATENCIONES->", filtradas)
      })
      .catch(error => console.error('Error al cargar atenciones:', error))
  }

  const calcularEdad = (fechaNacimiento) => {
    const hoy = new Date()
    const nacimiento = new Date(fechaNacimiento)
    let edad = hoy.getFullYear() - nacimiento.getFullYear()
    const mes = hoy.getMonth() - nacimiento.getMonth()

    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--
    }

    return edad
  }
  const edad = calcularEdad(paciente?.fecha_nacimiento)

  if (!paciente) return <div>Cargando datos del paciente...</div>

  return (
    <div>

      <Navbar titulo="Perfil paciente" />
    <div className="p-6 mx-auto bg-white">
      <h2 className="text-3xl font-bold mb-6">Datos del paciente cuil #{paciente.cuil}</h2>

      <div className="border rounded-lg overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 bg-blue-50 font-semibold text-blue-900 p-4">
          <div>Nombre y apellido:</div>
          <div className="md:col-span-2 text-black font-normal">{paciente.nombre}</div>

          <div>Fecha de nacimiento:</div>
          <div className="md:col-span-2 text-black font-normal">{paciente.fecha_nacimiento}</div>

          <div>Edad:</div>
          <div className="md:col-span-2 text-black font-normal">{edad} años</div>

          <div>Domicilio:</div>
          <div className="md:col-span-2 text-black font-normal">{paciente.domicilio}</div>

          <div>Localidad:</div>
          <div className="md:col-span-2 text-black font-normal">{paciente.localidad}</div>

          <div>Teléfono:</div>
          <div className="md:col-span-2 text-black font-normal">{paciente.telefono}</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 p-4 text-sm border-t">
          <div>Hospitalizado en estos dos años: {preguntas && preguntas[0] && (
            <span className={preguntas[0].respuesta.toLowerCase() === 'si' ? 'text-red-600 font-semibold' : 'text-green-600 font-semibold'}>
              {preguntas[0].respuesta.toLowerCase() === 'si' ? 'Sí' : 'No'}
            </span>
          )}</div>

          <div>Está bajo algún tratamiento médico: {preguntas && preguntas[1] && (
            <span className={preguntas[1].respuesta.toLowerCase() === 'si' ? 'text-red-600 font-semibold' : 'text-green-600 font-semibold'}>
              {preguntas[1].respuesta.toLowerCase() === 'si' ? 'Sí' : 'No'}
            </span>
          )}</div>

          <div>Tratamiento por osteoporosis: {preguntas && preguntas[2] && (
            <span className={preguntas[2].respuesta.toLowerCase() === 'si' ? 'text-red-600 font-semibold' : 'text-green-600 font-semibold'}>
              {preguntas[2].respuesta.toLowerCase() === 'si' ? 'Sí' : 'No'}
            </span>
          )}</div>

          <div>Tratamiento por insulina: {preguntas && preguntas[4] && (
            <span className={preguntas[4].respuesta.toLowerCase() === 'si' ? 'text-red-600 font-semibold' : 'text-green-600 font-semibold'}>
              {preguntas[4].respuesta.toLowerCase() === 'si' ? 'Sí' : 'No'}
            </span>
          )}</div>

          <div>Toma bifosfonatos: {preguntas && preguntas[5] && (
            <span className={preguntas[5].respuesta.toLowerCase() === 'si' ? 'text-red-600 font-semibold' : 'text-green-600 font-semibold'}>
              {preguntas[5].respuesta.toLowerCase() === 'si' ? 'Sí' : 'No'}
            </span>
          )}</div>

          <div>Reacción alérgica: {preguntas && preguntas[6] && (
            <span className="text-red-600 font-semibold">
              {preguntas[6].respuesta}
            </span>
          )}</div>

          <div>Sangrado excesivo por extracción: {preguntas && preguntas[7] && (
            <span className={preguntas[7].respuesta.toLowerCase() === 'si' ? 'text-red-600 font-semibold' : 'text-green-600 font-semibold'}>
              {preguntas[7].respuesta.toLowerCase() === 'si' ? 'Sí' : 'No'}
            </span>
          )}</div>
        </div>
        <div className='m-4 text-black font-semibold'>
          <p className>Condiciones presentadas:</p>
          {preguntas.some(p => p.id_pregunta === 9) ? (
            preguntas
              .filter(p => p.id_pregunta === 9)
              .map((p, index) => (
                <span key={index} className="m-1 text-red-500 font-normal">
                  {p.respuesta
                    .replace(/([A-Z])/g, ' $1')
                    .replace(/^./, str => str.toUpperCase())},
                </span>
              ))
          ) : (
            <div className="m-4 text-gray-500">No hay condiciones presentadas.</div>
          )}
        </div>
      </div>

      <h2 className="text-3xl font-bold mt-10 mb-4">Odontograma</h2>
      <Odontograma cuil={paciente.cuil} />
      <OdontogramaInfantil cuil={paciente.cuil} />

      <h2 className="text-3xl font-bold mt-10 mb-4">Historial</h2>
      <div className="my-4 flex justify-end">
        <button
          onClick={() => navigate("/atenciones", { state: { paciente } })}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded"
        >
          Registrar atención
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-blue-500 text-white">
              <th className="border px-4 py-2">Fecha</th>
              <th className="border px-4 py-2">Prestación</th>
              <th className="border px-4 py-2">Lesión</th>
              <th className="border px-4 py-2">Observaciones</th>
              <th className="border px-4 py-2">Importe</th>
              <th className="border px-4 py-2">Pagos</th>
              <th className="border bg-red-500 px-4 py-2">Saldo</th>
            </tr>
          </thead>
          <tbody>
            {atenciones.length > 0 ? (
              atenciones.map((a, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2 h-10">{a.fecha}</td>
                  <td className="border px-4 py-2">{a.prestacion}</td>
                  <td className="border px-4 py-2">{a.lesion}</td>
                  <td className="border px-4 py-2">{a.observaciones}</td>
                  <td className="border px-4 py-2">${parseInt(a.importe).toLocaleString('es-AR')}</td>
                  <td className="border px-4 py-2 flex items-center justify-between">
                    ${parseInt(a.pagado).toLocaleString('es-AR')}
                    <button
                      onClick={() => {
                        setPagoActual(a.pagado)
                        setNuevoPago('')
                        setAtencionSeleccionada(a)
                        setShowModal(true)
                      }}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                      title="Editar pago"
                    >
                      ✏️
                    </button>
                  </td>
                  <td className="border px-4 py-2">${parseInt(a.importe - a.pagado).toLocaleString('es-AR')}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center border py-4 text-gray-500">No hay atenciones registradas.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && atencionSeleccionada && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-xl w-96 shadow-lg">
            <h3 className="text-xl font-bold mb-4">Actualizar pago</h3>
            <p className="mb-2">El paciente ya abonó <span className="font-semibold text-green-600">${parseInt(pagoActual)}</span>.</p>
            <label className="block mb-2">¿Cuánto pagará ahora?</label>
            <input
              type="number"
              className="w-full p-2 border rounded mb-4"
              value={nuevoPago}
              onChange={(e) => setNuevoPago(e.target.value)}
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 hover:bg-gray-400 text-black font-semibold py-2 px-4 rounded"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  const suma = parseFloat(pagoActual) + parseFloat(nuevoPago)
                  if (isNaN(suma) || suma < 0) return alert('Pago inválido')

                  axios.put(`http://localhost:8001/api/atencion/${atencionSeleccionada.id}`, {
                    pagado: suma
                  })
                    .then(() => {
                      // Refrescar las atenciones
                      cargarAtenciones()
                      setShowModal(false)
                    })
                    .catch(err => {
                      console.error("Error al actualizar pago:", err)
                    })
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
    </div>
  )
}
