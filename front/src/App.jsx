import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import DisplayProductos from "./pages/productos_Admin";
import DisplayProductos_C from "./pages/productos_cliente";
import MostrarCarrito from "./pages/carrito";
import NuevoProducto from "./pages/nuevoProducto";
import ModificarProducto from "./pages/modificarProducto";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ClienteIngresado from "./pages/clienteIngresado";
import Admin from './pages/admin';
import CerrarSesion from './pages/cerrarSesion';
import EditarCliente from './pages/editar-cliente';
import EliminarClientes from './pages/eliminar-clientes';
import DetalleAdmin from "./pages/detalleAdmin";
import DetalleCliente from "./pages/detalleCliente";
import Inicio from "./pages/Inicio";
import Descuentos from "./pages/gestion-descuentos";
import CambiarPassword from "./pages/cambiar-password";
import NuevoDescuento from "./pages/nuevo-descuento";


function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/productosAdmin" element={<DisplayProductos />} />
        <Route path="/productosCliente" element={<DisplayProductos_C />} />
        <Route path="/carrito" element={<MostrarCarrito />} />
        <Route path="/nuevoProducto" element={<NuevoProducto />} />
        <Route path="/modificarProducto/:idProd" element={<ModificarProducto />} />
        <Route path="/login" element={<Login />} /> 
        <Route path="/register" element={<Register />} />
        <Route path="/clienteIngresado" element={<ClienteIngresado />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/cerrar-sesion" element={<CerrarSesion />} />
        <Route path="/editar-cliente" element={<EditarCliente />} />
        <Route path="/eliminar-clientes" element={<EliminarClientes />} />
        <Route path="/detalleAdmin" element={<DetalleAdmin />} />
        <Route path="/detalleCliente" element={<DetalleCliente />} />
        <Route path="/gestion-descuentos" element={<Descuentos />} />
        <Route path="/cambiar-password" element={<CambiarPassword />} />
        <Route path="/nuevo-descuento" element={<NuevoDescuento />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;