import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DisplayProductos from "./pages/productos_Admin";
import MostrarCarrito from "./pages/carrito";
import NuevoProducto from "./pages/nuevoProducto";
import ModificarProducto from "./pages/modificarProducto";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DisplayProductos />} />
        <Route path="/carrito" element={<MostrarCarrito />} />
        <Route path="/nuevoProducto" element={<NuevoProducto />} />
        <Route path="/modificarProducto/:id" element={<ModificarProducto />} />
        <Route path="/login" element={<Login />} /> 
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;