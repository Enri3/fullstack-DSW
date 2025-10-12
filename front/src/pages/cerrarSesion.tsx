import React from 'react';
import { Navigate } from 'react-router-dom';

export default function CerrarSesion() {
    localStorage.removeItem("token");
    localStorage.removeItem("cliente");

    return <Navigate to="/" />;
}