// src/components/Navbar.js
import { useNavigate } from "react-router-dom";

export default function Navbar({ titulo }) {
  const navigate = useNavigate();

  return (
    <header className="bg-blue-800 text-white px-6 py-4 flex items-center justify-between">
      <h1 className="text-xl font-semibold">{titulo}</h1>
      <button
        onClick={() => navigate("/")}
        className="bg-white text-blue-800 font-bold px-4 py-2 rounded hover:bg-blue-100 transition"
      >
        Ir al Home
      </button>
    </header>
  );
}
