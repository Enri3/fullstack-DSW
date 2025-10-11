import React from 'react';
import Header_sinCarrito from '../components/header_sinCarrito';

export default function AdminPanel() {
  return (
    <>
      <Header_sinCarrito />
      <div className="page-content">
        <h1>Panel de Administración (Tipo Cliente 3)</h1>
        {/* Aquí irían las herramientas de gestión de la aplicación */}
      </div>
    </>
  );
}