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
            <i className="material-icons icono">home</i>
            Inicio
          </Link>
          <Link to="/admin/pedidos">
            <i className="material-icons icono">receipt_long</i>
            Pedidos
          </Link>
          <Link to="/productosAdmin">
            <i className="material-icons icono">inventory_2</i>
            Productos
          </Link>
          <Link to="/eliminar-clientes">
            <i className="material-icons icono">group</i>
            Clientes
          </Link>
          <Link to="/gestion-descuentos">
            <i className="material-icons icono">percent</i>
            Descuentos
          </Link>
          <Link to="/cerrar-sesion">
            <i className="material-icons icono">logout</i>
            Cerrar Sesión
          </Link>
        </div>

        <details className="mobile-nav">
          <summary>Menú</summary>
          <div className="mobile-nav-menu">
            <Link to="/admin">
              <i className="material-icons icono">home</i>
              Inicio
            </Link>
            <Link to="/admin/pedidos">
              <i className="material-icons icono">receipt_long</i>
              Pedidos
            </Link>
            <Link to="/productosAdmin">
              <i className="material-icons icono">inventory_2</i>
              Productos
            </Link>
            <Link to="/eliminar-clientes">
              <i className="material-icons icono">group</i>
              Clientes
            </Link>
            <Link to="/gestion-descuentos">
              <i className="material-icons icono">percent</i>
              Descuentos
            </Link>
            <Link to="/cerrar-sesion">
              <i className="material-icons icono">logout</i>
              Cerrar Sesión
            </Link>
          </div>
        </details>

      </nav>


    </header>
  );
}