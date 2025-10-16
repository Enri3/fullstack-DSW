import { useState } from "react";
import "../assets/styles/login.css";
import Header_sinCarrito from "../components/header_sinCarrito";
import MensajeAlerta from "../components/mensajesAlerta";
import { loginUsuario } from "../services/authService";
import logo from "../assets/img/logo.png";
import { useNavigate } from "react-router-dom";
import type { Cliente } from "../types/Cliente";
import { clienteVacio } from "../types/Cliente";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cliente, setCliente] = useState<Cliente>(clienteVacio);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState<{ tipo: "success" | "error" | "info"; texto: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMensaje(null);
    setLoading(true);

    try {
      const data = await loginUsuario({ email, password });

      if (data && data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("cliente", JSON.stringify(data.cliente));
        setCliente(data.cliente);

        const mensajeExito = { tipo: "success" as "success", texto: "¡Inicio de sesión exitoso, bienvenido!" };

        switch (data.cliente.idTipoCli) {
          case 1:
            navigate("/admin", { state: { mensaje: mensajeExito } });
            break;
          case 2:
            navigate("/clienteIngresado", { state: { mensaje: mensajeExito } });
            break;
          case 3:
            navigate("/productos-especiales", { state: { mensaje: mensajeExito } });
            break;
          default:
            navigate("/", { state: { mensaje: mensajeExito } });
        }
      } else {
        setMensaje({ tipo: "error", texto: "Respuesta inesperada del servidor." });
      }
    } catch (err) {
      console.error("Error al iniciar sesión:", err);
      
      let mensajeError = "Error al conectar con el servidor.";

      // 🟢 CORRECCIÓN TS: Verificación de tipo para manejar 'unknown'
      if (err instanceof Error) {
        mensajeError = err.message;
      } else if (typeof err === 'string') {
        mensajeError = err;
      } else if (err && typeof err === 'object' && 'message' in err && typeof err.message === 'string') {
        // Maneja objetos de error no estándar con propiedad 'message'
        mensajeError = err.message;
      }
      
      setMensaje({
        tipo: "error",
        texto: mensajeError,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header_sinCarrito />

      <div className="login-page">
        <div className="login-container">
          <img src={logo} id="logo" alt="Logo" />
          <h2>Iniciar sesión</h2>

          {mensaje && <MensajeAlerta tipo={mensaje.tipo} texto={mensaje.texto} />}

          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? "Ingresando..." : "Ingresar"}
            </button>
          </form>

          <a href="/register" className="register-link">
            ¿No tenés cuenta? Registrate
          </a>
        </div>
      </div>
    </>
  );
}