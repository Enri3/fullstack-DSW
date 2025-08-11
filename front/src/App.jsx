
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DisplayProductos from "./pages/productos.jsx";
import MostrarCarrito from "./pages/carrito.jsx";
function App() {
  return (
    <BrowserRouter>
     
      <Routes>
        <Route path="/" element={<DisplayProductos />} />
        <Route path="/carrito" element={<MostrarCarrito />} />
      </Routes>
    
    </BrowserRouter>
  );
}
export default App;