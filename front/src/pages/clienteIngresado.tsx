import { useEffect, useState } from "react";
import HeaderClienteIngresado from "../components/header_clienteIngresado";
import logo from "../assets/img/logo.png";
import { getNombreTipo } from "../services/tipo_usuarioService";
import { agregarAlCarrito, obtenerCantidadCarrito } from "../services/cartService";
import '../assets/styles/clienteIngresado.css';
import { Link } from "react-router-dom";
import type { Cliente } from "../../../entidades/cliente";
import { clienteVacio } from "../../../entidades/cliente";

export default function ClienteIngresado() {
  const [cantidad, setCantidad] = useState(obtenerCantidadCarrito());
  const [cliente, setCliente] = useState<Cliente>(clienteVacio);
  const [tipoNombre, setTipoNombre] = useState<string>("");

  useEffect(() => {
    const storedCliente = localStorage.getItem("cliente");
    if (storedCliente) {
      setCliente(JSON.parse(storedCliente));
    }
  }, []);

  useEffect(() => {
    if (!cliente.idTipoCli) return;

    switch (cliente.idTipoCli) {
      case 1:
        setTipoNombre("Inicial");
        break;
      case 2:
        setTipoNombre("Premium");
        break;
      case 3:
        setTipoNombre("Administrador");
        break;
      default:
        setTipoNombre("Desconocido");
        break;
    }
  }, [cliente]);


  return (
    <>
      <HeaderClienteIngresado cantidad={cantidad} />
            <div className="dashboard-container">
                
                {/* 1. SECCIÓN DE BIENVENIDA */}
                <section className="welcome-section">
                    <h1 className="welcome-title">Bienvenido, {cliente.nombre} {cliente.apellido}!</h1>
                    <p className="client-status">
                        <strong>Tipo de Cliente:</strong> {tipoNombre}
                    </p>
                </section>

                {/* 2. GRID DE LLAMADAS A LA ACCIÓN (CTAs) */}
                <div className="cta-grid">
                    <Link to="/productos" className="cta-card cta-new">
                        <i className="icon">🛒</i>
                        <h3>Realizar Nuevo Pedido</h3>
                        <p>Explora nuestros productos y comienza a comprar.</p>
                    </Link>
                    <Link to="/mis-facturas" className="cta-card cta-invoice">
                        <i className="icon">🧾</i>
                        <h3>Ver Mis Facturas</h3>
                        <p>Accede y descarga tu historial de pagos.</p>
                    </Link>
                    <Link to="/historial-pedidos" className="cta-card cta-history">
                        <i className="icon">📦</i>
                        <h3>Historial de Pedidos</h3>
                        <p>Revisa el estado de tus compras pasadas.</p>
                    </Link>
                </div>

                {/* 3. LAYOUT DE INFORMACIÓN SECUNDARIA */}
                <div className="info-layout">
                    
                    {/* A. ACTIVIDAD RECIENTE */}
                    <section className="recent-activity">
                        <h2>Pedidos Recientes</h2>
                        <p>No tienes pedidos recientes.</p>
                        <Link to="/historial-pedidos" className="view-all">Ver todos</Link>
                    </section>
                    
                    {/* B. DETALLES DE CUENTA Y SOPORTE */}
                    <div className="side-panels">
                        <section className="account-details">
                            <h2>Datos Personales</h2>
                            <p><strong>Email:</strong> {cliente.email}</p>
                            <p><strong>Dirección:</strong> {cliente.direccion}</p>
                            <p><strong>Miembro desde:</strong> {cliente.creado_en ? new Date(cliente.creado_en).toLocaleDateString() : 'N/A'}</p>
                            
                            {/* Utiliza tu Link existente para editar perfil */}
                            <Link to="/editar-cliente" className="btn-secondary">Editar Perfil</Link>
                            <Link to="/cambiar-password" className="btn-secondary">Cambiar Contraseña</Link>
                        </section>

                        <section className="support-area">
                            <h2>¿Necesitas Ayuda?</h2>
                            <div className="support-links">
                                <Link to="/faq">Preguntas Frecuentes (FAQ)</Link>
                                <Link to="/contacto">Contactar a Soporte</Link>
                            </div>
                        </section>
                    </div>

                </div>
            </div>
        </>
  );
}