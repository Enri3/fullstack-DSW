import { useState, useEffect, useRef } from "react";
import "../assets/styles/login.css";
import Header_sinCarrito from "../components/header_sinCarrito";
import MensajeAlerta from "../components/mensajesAlerta";
import { loginUsuario } from "../services/authService";
import { hidratarCarritoDesdePedidoEnCarrito } from "../services/pedidosService";
import logo from "../assets/img/logo.png";
import { useNavigate, useLocation } from "react-router-dom";
import type { Cliente } from "../types/Cliente";
import { clienteVacio } from "../types/Cliente";
import ReCAPTCHA from "react-google-recaptcha";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cliente, setCliente] = useState<Cliente>(clienteVacio);
  const [loading, setLoading] = useState(false);
  const [captcha, setCaptcha] = useState<string | null>(null);

  const [mensaje, setMensaje] = useState<{
    tipo: "success" | "error" | "info";
    texto: string;
  } | null>(null);

  useEffect(() => {
    if (location.state && location.state.mensaje) {
      setMensaje(location.state.mensaje);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const resetearCaptcha = () => {
    recaptchaRef.current?.reset();
    setCaptcha(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMensaje(null);
    setLoading(true);

    if (!captcha) {
      setMensaje({ tipo: "error", texto: "Por favor completa el captcha." });
      setLoading(false);
      resetearCaptcha();
      return;
    }

    try {
      const data = await loginUsuario({ email, password, captcha });

      if (data && data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("cliente", JSON.stringify(data.cliente));
        setCliente(data.cliente);

        try {
          await hidratarCarritoDesdePedidoEnCarrito(Number(data.cliente.idCli));
        } catch (error) {
          console.error("No se pudo hidratar el carrito desde el pedido en carrito:", error);
        }

        const mensajeExito = {
          tipo: "success" as "success",
          texto: "¡Inicio de sesión exitoso, bienvenido!",
        };

        switch (data.cliente.idTipoCli) {
          case 1:
            navigate("/admin", { state: { mensaje: mensajeExito } });
            break;
          case 2:
            navigate("/clienteIngresado", { state: { mensaje: mensajeExito } });
            break;
          case 3:
            navigate("/productos-especiales", {
              state: { mensaje: mensajeExito },
            });
            break;
          default:
            navigate("/", { state: { mensaje: mensajeExito } });
        }
      } else {
        setMensaje({
          tipo: "error",
          texto: "Respuesta inesperada del servidor.",
        });
      }
    } catch (err) {
      console.error("Error al iniciar sesión:", err);

      let mensajeError = "Error al conectar con el servidor.";

      if (err instanceof Error) {
        mensajeError = err.message;
      } else if (typeof err === "string") {
        mensajeError = err;
      } else if (
        err &&
        typeof err === "object" &&
        "message" in err &&
        typeof err.message === "string"
      ) {
        mensajeError = err.message;
      }

      setMensaje({
        tipo: "error",
        texto: mensajeError,
      });
      resetearCaptcha();
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

           <div style={{ margin: "15px 0", display: "flex", justifyContent: "center" }}>
                <ReCAPTCHA
                ref={recaptchaRef}
                sitekey="6LcId4wsAAAAACh1zDxtPNzTFaCmzh89LVrSkJw7"
                onChange={(value: string | null) => setCaptcha(value)}
                />
            </div>

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