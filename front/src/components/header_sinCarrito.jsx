import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/img/logo.png";
import "../assets/styles/style.css"; 
import "../assets/styles/index.css";


export default function Header_sinCarrito({ cantidad }) {


  return (
    <header>
      <nav>
        <Link to="/">
          <img src={logo} id="logo" alt="Logo" />
        </Link>
        <div id="menu">
        <Link to="/">
            <p >volver</p>
          </Link>
        </div>
      </nav>
    </header>
  );
}