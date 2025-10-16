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
          <Link to="/clienteIngresado">
            Panel de Navegación
          </Link>
          
          <Link to="/cerrar-sesion">Cerrar Sesión</Link>
          
          <Link to="/carrito">
            <i className="material-icons icono">shopping_cart</i>
            <span id="cuenta_carrito">{cantidad}</span>
          </Link>
        </div>
      </nav>
    </header>
  );
}