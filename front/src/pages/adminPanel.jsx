import React from 'react';
import Header_sinCarrito from '../components/header_sinCarrito';

export default function AdminPanel() {
  return (
    <>
      <Header_sinCarrito />
        <div className="profile-container">
          <h1>Bienvenido, {cliente.nombreCli} {cliente.apellidoCli}</h1>
          <p><strong>Email:</strong> {cliente.email}</p>
          <p><strong>Dirección:</strong> {cliente.direccion}</p>
          <p><strong>Tipo de Cliente:</strong> {cliente.idTipoCli}</p>
          <Link to="/editar-cliente" className="edit-button">Editar Perfil</Link>
        </div>
    </>
  );
}