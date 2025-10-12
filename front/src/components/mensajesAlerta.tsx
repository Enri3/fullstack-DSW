import React from "react";
import "../assets/styles/mensajesAlerta.css";

interface MensajeAlertaProps {
  tipo: "success" | "error" | "info";
  texto: string;
}

const MensajeAlerta: React.FC<MensajeAlertaProps> = ({ tipo, texto }) => {
  return (
    <div className={`mensaje-alerta ${tipo}`}>
      <p>{texto}</p>
    </div>
  );
};

export default MensajeAlerta;