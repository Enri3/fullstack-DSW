import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DisplayProductos from "./pages/productos_Admin";
import MostrarCarrito from "./pages/carrito";
import NuevoProducto from "./pages/nuevoProducto";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ClienteIngresado from "./pages/clienteIngresado";
import ClienteProfile from "./pages/clienteProfile";
import ProductosEspeciales from './pages/productosEspeciales';
import AdminPanel from './pages/adminPanel';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DisplayProductos />} />
        <Route path="/carrito" element={<MostrarCarrito />} />
        <Route path="/nuevoProducto" element={<NuevoProducto />} />
        <Route path="/login" element={<Login />} /> 
        <Route path="/register" element={<Register />} />
        <Route path="/clienteIngresado" element={<ClienteIngresado />} />
        <Route path="/clienteProfile" element={<ClienteProfile />} />
        <Route path="/productos-especiales" element={<ProductosEspeciales />} />
        <Route path="/admin-panel" element={<AdminPanel />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;