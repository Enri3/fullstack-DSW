import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/img/logo.png";
import "../assets/styles/style.css";
import "../assets/styles/index.css";

interface HeaderProps {
  cantidad: number;
}

export default function HeaderClienteIngresado({ cantidad }: HeaderProps) {
  
  return (
    <header>
      <nav>
        <Link to="/clienteIngresado">
          <img src={logo} id="logo" alt="Logo" />
        </Link>

        <div id="menu">
          <Link to="/clienteIngresado">Panel de Navegación</Link>
          <Link to="/productosCliente">Productos</Link>
          <Link to="/historial-pedidos">Historial</Link>
          <Link to="/editar-cliente">Ver perfil</Link>
          <Link to="/carrito">
            <i className="material-icons icono">shopping_cart</i>
            <span id="cuenta_carrito">{cantidad}</span>
          </Link>
          <Link to="/cerrar-sesion">Cerrar Sesión</Link>
        </div>

        <details className="mobile-nav">
          <summary>Menú</summary>
          <div className="mobile-nav-menu">
            <Link to="/clienteIngresado">Panel de Navegación</Link>
            <Link to="/productosCliente">Productos</Link>
            <Link to="/historial-pedidos">Historial</Link>
            <Link to="/editar-cliente">Ver perfil</Link>
            <Link to="/carrito">
              <span>Carrito ({cantidad})</span>
            </Link>
            <Link to="/cerrar-sesion">Cerrar Sesión</Link>
          </div>
        </details>
      </nav>
    </header>
  );
}