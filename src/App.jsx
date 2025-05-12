import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Home from './Pages/Home/Home'
import CrearPaciente from './assets/components/CrearPaciente'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <CrearPaciente />
    </>
  )
}

export default App
