import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/img/logo.png";
import "../assets/styles/style.css"; 
import "../assets/styles/index.css";


export default function Header({ cantidad }) {


  return (
    <header>
      <nav>
        <Link to="/">
          <img src={logo} id="logo" alt="Logo" />
        </Link>
        <div id="menu">
          <a href="./clientes-crud/index.html">Ingresar</a>
        <Link to="/carrito">
            <i className="material-icons icono">shopping_cart</i>
            <span id="cuenta_carrito">{cantidad}</span>
          </Link>
        </div>
      </nav>
    </header>
  );
}