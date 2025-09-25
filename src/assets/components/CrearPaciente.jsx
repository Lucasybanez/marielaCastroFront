import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Navbar from "./Navbar"; // Asegurate de importar correctamente
import axios from 'axios';
import Swal from 'sweetalert2';

const CrearPaciente = () => {
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState(null);

  const initialValues = {
    nombre: '',
    fechaNacimiento: '',
    domicilio: '',
    localidad: '',
    telefono: '',
    hospitalizado: '',
    tratamientoEnfermedad: '',
    tratamientoOsteoporosis: '',
    tomaMedicamentos: '',
    tratamientoInsulina: '',
    tomaBifosfonatos: '',
    reaccionAlergica: '',
    alergiaDetalle: '',
    sangradoExcesivo: '',
    problemasCardiacos: false,
    artritis: false,
    artritisReumatoidea: false,
    otraCondicion: '',
    fiebreReumatica: false,
    presionAlta: false,
    presionBaja: false,
    diabetes: false,
    embarazada: false,
    cuil: '',               // Agregamos cuil para el POST
    telefono_familiar: '',  // Lo agrego para el paciente
    obra_social: '',        // Opcional, si no hay null
  };

  const validationSchema = Yup.object({
    cuil: Yup.string().required('Requerido'),
    nombre: Yup.string().required('Requerido'),
    fechaNacimiento: Yup.date().required('Requerido'),
    domicilio: Yup.string().required('Requerido'),
    localidad: Yup.string().required('Requerido'),
    telefono: Yup.string().required('Requerido'),
    telefono_familiar: Yup.string(),
    hospitalizado: Yup.string().required('Requerido'),
    tratamientoEnfermedad: Yup.string().required('Requerido'),
    tratamientoOsteoporosis: Yup.string().required('Requerido'),
    tomaMedicamentos: Yup.string().required('Requerido'),
    tratamientoInsulina: Yup.string().required('Requerido'),
    tomaBifosfonatos: Yup.string().required('Requerido'),
    reaccionAlergica: Yup.string().required('Requerido'),
    alergiaDetalle: Yup.string().when('reaccionAlergica', (reaccionAlergica, schema) => {
      return reaccionAlergica === 'si'
        ? schema.required('Indique el medicamento')
        : schema.notRequired();
    }),
    sangradoExcesivo: Yup.string().required('Requerido'),
  });

  // IDs de preguntas según lo que diste:
  const preguntasIds = {
    hospitalizado: 1,
    tratamientoEnfermedad: 2,
    tratamientoOsteoporosis: 3,
    tomaMedicamentos: 4,
    tratamientoInsulina: 5,
    tomaBifosfonatos: 6,
    reaccionAlergica: 7,
    sangradoExcesivo: 8,
    problemasCardiacos: 9,
    artritis: 9,
    artritisReumatoidea: 9,
    fiebreReumatica: 9,
    presionAlta: 9,
    presionBaja: 9,
    diabetes: 9,
    embarazada: 9,
  };
  const guardarHistoriaClinica = async (values) => {
    console.log("EJECUTANDO GUARDAR HISTORIA CLINICA");
    console.log("llegó a la función->",values.hospitalizado);
    const respuestas = [
      values.hospitalizado,
      values.tratamientoEnfermedad,
      values.tratamientoOsteoporosis,
      values.tomaMedicamentos,
      values.tratamientoInsulina,
      values.tomaBifosfonatos,
      values.alergiaDetalle,
      values.sangradoExcesivo
    ]
    
    for (let i=1; i<= 8; i++) {
      const respuesta = {
        id_paciente: values.cuil,
        id_pregunta: i,
        respuesta: respuestas[i-1],
      };
      console.log("se intenta guardar respuesta", respuesta);
      const res = await axios.post('http://localhost:8001/api/respuesta', respuesta).then((res) => {
        console.log(res.data);
      }
      ).catch((err) => {
        console.log(err);
      }
      );
    }
  
};
const guardarCondiciones = async (values) => {
  
  console.log("CORRIENDO GUARDAR CONDICIONES");

  // Filtrar solo las claves que estén en true (condiciones seleccionadas)
  console.log("VUALUES->",values);
  const condicionesSeleccionadas = Object.entries(values)
    .filter(([key, value]) => value === true)
    .map(([key]) => key);
  console.log("Condiciones seleccionadas:", condicionesSeleccionadas);
  for (const cond of condicionesSeleccionadas) {
    const condicion = {
      id_paciente: values.cuil,  
      id_pregunta: 9,
      respuesta: cond,
    };

    
    try {
      console.log("EJECUTANDO GUARDAR CONDICION:", condicion);
      const res = await axios.post('http://localhost:8001/api/respuesta', condicion);
      console.log(res.data);
    } catch (error) {
      console.error('Error al guardar condición:', error);
    }
    
  }

  // Si el campo de texto libre 'otraCondicion' existe y no está vacío, lo guardo también
  console.log("Se debería guardar la otra condición:" , values.otraCondicion);
  if (values.otraCondicion && values.otraCondicion.trim() !== "") {
    const condicionLibre = {
      id_paciente: values.cuil,
      id_pregunta: 9,
      respuesta: values.otraCondicion.trim(),
    };
    
    try {
      console.log("EJECUTANDO GUARDAR CONDICION LIBRE");
      const res = await axios.post('http://localhost:8001/api/respuesta', condicionLibre);
      console.log(res.data);
    } catch (error) {
      console.error('Error al guardar condición libre:', error);
    }
    
  }
};


const onSubmit = async (values, { resetForm }) => {
  setLoading(true);
  setMensaje(null);

  try {
    const pacientePayload = {
      cuil: values.cuil,
      fecha_nacimiento: values.fechaNacimiento,
      nombre: values.nombre,
      telefono: values.telefono,
      domicilio: values.domicilio,
      telefono_familiar: values.telefono_familiar || values.telefono,
      obra_social: values.obra_social || null,
    };

    const pacienteRes = await axios.post('http://localhost:8001/api/paciente', pacientePayload);

    if (![200, 201].includes(pacienteRes.status)) {
      throw new Error('Error al crear paciente');
    }

    // ✅ Guardar preguntas tipo historia clínica (las 8 tipo "sí/no")
    await guardarHistoriaClinica(values);
    await guardarCondiciones(values);

    setMensaje('Paciente y respuestas guardadas con éxito');
    resetForm();

    // 🔔 SweetAlert de éxito
    Swal.fire({
      icon: 'success',
      title: '¡Éxito!',
      text: 'Paciente y respuestas guardadas con éxito',
      confirmButtonColor: '#2563eb' // azul tailwind
    });

  } catch (error) {
    let mensajeError = 'Error inesperado al guardar paciente o respuestas';

    if (error.response) {
      console.error("Error del servidor:", error.response.data);
      mensajeError = error.response.data.mensaje || error.response.data.error || mensajeError;
    } else {
      console.error("Error desconocido:", error);
    }

    setMensaje(mensajeError);

    // 🔔 SweetAlert de error
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: mensajeError,
      confirmButtonColor: '#dc2626' // rojo tailwind
    });

  } finally {
    setLoading(false);
  }
};




  return (
    <div>
      <Navbar titulo="Registrar Paciente" />
      <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4">Crear ficha de Paciente</h2>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
        {({ values }) => (
          <Form className="space-y-4">
            {/* Agrego el campo cuil y telefono_familiar */}
            <div>
              <label className="block font-medium">CUIL</label>
              <Field name="cuil" type="text" className="w-full border p-2 rounded" />
              <ErrorMessage name="cuil" component="div" className="text-red-500 text-sm" />
            </div>
            <div>
              <label className="block font-medium">Teléfono Familiar</label>
              <Field name="telefono_familiar" type="text" className="w-full border p-2 rounded" />
              <ErrorMessage name="telefono_familiar" component="div" className="text-red-500 text-sm" />
            </div>

            {/* Datos personales existentes */}
            {[
              { name: 'nombre', label: 'Nombre y Apellido', type: 'text' },
              { name: 'fechaNacimiento', label: 'Fecha de Nacimiento', type: 'date' },
              { name: 'domicilio', label: 'Domicilio', type: 'text' },
              { name: 'localidad', label: 'Localidad', type: 'text' },
              { name: 'telefono', label: 'Teléfono', type: 'text' },
            ].map(({ name, label, type }) => (
              <div key={name}>
                <label className="block font-medium">{label}</label>
                <Field name={name} type={type} className="w-full border p-2 rounded" />
                <ErrorMessage name={name} component="div" className="text-red-500 text-sm" />
              </div>
            ))}

            <h3 className="text-xl font-semibold mt-6">Historia Clínica</h3>

            {/* Preguntas Sí/No */}
            {[
              ['hospitalizado', 'Debió ser hospitalizado en los últimos dos años?'],
              ['tratamientoEnfermedad', 'Está bajo tratamiento médico por alguna enfermedad?'],
              ['tratamientoOsteoporosis', 'Está en tratamiento por osteoporosis?'],
              ['tomaMedicamentos', 'Está tomando algún medicamento?'],
              ['tratamientoInsulina', 'Está bajo tratamiento por insulina?'],
              ['tomaBifosfonatos', 'Está tomando bifosfonatos?'],
              ['sangradoExcesivo', '¿Cuando se lastima o extrae algún diente, le sangra excesivamente y necesita atención para detener el sangrado?'],
            ].map(([name, label]) => (
              <div key={name}>
                <label className="block font-medium">{label}</label>
                <div className="flex space-x-4 mt-1">
                  <label>
                    <Field type="radio" name={name} value="si" className="mr-1" /> Sí
                  </label>
                  <label>
                    <Field type="radio" name={name} value="no" className="mr-1" /> No
                  </label>
                </div>
                <ErrorMessage name={name} component="div" className="text-red-500 text-sm" />
              </div>
            ))}
            {/* Reacción alérgica */}
            <div>
              <label className="block font-medium">¿Tiene alguna reacción alérgica?</label>
              <div className="flex space-x-4 mt-1">
                <label>
                  <Field type="radio" name="reaccionAlergica" value="si" className="mr-1" /> Sí
                </label>
                <label>
                  <Field type="radio" name="reaccionAlergica" value="no" className="mr-1" /> No
                </label>
              </div>
              <ErrorMessage name="reaccionAlergica" component="div" className="text-red-500 text-sm" />
              {values.reaccionAlergica === 'si' && (
                <div>
                  <label className="block font-medium">Detalle de la reacción</label>
                  <Field name="alergiaDetalle" type="text" className="w-full border p-2 rounded" />
                  <ErrorMessage name="alergiaDetalle" component="div" className="text-red-500 text-sm" />
                </div>
              )}
              </div>
            

            {/* Historial de condiciones */}
            <h3 className="text-xl font-semibold mt-6">¿Tuvo?</h3>
            {[
              'problemasCardiacos',
              'artritis',
              'artritisReumatoidea',
              'fiebreReumatica',
              'presionAlta',
              'presionBaja',
              'diabetes',
              'embarazada',
            ].map((cond) => (
              <label key={cond} className="block">
                <Field type="checkbox" name={cond} className="mr-2" />
                {cond.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </label>
            ))}

            {/* Otra condición */}
            <div>
              <label className="block font-medium">Otra condición</label>
              <Field name="otraCondicion" type="text" className="w-full border p-2 rounded" />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`mt-4 px-4 py-2 text-white rounded ${
                loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {loading ? 'Guardando...' : 'Guardar Paciente'}
            </button>
          </Form>
        )}
      </Formik>
      </div>
    </div>
  );
};

export default CrearPaciente;
