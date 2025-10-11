import { useEffect, useState } from "react";
import Header_sinCarrito from "../components/header_sinCarrito";
import logo from "../assets/img/logo.png";
import { getNombreTipo } from "../services/tipo_usuarioService";
import "../assets/styles/profile.css";

export default function ClienteProfile() {
  const [email, setEmail] = useState<string | null>(null);
  const [tipoCliente, setTipoCliente] = useState<string | null>(null);
  const [id, setId] = useState<string | null>(null);
  const [nombreTipo, setNombreTipo] = useState<string | null>(null);
  const [nombre, setNombre] = useState<string | null>(null);
  const [apellido, setApellido] = useState<string | null>(null);
  const [direccion, setDireccion] = useState<string | null>(null);

    useEffect(() => {
        const storedEmail = localStorage.getItem("email");
        const storedTipoCliente = localStorage.getItem("tipoCliente");
        const storedNombreTipo = localStorage.getItem("nombreTipo");
        const storedIdCliente = localStorage.getItem("idCliente");
        const storedNombre = localStorage.getItem("nombre");
        const storedApellido = localStorage.getItem("apellido");
        const storedDireccion = localStorage.getItem("direccion");

        
        setEmail(storedEmail);
        setTipoCliente(storedTipoCliente);
        setNombreTipo(storedNombreTipo);
        setId(storedIdCliente);
        setNombre(storedNombre);
        setApellido(storedApellido);
        setDireccion(storedDireccion);

        if (!storedNombreTipo && storedTipoCliente) {
            const fetchNombreTipo = async (idTipo: string) => {
                try {
                    const nombre = await getNombreTipo({ id: Number(idTipo) });
                    setNombreTipo(nombre);
                    localStorage.setItem("nombreTipo", nombre);
                } catch (error) {
                    setNombreTipo("Error al cargar");
                }
            };
            fetchNombreTipo(storedTipoCliente);
        }
        
    }, []);

  return (
    <>
      <Header_sinCarrito />
        <div className="profile-page-container"> {/* Contenedor principal */}
            
            <div className="profile-card"> {/* Tarjeta del Perfil */}
               <h2>Perfil de Cliente</h2>
                
                {/* Avatar / Icono */}
                <div className="profile-icon">
                    👤
                </div>

                {/* Sección de Identidad */}
                <div className="profile-section identity-section">
                    <h3>Identidad</h3>
                    <div className="profile-info-grid">
                        <p><strong>Nombre:</strong> <span>{nombre} {apellido}</span></p>
                        <p><strong>Email:</strong> <span>{email}</span></p>
                        <p><strong>Dirección:</strong> <span>{direccion}</span></p>
                    </div>
                </div>

                {/* Sección de Estatus / Roles */}
                <div className="profile-section status-section">
                    <h3>Estatus y Acceso</h3>
                    <div className="profile-info-grid">
                        <p><strong>Rol:</strong> <span className="tag-tipo">{nombreTipo}</span></p>
                        <p><strong>ID Cliente:</strong> <span>{id}</span></p>
                        <p><strong>ID Tipo:</strong> <span>{tipoCliente}</span></p>
                    </div>
                </div>
            </div>
        </div>
    </>
  );
}