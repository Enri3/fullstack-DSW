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
        <Link to="/">
          <img src={logo} id="logo" alt="Logo" />
        </Link>
        <div id="menu">
          
        </div>
      </nav>
    </header>
  );
}