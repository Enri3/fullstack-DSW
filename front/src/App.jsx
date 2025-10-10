import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DisplayProductos from "./pages/productos_Admin";
import MostrarCarrito from "./pages/carrito";
import NuevoProducto from "./pages/nuevoProducto";
import Login from "./pages/Login"; // 👈 import del login

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DisplayProductos />} />
        <Route path="/carrito" element={<MostrarCarrito />} />
        <Route path="/nuevoProducto" element={<NuevoProducto />} />
        <Route path="/login" element={<Login />} /> {/* 👈 ruta del login */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;