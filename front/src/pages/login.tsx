import { useState } from "react";
import "../assets/styles/login.css";
import Header_sinCarrito from "../components/header_sinCarrito";
import { loginUsuario } from "../services/authService";
import logo from "../assets/img/logo.png";
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      console.log("Intentando iniciar sesión con:", email);
      const data = await loginUsuario({ email, password });

      // data debería contener token y tipoCliente segun tu backend
      if (data && data.token) {

        localStorage.setItem("token", data.token);
        localStorage.setItem("email", email);
        localStorage.setItem("idCliente", String(data.idCliente));
        
        if (data.nombre) localStorage.setItem("nombre", String(data.nombre));
        if (data.apellido) localStorage.setItem("apellido", String(data.apellido));
        if (data.direccion) localStorage.setItem("direccion", String(data.direccion));

        if (data.idTipoCli !== undefined) {
          localStorage.setItem("tipoCliente", String(data.idTipoCli));
        }

        // Redirigir a clienteIngresado
        window.location.href = "./clienteIngresado";

      } else {
        setError("Respuesta inesperada del servidor.");
      }
    } catch (err: any) {
      console.error("Error al iniciar sesión:", err);
      setError(err.message || "Error al conectar con el servidor.");
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

          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
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

          {error && <div className="login-error">{error}</div>}

          <a href="/register" className="register-link">
            ¿No tienes cuenta? Regístrate
          </a>
        </div>
      </div>
    </>
  );
}