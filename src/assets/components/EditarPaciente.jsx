import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Navbar from "./Navbar";
import axios from 'axios';
import Swal from 'sweetalert2';

const EditarPaciente = () => {
  const [loading, setLoading] = useState(false);
  const [respuestas, setRespuestas] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const pacienteExistente = location.state?.paciente || null;

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

  useEffect(() => {
    if (!pacienteExistente) return;
    axios.get(`http://localhost:8001/api/respuestas/paciente/${pacienteExistente.cuil}`)
      .then(response => setRespuestas(response.data))
      .catch(error => console.error('Error al cargar respuestas:', error));
  }, [pacienteExistente]);

  const guardarHistoriaClinica = async (values) => {
    console.log("EJECUTANDO GUARDAR HISTORIA CLINICA");
    const respuestasArray = [
      values.hospitalizado,
      values.tratamientoEnfermedad,
      values.tratamientoOsteoporosis,
      values.tomaMedicamentos,
      values.tratamientoInsulina,
      values.tomaBifosfonatos,
      values.alergiaDetalle,
      values.sangradoExcesivo
    ];

    for (let i = 1; i <= 8; i++) {
      const respuesta = {
        id_paciente: values.cuil,
        id_pregunta: i,
        respuesta: respuestasArray[i - 1],
      };
      try {
        await axios.post('http://localhost:8001/api/respuesta', respuesta);
      } catch (error) {
        console.error('Error al guardar respuesta:', error);
      }
    }
  };

  const guardarCondiciones = async (values) => {
    console.log("EJECUTANDO GUARDAR CONDICIONES");
    try {
      // Obtener condiciones previamente guardadas
      const condicionesPrevias = respuestas
        .filter(r => r.id_pregunta === 9)
        .map(r => r.respuesta);

      // Obtener condiciones actuales del form
      const condicionesActuales = Object.entries(values)
        .filter(([key, value]) => value === true)
        .map(([key]) => key);

      if (values.otraCondicion && values.otraCondicion.trim() !== "") {
        condicionesActuales.push(values.otraCondicion.trim());
      }

      // Determinar qué se agregó y qué se quitó
      const agregadas = condicionesActuales.filter(c => !condicionesPrevias.includes(c));
      const eliminadas = condicionesPrevias.filter(c => !condicionesActuales.includes(c));

      // Insertar solo las nuevas
      for (const cond of agregadas) {
        const condicion = { id_paciente: values.cuil, id_pregunta: 9, respuesta: cond };
        await axios.post('http://localhost:8001/api/respuesta', condicion);
      }

      // Borrar todas las eliminadas en un solo request
      if (eliminadas.length > 0) {
        await axios.post(`http://localhost:8001/api/respuesta/eliminar-multiples`, {
          cuil: values.cuil,
          condiciones: eliminadas
        });
      }

    } catch (error) {
      console.error('Error al guardar condiciones:', error);
    }
  };

  const onSubmit = async (values, { resetForm }) => {
    setLoading(true);
    try {
      const pacientePayload = {
        cuil: values.cuil,
        fecha_nacimiento: values.fechaNacimiento,
        nombre: values.nombre,
        telefono: values.telefono,
        localidad: values.localidad,
        domicilio: values.domicilio,
        telefono_familiar: values.telefono_familiar || values.telefono,
        obra_social: values.obra_social || null,
      };

      if (pacienteExistente) {
        await axios.put(`http://localhost:8001/api/paciente/${values.cuil}`, pacientePayload);
      } else {
        await axios.post('http://localhost:8001/api/paciente', pacientePayload);
      }

      await guardarHistoriaClinica(values);
      await guardarCondiciones(values);

      Swal.fire({
        icon: 'success',
        title: '¡Éxito!',
        text: pacienteExistente ? 'Paciente actualizado con éxito' : 'Paciente creado con éxito',
        confirmButtonColor: '#2563eb'
      });

      resetForm();
      navigate("/buscar");
    } catch (error) {
      let mensajeError = 'Error inesperado al guardar paciente o respuestas';
      if (error.response) {
        mensajeError = error.response.data.mensaje || error.response.data.error || mensajeError;
      }
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: mensajeError,
        confirmButtonColor: '#dc2626'
      });
    } finally {
      setLoading(false);
    }
  };

  // Inicializar valores dinámicos para Formik
  const initialValues = {
    nombre: pacienteExistente?.nombre || '',
    fechaNacimiento: pacienteExistente?.fecha_nacimiento || '',
    domicilio: pacienteExistente?.domicilio || '',
    localidad: pacienteExistente?.localidad || '',
    telefono: pacienteExistente?.telefono || '',
    telefono_familiar: pacienteExistente?.telefono_familiar || pacienteExistente?.telefono || '',
    obra_social: pacienteExistente?.obra_social || '',
    cuil: pacienteExistente?.cuil || '',
    hospitalizado: respuestas.find(r => r.id_pregunta === 1)?.respuesta || '',
    tratamientoEnfermedad: respuestas.find(r => r.id_pregunta === 2)?.respuesta || '',
    tratamientoOsteoporosis: respuestas.find(r => r.id_pregunta === 3)?.respuesta || '',
    tomaMedicamentos: respuestas.find(r => r.id_pregunta === 4)?.respuesta || '',
    tratamientoInsulina: respuestas.find(r => r.id_pregunta === 5)?.respuesta || '',
    tomaBifosfonatos: respuestas.find(r => r.id_pregunta === 6)?.respuesta || '',
    reaccionAlergica: respuestas.find(r => r.id_pregunta === 7)?.respuesta ? 'si' : 'no',
    alergiaDetalle: respuestas.find(r => r.id_pregunta === 7)?.respuesta || '',
    sangradoExcesivo: respuestas.find(r => r.id_pregunta === 8)?.respuesta || '',
    problemasCardiacos: respuestas.some(r => r.id_pregunta === 9 && r.respuesta === 'problemasCardiacos'),
    artritis: respuestas.some(r => r.id_pregunta === 9 && r.respuesta === 'artritis'),
    artritisReumatoidea: respuestas.some(r => r.id_pregunta === 9 && r.respuesta === 'artritisReumatoidea'),
    fiebreReumatica: respuestas.some(r => r.id_pregunta === 9 && r.respuesta === 'fiebreReumatica'),
    presionAlta: respuestas.some(r => r.id_pregunta === 9 && r.respuesta === 'presionAlta'),
    presionBaja: respuestas.some(r => r.id_pregunta === 9 && r.respuesta === 'presionBaja'),
    diabetes: respuestas.some(r => r.id_pregunta === 9 && r.respuesta === 'diabetes'),
    embarazada: respuestas.some(r => r.id_pregunta === 9 && r.respuesta === 'embarazada'),
    otraCondicion: respuestas.find(r => r.id_pregunta === 9 && !['problemasCardiacos','artritis','artritisReumatoidea','fiebreReumatica','presionAlta','presionBaja','diabetes','embarazada'].includes(r.respuesta))?.respuesta || ''
  };

  return (
    <div>
      <Navbar titulo="Registrar Paciente" />
      <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-4">Crear ficha de Paciente</h2>
        <Formik
          initialValues={initialValues}
          enableReinitialize={true}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ values }) => (
            <Form className="space-y-4">
              {/* Campos personales */}
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

              {['nombre','fechaNacimiento','domicilio','localidad','telefono'].map((name) => (
                <div key={name}>
                  <label className="block font-medium">{name === 'nombre' ? 'Nombre y Apellido' :
                    name === 'fechaNacimiento' ? 'Fecha de Nacimiento' :
                    name.charAt(0).toUpperCase() + name.slice(1)}
                  </label>
                  <Field name={name} type={name==='fechaNacimiento' ? 'date' : 'text'} className="w-full border p-2 rounded" />
                  <ErrorMessage name={name} component="div" className="text-red-500 text-sm" />
                </div>
              ))}

              <h3 className="text-xl font-semibold mt-6">Historia Clínica</h3>
              {[
                ['hospitalizado','Debió ser hospitalizado en los últimos dos años?'],
                ['tratamientoEnfermedad','Está bajo tratamiento médico por alguna enfermedad?'],
                ['tratamientoOsteoporosis','Está en tratamiento por osteoporosis?'],
                ['tomaMedicamentos','Está tomando algún medicamento?'],
                ['tratamientoInsulina','Está bajo tratamiento por insulina?'],
                ['tomaBifosfonatos','Está tomando bifosfonatos?'],
                ['sangradoExcesivo','¿Cuando se lastima o extrae algún diente, le sangra excesivamente y necesita atención para detener el sangrado?']
              ].map(([name,label])=>(
                <div key={name}>
                  <label className="block font-medium">{label}</label>
                  <div className="flex space-x-4 mt-1">
                    <label><Field type="radio" name={name} value="si" className="mr-1"/> Sí</label>
                    <label><Field type="radio" name={name} value="no" className="mr-1"/> No</label>
                  </div>
                  <ErrorMessage name={name} component="div" className="text-red-500 text-sm"/>
                </div>
              ))}

              {/* Reacción alérgica */}
              <div>
                <label className="block font-medium">¿Tiene alguna reacción alérgica?</label>
                <div className="flex space-x-4 mt-1">
                  <label><Field type="radio" name="reaccionAlergica" value="si" className="mr-1"/> Sí</label>
                  <label><Field type="radio" name="reaccionAlergica" value="no" className="mr-1"/> No</label>
                </div>
                <ErrorMessage name="reaccionAlergica" component="div" className="text-red-500 text-sm"/>
                {values.reaccionAlergica==='si' && (
                  <div>
                    <label className="block font-medium">Detalle de la reacción</label>
                    <Field name="alergiaDetalle" type="text" className="w-full border p-2 rounded"/>
                    <ErrorMessage name="alergiaDetalle" component="div" className="text-red-500 text-sm"/>
                  </div>
                )}
              </div>

              {/* Historial de condiciones */}
              <h3 className="text-xl font-semibold mt-6">¿Tuvo?</h3>
              {['problemasCardiacos','artritis','artritisReumatoidea','fiebreReumatica','presionAlta','presionBaja','diabetes','embarazada'].map((cond)=>(
                <label key={cond} className="block">
                  <Field type="checkbox" name={cond} className="mr-2"/>
                  {cond.replace(/([A-Z])/g,' $1').replace(/^./, str=>str.toUpperCase())}
                </label>
              ))}

              <div>
                <label className="block font-medium">Otra condición</label>
                <Field name="otraCondicion" type="text" className="w-full border p-2 rounded"/>
              </div>

              <button type="submit" disabled={loading} className={`mt-4 px-4 py-2 text-white rounded ${loading?'bg-gray-400':'bg-blue-600 hover:bg-blue-700'}`}>
                {loading ? 'Guardando...' : 'Guardar Paciente'}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default EditarPaciente;
