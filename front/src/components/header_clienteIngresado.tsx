import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/img/logo.png";
import "../assets/styles/style.css"; 
import "../assets/styles/index.css";
import header from "./header";

interface HeaderProps {
  cantidad: number;
}

export default function HeaderClienteIngresado({ cantidad }: HeaderProps) {
  return (
    <header>
      <nav>
        <Link to="/">
          <img src={logo} id="logo" alt="Logo" />
        </Link>
        <div id="menu">
          
          <Link to="/login">Ingresar</Link>
          
          <Link to="/carrito">
            <i className="material-icons icono">shopping_cart</i>
            <span id="cuenta_carrito">{cantidad}</span>
          </Link>
          <Link to="/clienteProfile">
            <i className="material-icons icono">account_circle</i>
          </Link>
        </div>
      </nav>
    </header>
  );
}