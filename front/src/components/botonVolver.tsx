import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import "../assets/styles/botonVolver.css";

export default function BotonVolver() {
  const navigate = useNavigate();

  const handleVolver = () => navigate(-1);

  return (
    <button onClick={handleVolver} className="boton-volver" aria-label="Volver atrás">
      <ArrowLeft size={28} strokeWidth={3.5} className="flecha" />
    </button>
  );
}