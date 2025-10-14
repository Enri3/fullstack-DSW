import React, { useState } from "react";
import "../assets/styles/login.css";
import HeaderClienteIngresado from "../components/header_clienteIngresado";
import MensajeAlerta from "../components/mensajesAlerta";
import { cambiarPassword } from "../services/authService";
import { obtenerCantidadCarrito } from "../services/cartService";

const CambiarPassword: React.FC = () => {
  const [passwordActual, setPasswordActual] = useState("");
  const [passwordNueva, setpasswordNueva] = useState("");
  const [passwordConfirmada, setpasswordConfirmada] = useState("");
  const [mensaje, setMensaje] = useState<string>("");
  const [tipoMensaje, setTipoMensaje] = useState<"success" | "error" | "info">("info");
  const [cantidad] = useState(obtenerCantidadCarrito());

  const limpiarCampos = () => {
    setPasswordActual("");
    setpasswordNueva("");
    setpasswordConfirmada("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje(""); // limpia mensaje antes

    if (passwordNueva !== passwordConfirmada) {
        setTipoMensaje("error");
        setMensaje(""); 
        setTimeout(() => {
        setMensaje("Las contraseñas nuevas no coinciden ❌");
        }, 10);
      return; 
    }

    try {
      const clienteGuardado = localStorage.getItem("cliente");
      if (!clienteGuardado) {
        setTipoMensaje("error");
        setMensaje("No se encontró el usuario en sesión.");
        return;
      }

      const cliente = JSON.parse(clienteGuardado);
      const idCli = cliente.idCli;

      const respuesta = await cambiarPassword(idCli, passwordActual, passwordNueva);

      setTipoMensaje("success");
      setMensaje(respuesta.message || "Contraseña actualizada correctamente ✅");

      limpiarCampos();

    } catch (error: any) {
      const msg = error.message || "";

      if (msg.includes("incorrecta")) {
        setTipoMensaje("error");
        setMensaje("Contraseña actual incorrecta ❌");
      } else if (msg.includes("no encontrado")) {
        setTipoMensaje("error");
        setMensaje("Cliente no encontrado");
      } else {
        setTipoMensaje("error");
        setMensaje("Error al cambiar la contraseña");
      }

      limpiarCampos();
    }
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
              value={passwordActual}
              onChange={(e) => setPasswordActual(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Nueva contraseña"
              value={passwordNueva}
              onChange={(e) => setpasswordNueva(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Confirmar nueva contraseña"
              value={passwordConfirmada}
              onChange={(e) => setpasswordConfirmada(e.target.value)}
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