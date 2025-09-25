import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './Pages/Home/Home'
import CrearPaciente from './assets/components/CrearPaciente'
import BuscarPaciente from './assets/components/Buscador'
import PacienteDatos from './assets/components/PacienteDatos'
import FormAtenciones from './assets/components/FormAtenciones'
import EditarPaciente from './assets/components/EditarPaciente'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/buscar" element={<BuscarPaciente />} />
        <Route path="/crear" element={<CrearPaciente />} />
        <Route path="/paciente" element={<PacienteDatos />} />
        <Route path="/atenciones" element={<FormAtenciones />} />
        <Route path="/editar-paciente" element={<EditarPaciente />} />
      </Routes>
    </Router>
  )
}

export default App
