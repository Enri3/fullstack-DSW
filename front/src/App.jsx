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
import FormaDeEntrega from "./pages/formaDeEntrega";
import MedioDePago from "./pages/medioDePago";
import AdminPedidos from "./pages/admin-pedidos";
import HistorialPedidos from "./pages/historial-pedidos";
import DetallePedido from "./pages/detallePedido";
import Exito from "./pages/exito";
import Fracaso from "./pages/fracaso";
import Pendiente from "./pages/pendiente";

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
        <Route path="/admin" element={<ProtectedRoute tipoRequerido={1}><Admin /></ProtectedRoute>}/>
        <Route path="/admin/pedidos" element={<ProtectedRoute tipoRequerido={1}><AdminPedidos /></ProtectedRoute>} />
        <Route path="/productosAdmin" element={<ProtectedRoute tipoRequerido={1}><DisplayProductos /></ProtectedRoute>} />
        <Route path="/carrito" element={<ProtectedRoute><MostrarCarrito /></ProtectedRoute>} />
        <Route path="/formaDeEntrega" element={<ProtectedRoute><FormaDeEntrega /></ProtectedRoute>} />
        <Route path="/medioDePago" element={<ProtectedRoute><MedioDePago /></ProtectedRoute>} />
        <Route path="/nuevoProducto" element={<ProtectedRoute tipoRequerido={1}><NuevoProducto /></ProtectedRoute>} />
        <Route path="/modificarProducto/:idProd" element={<ProtectedRoute tipoRequerido={1}><ModificarProducto /></ProtectedRoute>} />
        <Route path="/clienteIngresado" element={<ProtectedRoute><ClienteIngresado /></ProtectedRoute>} />
        <Route path="/historial-pedidos" element={<ProtectedRoute><HistorialPedidos /></ProtectedRoute>} />
        <Route path="/detallePedido/:idPedido" element={<ProtectedRoute><DetallePedido /></ProtectedRoute>} />
        <Route path="/cerrar-sesion" element={<ProtectedRoute><CerrarSesion /></ProtectedRoute>} />
        <Route path="/editar-cliente" element={<ProtectedRoute><EditarCliente /></ProtectedRoute>} />
        <Route path="/eliminar-clientes" element={<ProtectedRoute tipoRequerido={1}><EliminarClientes /></ProtectedRoute>} />
        <Route path="/detalleAdmin" element={<ProtectedRoute tipoRequerido={1}><DetalleAdmin /></ProtectedRoute>} />
        <Route path="/gestion-descuentos" element={<ProtectedRoute tipoRequerido={1}><Descuentos /></ProtectedRoute>} />
        <Route path="/cambiar-password" element={<ProtectedRoute><CambiarPassword /></ProtectedRoute>} />
        <Route path="/nuevo-descuento" element={<ProtectedRoute tipoRequerido={1}><NuevoDescuento /></ProtectedRoute>} />
        <Route path="/exito" element={<ProtectedRoute><Exito /></ProtectedRoute>} />
        <Route path="/fracaso" element={<ProtectedRoute><Fracaso /></ProtectedRoute>} />
        <Route path="/pendiente" element={<ProtectedRoute><Pendiente /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;