import { useEffect, useState } from "react";
import HeaderClienteIngresado from "../components/header_clienteIngresado";
import logo from "../assets/img/logo.png";
import { agregarAlCarrito, obtenerCantidadCarrito } from "../services/cartService";
import { Link } from "react-router-dom";
import type { Cliente } from "../../../entidades/cliente";
import { clienteVacio } from "../../../entidades/cliente";
import "../assets/styles/clienteIngresado.css";

export default function AdminPanel() {
  const [cantidad, setCantidad] = useState(obtenerCantidadCarrito());
  const [cliente, setCliente] = useState<Cliente>(clienteVacio);
  
    useEffect(() => {
      const storedCliente = localStorage.getItem("cliente");
      if (storedCliente) {
        setCliente(JSON.parse(storedCliente));
      }
    }, []);

  return (
    <>
      <HeaderClienteIngresado cantidad={cantidad} />
        <div className="profile-container">
          <h1>Bienvenido, {cliente.nombreCli} {cliente.apellidoCli}</h1>
          <p><strong>Email:</strong> {cliente.email}</p>
          <p><strong>Dirección:</strong> {cliente.direccion}</p>
          <p><strong>Tipo de Cliente:</strong> {cliente.idTipoCli}</p>
          <Link to="/editar-cliente" className="edit-button">Editar Perfil</Link>
        </div>
    </>
  );
}