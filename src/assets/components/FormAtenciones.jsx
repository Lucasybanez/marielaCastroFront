import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useSearchParams, useLocation } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

const FormAtenciones = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const cuil = searchParams.get('cuil') || '';

  const initialValues = {
    fecha: '',
    id_paciente: cuil,
    prestacion: '',
    lesion: '',
    observaciones: '',
    importe: '',
    pagado: '',
  };


  const validationSchema = Yup.object({
    fecha: Yup.date().required('La fecha es obligatoria'),
    id_paciente: Yup.string().max(15).required('El ID del paciente es obligatorio'),
    prestacion: Yup.string().required('La prestación es obligatoria'),
    lesion: Yup.string().required('La lesión es obligatoria'),
    observaciones: Yup.string(),
    importe: Yup.number().min(0, 'Debe ser mayor o igual a 0').required('El importe es obligatorio'),
    pagado: Yup.number().min(0, 'Debe ser mayor o igual a 0').required('El pago es obligatorio'),
  });

  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    const payload = {
      ...values,
      saldo: parseFloat(values.importe) - parseFloat(values.pagado),
    };

    try {
      const response = await axios.post('http://localhost:5050/api/atencion', payload);
      alert('Atención registrada correctamente');
      navigate(`/paciente`, { state: { cuil } })
      resetForm();
    } catch (error) {
      console.error('Error al enviar:', error);
      alert('Error al registrar la atención');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Registrar Atención</h2>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
        {({ isSubmitting }) => (
          <Form className="space-y-4">
            <div>
              <label className="block font-medium">Fecha</label>
              <Field type="date" name="fecha" className="w-full border p-2" />
              <ErrorMessage name="fecha" component="div" className="text-red-500 text-sm" />
            </div>

            <div>
              <label className="block font-medium">ID Paciente</label>
              <Field type="text" name="id_paciente" className="w-full border p-2" />
              <ErrorMessage name="id_paciente" component="div" className="text-red-500 text-sm" />
            </div>

            <div>
              <label className="block font-medium">Prestación</label>
              <Field type="text" name="prestacion" className="w-full border p-2" />
              <ErrorMessage name="prestacion" component="div" className="text-red-500 text-sm" />
            </div>

            <div>
              <label className="block font-medium">Lesión</label>
              <Field type="text" name="lesion" className="w-full border p-2" />
              <ErrorMessage name="lesion" component="div" className="text-red-500 text-sm" />
            </div>

            <div>
              <label className="block font-medium">Observaciones</label>
              <Field as="textarea" name="observaciones" className="w-full border p-2" />
              <ErrorMessage name="observaciones" component="div" className="text-red-500 text-sm" />
            </div>

            <div>
              <label className="block font-medium">Importe</label>
              <Field type="number" name="importe" step="0.01" className="w-full border p-2" />
              <ErrorMessage name="importe" component="div" className="text-red-500 text-sm" />
            </div>

            <div>
              <label className="block font-medium">Pagado</label>
              <Field type="number" name="pagado" step="0.01" className="w-full border p-2" />
              <ErrorMessage name="pagado" component="div" className="text-red-500 text-sm" />
            </div>

            <button type="submit" disabled={isSubmitting} className="bg-blue-600 text-white px-4 py-2 rounded">
              {isSubmitting ? 'Enviando...' : 'Registrar'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default FormAtenciones;
