import { useEffect, useState } from "react";
import HeaderClienteIngresado from "../components/header_clienteIngresado";
import logo from "../assets/img/logo.png";
import { agregarAlCarrito, obtenerCantidadCarrito } from "../services/cartService";
import { Link } from "react-router-dom";
import type { Cliente } from "../../../entidades/cliente";
import { clienteVacio } from "../../../entidades/cliente";
import "../assets/styles/admin.css";

export default function Admin() {
  const [cantidad, setCantidad] = useState(obtenerCantidadCarrito());
  const [cliente, setCliente] = useState<Cliente>(clienteVacio);
  
    useEffect(() => {
      const storedCliente = localStorage.getItem("cliente");
      if (storedCliente) {
        setCliente(JSON.parse(storedCliente));
      }
    }, []);

  return (
    <>
      <HeaderClienteIngresado cantidad={cantidad} />
            <div className="dashboard-container admin-dashboard">
                
                {/* 1. SECCIÓN DE BIENVENIDA Y ESTADÍSTICAS */}
                <section className="welcome-section admin-welcome">
                    <h1 className="welcome-title">Panel de Administración</h1>
                    <p className="admin-status">Bienvenido, {cliente.nombre}.</p>
                </section>

                {/* 3. GRID DE LLAMADAS A LA ACCIÓN (CTAs) DE GESTIÓN */}
                <h2 className="section-title">Tareas de Gestión</h2>
                <div className="cta-grid admin-cta-grid">
                    <a href="/admin/pedidos" className="cta-card cta-pedidos">
                        <i className="icon">📝</i>
                        <h3>Gestionar Pedidos</h3>
                        <p>Ver y procesar órdenes de compra.</p>
                    </a>
                    <a href="/admin/productos" className="cta-card cta-productos">
                        <i className="icon">📦</i>
                        <h3>Inventario y Productos</h3>
                        <p>Añadir, editar o eliminar productos.</p>
                    </a>
                    <Link to="/eliminar-clientes" className="cta-card cta-clientes">
                        <i className="icon">👤</i>
                        <h3>Gestión de Clientes</h3>
                        <p>Ver y editar cuentas de usuario.</p>
                    </Link>
                    <a href="/admin/reportes" className="cta-card cta-reportes">
                        <i className="icon">📊</i>
                        <h3>Reportes y Análisis</h3>
                        <p>Revisar estadísticas de ventas.</p>
                    </a>
                </div>

                {/* 4. SECCIÓN DE ACTIVIDAD RECIENTE */}
                <div className="info-layout admin-activity">
                    <section className="recent-activity admin-recent-orders">
                        <h2>Últimos Pedidos Pendientes</h2>
                        {/* Aquí iría una tabla o lista de pedidos */}
                        <p>Pedido #1234 - Cliente A - $1.200</p>
                        <p>Pedido #1233 - Cliente B - $950</p>
                        <p>No hay pedidos urgentes.</p>
                        <a href="/admin/pedidos" className="view-all">Ver todos los pedidos</a>
                    </section>
                    
                    <section className="account-details admin-settings">
                        <h2>Configuración</h2>
                        <a href="/admin/ajustes" className="btn-secondary">Ajustes Generales</a>
                        <a href="/admin/usuarios" className="btn-secondary">Gestionar Usuarios Admin</a>
                        <p className="admin-member-since">Miembro desde: 01/01/2020</p>
                    </section>
                </div>

            </div>
        </>
  );
}