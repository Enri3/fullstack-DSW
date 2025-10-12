import { useState } from "react";
import "../assets/styles/login.css";
import HeaderClienteIngresado from "../components/header_clienteIngresado";
import { agregarAlCarrito, obtenerCantidadCarrito } from "../services/cartService";
import { useNavigate } from 'react-router-dom';
import type { Cliente } from "../../../entidades/cliente";
import { clienteVacio } from "../../../entidades/cliente";
import { useEffect } from "react";

export default function EditarCliente() {
  const [cantidad, setCantidad] = useState(obtenerCantidadCarrito());
  const navigator = useNavigate();
  
  const [cliente, setCliente] = useState<Cliente>(clienteVacio);
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [direccion, setDireccion] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  useEffect(() => {
      const storedCliente = localStorage.getItem("cliente");
      if (storedCliente) {
        const parsedCliente = JSON.parse(storedCliente);
        setCliente(parsedCliente);
        setNombre(parsedCliente.nombre || "");
        setApellido(parsedCliente.apellido || "");
        setEmail(parsedCliente.email || "");
        setDireccion(parsedCliente.direccion || "");
      }
    }, []);

  
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Las contraseñas ingresadas no coinciden");
      return;
    }

    try {
      const res = await fetch("http://localhost:4000/auth/edit", {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json", 
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ idCli: cliente.idCli, nombre, apellido, direccion, email, password }),
      });
    
    const data = await res.json();

      if (res.ok) {
        alert("¡Tus datos fueron actualizados correctamente!");
        const updatedCliente = { ...cliente, nombre, apellido, direccion, email };
        localStorage.setItem("cliente", JSON.stringify(updatedCliente));
        navigator('/clienteIngresado');
      } else {
        alert(data.message || "Error al editar el perfil");
      }
    } catch (error) {
      console.error("Error al conectar con el servidor:", error);
      alert("No se pudo conectar con el servidor.");
    }
  };
  
  return (
    <>
      <HeaderClienteIngresado cantidad={cantidad}/>
        <div className="login-page">
          <div className="login-container">
            <h2>Editar Perfil</h2>

            <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
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
              placeholder="Email"
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
              placeholder="Nueva contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirmar contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

              <button type="submit">Guardar cambios</button>
            </form>

            <a href="/login" className="register-link">
              ¿Ya tenés una cuenta? Iniciá sesión
            </a>
          </div>
      </div>
    </>
  );
}
