import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './Pages/Home/Home'
import CrearPaciente from './assets/components/CrearPaciente'
import BuscarPaciente from './assets/components/Buscador'
import PacienteDatos from './assets/components/PacienteDatos'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/buscar" element={<BuscarPaciente />} />
        <Route path="/crear" element={<CrearPaciente />} />
        <Route path="/paciente" element={<PacienteDatos />} />
      </Routes>
    </Router>
  )
}

export default App
