import { useState, useRef } from "react";
import "../assets/styles/login.css";
import Header_sinCarrito from "../components/header_sinCarrito";
import MensajeAlerta from "../components/mensajesAlerta";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";

export default function Register() {
  const navigate = useNavigate();
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [nombreCli, setNombreCli] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [direccion, setDireccion] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [captcha, setCaptcha] = useState<string | null>(null);

  const [mensaje, setMensaje] = useState<{
    texto: string;
    tipo: "success" | "error" | "info";
  } | null>(null);

  const resetearCaptcha = () => {
    recaptchaRef.current?.reset();
    setCaptcha(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje(null);

    if (password !== confirmPassword) {
      setMensaje({ texto: "Las contraseñas no coinciden ❌", tipo: "error" });
      resetearCaptcha();
      return;
    }

    if (!captcha) {
      setMensaje({ texto: "Por favor completa el captcha.", tipo: "error" });
      resetearCaptcha();
      return;
    }

    try {
      const res = await fetch("http://localhost:4000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombreCli,
          apellido,
          direccion,
          email,
          password,
          captcha,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        navigate("/login", {
          state: {
            mensaje: {
              texto: "¡Te registraste correctamente! Ahora podés iniciar sesión.",
              tipo: "success",
            },
          },
        });
      } else {
        setMensaje({
          texto: data.message || "Error al registrarse",
          tipo: "error",
        });
        resetearCaptcha();
      }
    } catch (error) {
      console.error("Error al conectar con el servidor:", error);
      setMensaje({
        texto: "No se pudo conectar con el servidor.",
        tipo: "error",
      });
      resetearCaptcha();
    }
  };

  return (
    <>
      <Header_sinCarrito />

      <div className="login-page">
        <div className="login-container">
          <h2>Crear cuenta</h2>

          {mensaje && <MensajeAlerta tipo={mensaje.tipo} texto={mensaje.texto} />}

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Nombre"
              value={nombreCli}
              onChange={(e) => setNombreCli(e.target.value)}
              required
            />

            <input
              type="text"
              placeholder="Apellido"
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
              required
            />

            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="text"
              placeholder="Dirección"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Confirmar contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

           <div style={{ margin: "15px 0", display: "flex", justifyContent: "center" }}>
                <ReCAPTCHA
                ref={recaptchaRef}
                sitekey="6LcId4wsAAAAACh1zDxtPNzTFaCmzh89LVrSkJw7"
                onChange={(value: string | null) => setCaptcha(value)}
                />
            </div>

            <button type="submit">Registrarme</button>
          </form>

          <a href="/login" className="register-link">
            ¿Ya tenés una cuenta? Iniciá sesión
          </a>
        </div>
      </div>
    </>
  );
}