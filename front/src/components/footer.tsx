import React from "react";
import { Link } from "react-router-dom";
import "../assets/styles/style.css";
import "../assets/styles/index.css";

export default function Footer() {
  return (
    <footer>
      <div className="footer-links-wrap">
        <a href="https://www.instagram.com/vivelas_art/">
          Seguinos en instagram: @vivelas_art
        </a>
        <span className="footer-separador">|</span>
        <Link to="/faq">Preguntas Frecuentes</Link>
        <p>© 2025 DSW</p>
      </div>
    </footer>
  );
}