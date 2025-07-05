import { useParams } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import PiezaOdontograma from './PiezaOdontograma'
import axios from 'axios'

export default function PacienteDatos() {
  const location = useLocation()
  const paciente = location.state?.paciente
  console.log("Llegó->", paciente)
  const [preguntas, setPreguntas] = useState([])
  const [atenciones, setAtenciones] = useState([]) // <--- NUEVO

  useEffect(() => {
    axios.get(`http://localhost:5050/api/respuestas/paciente/${paciente.cuil}`)
      .then(response => {
        setPreguntas(response.data)
        console.log("RESPUESTAS->", response.data)
      })
      .catch(error => console.error('Error al cargar preguntas:', error))

    // <-- SEGUNDA PETICIÓN GET
    axios.get('http://localhost:5050/api/atenciones')
      .then(response => {
        const filtradas = response.data.filter(a => a.id_paciente === paciente.cuil)
        setAtenciones(filtradas)
        console.log("ATENCIONES->", filtradas)
      })
      .catch(error => console.error('Error al cargar atenciones:', error))
  }, [])

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
  const edad = calcularEdad(paciente.fecha_nacimiento)

  if (!paciente) return <div>Cargando datos del paciente...</div>

  return (
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
    <span className="text-green-600 font-semibold">
      {preguntas[0].respuesta.toLowerCase() === 'si' ? 'Sí' : 'No'}
    </span>
  )}</div>
            <div>Está bajo algún tratamiento médico: {preguntas && preguntas[1] && (
    <span className="text-green-600 font-semibold">
      {preguntas[1].respuesta.toLowerCase() === 'si' ? 'Sí' : 'No'}
    </span>
  )}</div>
          <div>Tratamiento por osteoporosis: {preguntas && preguntas[2] && (
    <span className="text-green-600 font-semibold">
      {preguntas[2].respuesta.toLowerCase() === 'si' ? 'Sí' : 'No'}
    </span>
  )}</div>
          <div>Tratamiento por insulina: {preguntas && preguntas[4] && (
    <span className="text-green-600 font-semibold">
      {preguntas[4].respuesta.toLowerCase() === 'si' ? 'Sí' : 'No'}
    </span>
  )}</div>
            <div>Toma bifosfonatos: {preguntas && preguntas[5] && (
    <span className="text-green-600 font-semibold">
      {preguntas[5].respuesta.toLowerCase() === 'si' ? 'Sí' : 'No'}
    </span>
  )}</div>
      <div>Reacción alérgica: {preguntas && preguntas[6] && (
<span className="text-red-600 font-semibold">
{preguntas[6].respuesta}
</span>
)}</div>
            <div>Sangrado excesivo por extracción: {preguntas && preguntas[7] && (
    <span className="text-green-600 font-semibold">
      {preguntas[7].respuesta}
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
      

      <div className="my-6 text-center">
        <a href="#" className="text-blue-700 underline">Ver más datos</a>
      </div>

                <h2 className="text-3xl font-bold mt-10 mb-4">Odontograma</h2>
      <PiezaOdontograma/>
      
      <h2 className="text-3xl font-bold mt-10 mb-4">Historial</h2>
      <div className="my-4 flex justify-end">
  <button
    onClick={() => {
        
        window.location.href = `/atenciones?cuil=${encodeURIComponent(paciente.cuil)}`;
      }
    }
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
              <th className="border px-4 py-2">Pieza</th>
              <th className="border px-4 py-2">Lesión</th>
              <th className="border px-4 py-2">Observaciones</th>
              <th className="border px-4 py-2">Importe</th>
              <th className="border px-4 py-2">Pagos</th>
              <th className="border px-4 py-2">Saldo</th>
            </tr>
          </thead>
          <tbody>
            {atenciones.length > 0 ? (
              atenciones.map((a, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2 h-10">{a.fecha}</td>
                  <td className="border px-4 py-2">{a.prestacion}</td>
                  <td className="border px-4 py-2">{a.pieza}</td>
                  <td className="border px-4 py-2">{a.lesion}</td>
                  <td className="border px-4 py-2">{a.observaciones}</td>
                  <td className="border px-4 py-2">${a.importe}</td>
                  <td className="border px-4 py-2">${a.pagos}</td>
                  <td className="border px-4 py-2">${a.saldo}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center border py-4 text-gray-500">No hay atenciones registradas.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
