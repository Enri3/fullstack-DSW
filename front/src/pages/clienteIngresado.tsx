import { useEffect, useState } from "react";
import HeaderClienteIngresado from "../components/header_clienteIngresado";
import Header from "../components/header";
import logo from "../assets/img/logo.png";
import { getNombreTipo } from "../services/tipo_usuarioService";
import { agregarAlCarrito, obtenerCantidadCarrito } from "../services/cartService";

export default function ClienteIngresado() {
  const [email, setEmail] = useState<string | null>(null);
  const [tipoCliente, setTipoCliente] = useState<string | null>(null);
  const [nombreTipo, setNombreTipo] = useState<string | null>(null);
  const [cantidad, setCantidad] = useState(obtenerCantidadCarrito());

  // Hemos combinado la lógica aquí
  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    const storedTipoCliente = localStorage.getItem("tipoCliente");
    
    setEmail(storedEmail);
    setTipoCliente(storedTipoCliente);

    let fetchNombreTipo = async (idTipo: string) => {
        try{
            const nombre = await getNombreTipo({ id: Number(idTipo) });
            setNombreTipo(nombre);
            localStorage.setItem("nombreTipo", nombre);
        } catch (error) {
        console.error("Error al obtener el nombre del tipo de cliente:", error);
      }
    };
    fetchNombreTipo(storedTipoCliente || "");
  }, []);

  return (
    <>
      <HeaderClienteIngresado cantidad={cantidad} />
        <div className="login-page">
          <h2>Bienvenido, {email}</h2>
          <p>Tipo de cliente: {tipoCliente}</p>
          <p>Nombre del tipo de cliente: {nombreTipo}</p>
        </div>
    </>
  );
}