import { useState } from "react";
import "../assets/styles/login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Intentando iniciar sesión con:", email, password);
   
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <img src="/logo.png" alt="Vivelas" className="login-logo" />
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
          <button type="submit">Ingresar</button>
        </form>

        <a href="/register" className="register-link">
          ¿No tienes cuenta? Regístrate
        </a>
      </div>
    </div>
  );
}