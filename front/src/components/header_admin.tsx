import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/img/logo.png";
import "../assets/styles/style.css"; 
import "../assets/styles/index.css";

export default function HeaderAdmin() {
  
  return (
    <header>
      <nav>
        <Link to="/admin">
          <img src={logo} id="logo" alt="Logo" />
        </Link>
        
             <div id="menu">
                <Link to="/admin">
                   Panel de Navegación
                </Link>
                       
                <Link to="/cerrar-sesion">Cerrar Sesión</Link>

              </div>

      </nav>


    </header>
  );
}