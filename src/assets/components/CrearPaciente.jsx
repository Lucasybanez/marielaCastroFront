import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const CrearPaciente = () => {
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
  };

  const validationSchema = Yup.object({
    nombre: Yup.string().required('Requerido'),
    fechaNacimiento: Yup.date().required('Requerido'),
    domicilio: Yup.string().required('Requerido'),
    localidad: Yup.string().required('Requerido'),
    telefono: Yup.string().required('Requerido'),
    hospitalizado: Yup.string().required('Requerido'),
    tratamientoEnfermedad: Yup.string().required('Requerido'),
    tratamientoOsteoporosis: Yup.string().required('Requerido'),
    tomaMedicamentos: Yup.string().required('Requerido'),
    tratamientoInsulina: Yup.string().required('Requerido'),
    tomaBifosfonatos: Yup.string().required('Requerido'),
    reaccionAlergica: Yup.string().required('Requerido'),
    alergiaDetalle: Yup.string().when('reaccionAlergica', {
      is: 'si',
      then: Yup.string().required('Indique el medicamento'),
    }),
    sangradoExcesivo: Yup.string().required('Requerido'),
  });

  const onSubmit = (values) => {
    console.log('Datos del formulario:', values);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4">Crear Paciente</h2>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
        {({ values }) => (
          <Form className="space-y-4">
            {/* Datos personales */}
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
              ['reaccionAlergica', 'Tuvo alguna vez reacciones alérgicas con algún medicamento?'],
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

            {/* Campo adicional si hay alergia */}
            {values.reaccionAlergica === 'si' && (
              <div>
                <label className="block font-medium">¿Cuál?</label>
                <Field name="alergiaDetalle" type="text" className="w-full border p-2 rounded" />
                <ErrorMessage name="alergiaDetalle" component="div" className="text-red-500 text-sm" />
              </div>
            )}

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
                {cond.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
              </label>
            ))}

            {/* Otra condición */}
            <div>
              <label className="block font-medium">Otra condición</label>
              <Field name="otraCondicion" type="text" className="w-full border p-2 rounded" />
            </div>

            <button type="submit" className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Guardar Paciente
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CrearPaciente;
