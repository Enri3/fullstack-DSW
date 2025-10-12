import { useState } from "react";
import "../assets/styles/login.css";
import Header_sinCarrito from "../components/header_sinCarrito";
import { loginUsuario } from "../services/authService";
import logo from "../assets/img/logo.png";
import { useNavigate } from 'react-router-dom';
import type { Cliente } from "../../../entidades/cliente";
import { clienteVacio } from "../../../entidades/cliente";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cliente, setCliente] = useState<Cliente>(clienteVacio);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data = await loginUsuario({ email, password });

      if (data && data.token) {
        
        localStorage.setItem("token", data.token);
        localStorage.setItem("cliente", JSON.stringify(data.cliente));
        setCliente(data.cliente);

        switch (data.cliente.idTipoCli) {
          case 1:
            navigate('/clienteIngresado');
            break;
          case 2:
            // Redirigir a la página del cliente tipo 2
            navigate('/productos-especiales');
            break;
          case 3:
            // Redirigir a una página por defecto
            navigate('/admin-panel');
            break;
        }

        // Redirigir a clienteIngresado
        //window.location.href = "./clienteIngresado";

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