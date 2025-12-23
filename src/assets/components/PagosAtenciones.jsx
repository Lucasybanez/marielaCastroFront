import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const AtencionDetalle = () => {
  const location = useLocation();
  const atencion = location.state?.atencion;
  const paciente = location.state?.paciente;
  const id_atencion = atencion?.id_atencion;

  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(true);

  // nuevo pago
  const [nuevoPago, setNuevoPago] = useState({
    fecha: "",
    importe: "",
    metodo: "Efectivo",
  });

  // edición
  const [editPagoId, setEditPagoId] = useState(null);
  const [pagoEditado, setPagoEditado] = useState({
    fecha: "",
    importe: "",
    metodo: "Efectivo",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8001/api/pagos/atencion/${id_atencion}`
        );

        let data = Array.isArray(res.data)
          ? res.data
          : res.data?.pagos || [];

        data.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
        setPagos(data);
      } catch (error) {
        console.error("Error cargando pagos:", error);
        setPagos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id_atencion]);

  if (loading) return <p className="text-center py-6">Cargando…</p>;
  if (!atencion)
    return (
      <p className="text-center py-6 text-red-600">
        Atención no encontrada.
      </p>
    );

  const totalPagado = pagos.reduce(
    (acc, p) => acc + (Number(p?.importe) || 0),
    0
  );

  const importeTotal = Number(atencion?.importe) || 0;
  const saldo = importeTotal - totalPagado;

  // ================= NUEVO PAGO =================

  const handleChangeNuevoPago = (e) => {
    const { name, value } = e.target;
    setNuevoPago((prev) => ({ ...prev, [name]: value }));
  };

  const handleGuardarPago = async () => {
    if (!nuevoPago.fecha || !nuevoPago.importe) {
      alert("Completá fecha e importe");
      return;
    }

    try {
      const payload = {
        id_atencion,
        fecha: nuevoPago.fecha,
        importe: Number(nuevoPago.importe),
        metodo: nuevoPago.metodo,
      };

      const res = await axios.post(
        "http://localhost:8001/api/pago",
        payload
      );

      const pagoGuardado = res.data;

      setPagos((prev) => {
        const nuevos = [pagoGuardado, ...prev];
        nuevos.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
        return nuevos;
      });

      setNuevoPago({
        fecha: "",
        importe: "",
        metodo: "Efectivo",
      });
    } catch (error) {
      console.error("Error guardando pago:", error);
      alert("Error al guardar el pago");
    }
  };

  // ================= EDICIÓN =================

  const handleEditarPago = (pago) => {
    setEditPagoId(pago.id_pago);
    setPagoEditado({
      fecha: pago.fecha,
      importe: pago.importe,
      metodo: pago.metodo || "Efectivo",
    });
  };

  const handleChangePagoEditado = (e) => {
    const { name, value } = e.target;
    setPagoEditado((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancelarEdicion = () => {
    setEditPagoId(null);
    setPagoEditado({
      fecha: "",
      importe: "",
      metodo: "Efectivo",
    });
  };

  const handleGuardarEdicion = async (id_pago) => {
    if (!pagoEditado.fecha || !pagoEditado.importe) {
      alert("Completá fecha e importe");
      return;
    }

    try {
      const payload = {
        fecha: pagoEditado.fecha,
        importe: Number(pagoEditado.importe),
        metodo: pagoEditado.metodo,
      };

      const res = await axios.put(
        `http://localhost:8001/api/pago/${id_pago}`,
        payload
      );

      const pagoActualizado = res.data;

      setPagos((prev) =>
        prev.map((p) =>
          p.id_pago === id_pago ? pagoActualizado : p
        )
      );

      setEditPagoId(null);
    } catch (error) {
      console.error("Error actualizando pago:", error);
      alert("Error al actualizar el pago");
    }
  };

  // ================= RENDER =================

  return (
    <div className="p-6 space-y-6">
      {/* Info atención */}
      <div className="p-5 bg-white shadow rounded-xl border">
        <h2 className="text-xl font-bold mb-1">
          Paciente: {paciente.nombre}
        </h2>
        <p className="text-gray-600 mb-3">
          ID Atención: {atencion.id_atencion}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <p><strong>Fecha:</strong> {atencion.fecha}</p>
          <p><strong>Lesión:</strong> {atencion.lesion}</p>
          <p><strong>Prestación:</strong> {atencion.prestacion}</p>
          <p>
            <strong>Importe Total:</strong> $
            {importeTotal.toLocaleString("es-AR")}
          </p>
        </div>

        <div className="mt-4 p-3 bg-gray-100 rounded-lg">
          <p>
            <strong>Total pagado:</strong> $
            {totalPagado.toLocaleString("es-AR")}
          </p>
          <p className="text-red-600 font-bold">
            <strong>Saldo:</strong> $
            {saldo.toLocaleString("es-AR")}
          </p>
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-blue-500 text-white">
              <th className="border px-4 py-2">Fecha</th>
              <th className="border px-4 py-2">Importe</th>
              <th className="border px-4 py-2">Método</th>
              <th className="border px-4 py-2">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {/* Alta */}
            <tr className="bg-gray-50">
              <td className="border px-2 py-1">
                <input
                  type="date"
                  name="fecha"
                  value={nuevoPago.fecha}
                  onChange={handleChangeNuevoPago}
                  className="w-full border rounded px-2 py-1"
                />
              </td>
              <td className="border px-2 py-1">
                <input
                  type="number"
                  name="importe"
                  value={nuevoPago.importe}
                  onChange={handleChangeNuevoPago}
                  className="w-full border rounded px-2 py-1"
                />
              </td>
              <td className="border px-2 py-1">
                <select
                  name="metodo"
                  value={nuevoPago.metodo}
                  onChange={handleChangeNuevoPago}
                  className="w-full border rounded px-2 py-1"
                >
                  <option>Efectivo</option>
                  <option>Transferencia</option>
                  <option>Tarjeta</option>
                </select>
              </td>
              <td className="border px-2 py-1 text-center">
                <button
                  onClick={handleGuardarPago}
                  className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                >
                  Guardar
                </button>
              </td>
            </tr>

            {/* Listado */}
            {pagos.map((p) => {
              const editando = editPagoId === p.id_pago;

              return (
                <tr key={p.id_pago} className={editando ? "bg-yellow-50" : ""}>
                  <td className="border px-2 py-1">
                    {editando ? (
                      <input
                        type="date"
                        name="fecha"
                        value={pagoEditado.fecha}
                        onChange={handleChangePagoEditado}
                        className="w-full border rounded px-2 py-1"
                      />
                    ) : (
                      p.fecha
                    )}
                  </td>

                  <td className="border px-2 py-1">
                    {editando ? (
                      <input
                        type="number"
                        name="importe"
                        value={pagoEditado.importe}
                        onChange={handleChangePagoEditado}
                        className="w-full border rounded px-2 py-1"
                      />
                    ) : (
                      `$${Number(p.importe).toLocaleString("es-AR")}`
                    )}
                  </td>

                  <td className="border px-2 py-1">
                    {editando ? (
                      <select
                        name="metodo"
                        value={pagoEditado.metodo}
                        onChange={handleChangePagoEditado}
                        className="w-full border rounded px-2 py-1"
                      >
                        <option>Efectivo</option>
                        <option>Transferencia</option>
                        <option>Tarjeta</option>
                      </select>
                    ) : (
                      p.metodo || "—"
                    )}
                  </td>

                  <td className="border px-2 py-1 text-center space-x-2">
                    {editando ? (
                      <>
                        <button
                          onClick={() => handleGuardarEdicion(p.id_pago)}
                          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                        >
                          Guardar
                        </button>
                        <button
                          onClick={handleCancelarEdicion}
                          className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
                        >
                          Cancelar
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleEditarPago(p)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        ✏️ Modificar
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AtencionDetalle;
