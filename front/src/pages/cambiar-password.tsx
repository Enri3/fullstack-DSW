import React, { useState } from "react";
import "../assets/styles/login.css";
import HeaderClienteIngresado from "../components/header_clienteIngresado";
import MensajeAlerta from "../components/mensajesAlerta";
import { obtenerCantidadCarrito } from "../services/cartService";

const CambiarPassword: React.FC = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState<"success" | "error" | "info">("info");
  const [cantidad, setCantidad] = useState(obtenerCantidadCarrito());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setTipoMensaje("error");
      setMensaje("Las contraseñas nuevas no coinciden ❌");
      return;
    }

    // simulamos el cambio de contraseña
    setTipoMensaje("success");
    setMensaje("Contraseña cambiada correctamente ✅");

    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <>
      <HeaderClienteIngresado cantidad={cantidad} />
      <div className="login-page">
        <div className="login-container">
          <h2>Cambiar Contraseña</h2>

          {mensaje && <MensajeAlerta tipo={tipoMensaje} texto={mensaje} />}

          <form onSubmit={handleSubmit}>
            <input
              type="password"
              placeholder="Contraseña actual"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Nueva contraseña"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Confirmar nueva contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <button type="submit">Guardar cambios</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default CambiarPassword;