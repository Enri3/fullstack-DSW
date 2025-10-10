import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/img/logo.png";
import "../assets/styles/style.css"; 
import "../assets/styles/index.css";


export default function Header_sinCarrito() {


  return (
    <header>
      <nav>
        <Link to="/">
          <img src={logo} id="logo" alt="Logo" />
          <span id="logo-text">ViveLas</span>
        </Link>
        <div id="menu">
        </div>
      </nav>
    </header>
  );
}