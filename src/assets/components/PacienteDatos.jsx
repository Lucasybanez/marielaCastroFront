import { useParams } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'

export default function PacienteDatos() {
   const location = useLocation()
  const paciente = location.state?.paciente
    console.log("Llegó->",paciente)
  const [preguntas, setPreguntas] = useState([])

  useEffect(() => {
    axios.get(`http://localhost:8001/api/respuestas/paciente/${paciente.cuil}`)
      .then(response => {setPreguntas(response.data);console.log(response.data)})
      .catch(error => console.error('Error al cargar preguntas:', error))
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
    <div className="p-6 max-w-4xl mx-auto bg-white">
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
      {preguntas[0].respuesta}
    </span>
  )}</div>
          <div>Problemas cardíacos: <span className="text-green-600 font-semibold">No</span></div>
          <div>Está bajo algún tratamiento: <span className="text-green-600 font-semibold">No</span></div>
          <div>Artritis: <span className="text-green-600 font-semibold">No</span></div>
          <div>Tratamiento por osteoporosis: <span className="text-green-600 font-semibold">No</span></div>
          <div>Artritis reumatoidea: <span className="text-green-600 font-semibold">No</span></div>
          <div>Está bajo tratamiento con insulina: <span className="text-green-600 font-semibold">No</span></div>
          <div>Fiebre reumática: <span className="text-green-600 font-semibold">No</span></div>
          <div>Está tomando bifosfonatos: <span className="text-green-600 font-semibold">No</span></div>
          <div>Problemas de presión: <span className="text-green-600 font-semibold">No</span></div>
          <div>Tuvo reacciones alérgicas: <span className="text-red-600 font-semibold">Sí</span></div>
          <div>Está embarazada: <span className="text-green-600 font-semibold">No</span></div>
        </div>
      
      </div>
      

      <div className="my-6 text-center">
        <a href="#" className="text-blue-700 underline">Ver más datos</a>
      </div>

      <h2 className="text-3xl font-bold mt-10 mb-4">Historial</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-blue-500 text-white">
              <th className="border px-4 py-2">Fecha</th>
              <th className="border px-4 py-2">Prestación</th>
              <th className="border px-4 py-2">Pieza</th>
              <th className="border px-4 py-2">Lesión</th>
              <th className="border px-4 py-2">Importe</th>
              <th className="border px-4 py-2">Pagos</th>
              <th className="border px-4 py-2">Saldo</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border px-4 py-2 h-10">05/01/2023</td>
              <td className="border px-4 py-2">Limpieza</td>
              <td className="border px-4 py-2">15</td>
              <td className="border px-4 py-2">Caries</td>
              <td className="border px-4 py-2">$3.500</td>
              <td className="border px-4 py-2">$3.500</td>
              <td className="border px-4 py-2">$0</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
