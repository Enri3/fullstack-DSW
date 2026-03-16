import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

import DisplayProductos from "./pages/productos_Admin";
import DisplayProductos_C from "./pages/productos_cliente";
import MostrarCarrito from "./pages/carrito";
import NuevoProducto from "./pages/nuevoProducto";
import ModificarProducto from "./pages/modificarProducto";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ClienteIngresado from "./pages/clienteIngresado";
import Admin from "./pages/admin";
import CerrarSesion from "./pages/cerrarSesion";
import EditarCliente from "./pages/editar-cliente";
import EliminarClientes from "./pages/eliminar-clientes";
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
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/productosCliente" element={<DisplayProductos_C />} />
        <Route path="/detalleCliente" element={<DetalleCliente />} />
        <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>}/>
        <Route path="/productosAdmin" element={<ProtectedRoute><DisplayProductos /></ProtectedRoute>} />
        <Route path="/carrito" element={<ProtectedRoute><MostrarCarrito /></ProtectedRoute>} />
        <Route path="/nuevoProducto" element={<ProtectedRoute><NuevoProducto /></ProtectedRoute>} />
        <Route path="/modificarProducto/:idProd" element={<ProtectedRoute><ModificarProducto /></ProtectedRoute>} />
        <Route path="/clienteIngresado" element={<ProtectedRoute><ClienteIngresado /></ProtectedRoute>} />
        <Route path="/cerrar-sesion" element={<ProtectedRoute><CerrarSesion /></ProtectedRoute>} />
        <Route path="/editar-cliente" element={<ProtectedRoute><EditarCliente /></ProtectedRoute>} />
        <Route path="/eliminar-clientes" element={<ProtectedRoute><EliminarClientes /></ProtectedRoute>} />
        <Route path="/detalleAdmin" element={<ProtectedRoute><DetalleAdmin /></ProtectedRoute>} />
        <Route path="/gestion-descuentos" element={<ProtectedRoute><Descuentos /></ProtectedRoute>} />
        <Route path="/cambiar-password" element={<ProtectedRoute><CambiarPassword /></ProtectedRoute>} />
        <Route path="/nuevo-descuento" element={<ProtectedRoute><NuevoDescuento /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;