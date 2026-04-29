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
          <Link to="/admin">Panel de Navegación</Link>
          <Link to="/admin/pedidos">Pedidos</Link>
          <Link to="/productosAdmin">Productos</Link>
          <Link to="/eliminar-clientes">Clientes</Link>
          <Link to="/gestion-descuentos">Descuentos</Link>
          <Link to="/cerrar-sesion">Cerrar Sesión</Link>
        </div>

        <details className="mobile-nav">
          <summary>Menú</summary>
          <div className="mobile-nav-menu">
            <Link to="/admin">Panel de Navegación</Link>
            <Link to="/admin/pedidos">Pedidos</Link>
            <Link to="/productosAdmin">Productos</Link>
            <Link to="/eliminar-clientes">Clientes</Link>
            <Link to="/gestion-descuentos">Descuentos</Link>
            <Link to="/cerrar-sesion">Cerrar Sesión</Link>
          </div>
        </details>

      </nav>


    </header>
  );
}