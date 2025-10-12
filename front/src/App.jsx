import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DisplayProductos from "./pages/productos_Admin";
import DisplayProductos_C from "./pages/productos_cliente";
import MostrarCarrito from "./pages/carrito";
import NuevoProducto from "./pages/nuevoProducto";
import ModificarProducto from "./pages/modificarProducto";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Inicio from "./pages/Inicio";
import Detalle from "./components/detalleProducto";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/productosAdmin" element={<DisplayProductos />} />
        <Route path="/productosCliente" element={<DisplayProductos_C />} />
        <Route path="/carrito" element={<MostrarCarrito />} />
        <Route path="/nuevoProducto" element={<NuevoProducto />} />
        <Route path="/modificarProducto/:id" element={<ModificarProducto />} />
        <Route path="/login" element={<Login />} /> 
        <Route path="/register" element={<Register />} />
        <Route path="/detalleProducto" element={<Detalle />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;