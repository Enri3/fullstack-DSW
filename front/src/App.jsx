import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DisplayProductos from "./pages/productos_Admin";
import MostrarCarrito from "./pages/carrito";
import NuevoProducto from "./pages/nuevoProducto";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ClienteIngresado from "./pages/clienteIngresado";
import ProductosEspeciales from './pages/productosEspeciales';
import Admin from './pages/admin';
import CerrarSesion from './pages/cerrarSesion';
import EditarCliente from './pages/editar-cliente';
import EliminarClientes from './pages/eliminar-clientes';

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
        <Route path="/productos-especiales" element={<ProductosEspeciales />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/cerrar-sesion" element={<CerrarSesion />} />
        <Route path="/editar-cliente" element={<EditarCliente />} />
        <Route path="/eliminar-clientes" element={<EliminarClientes />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;