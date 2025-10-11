import { useEffect, useState } from "react";
import HeaderClienteIngresado from "../components/header_clienteIngresado";
import logo from "../assets/img/logo.png";
import { getNombreTipo } from "../services/tipo_usuarioService";
import { agregarAlCarrito, obtenerCantidadCarrito } from "../services/cartService";
import '../assets/styles/clienteIngresado.css';
import { Link } from "react-router-dom";

export default function ClienteIngresado() {
  const [email, setEmail] = useState<string | null>(null);
  const [tipoCliente, setTipoCliente] = useState<string | null>(null);
  const [nombreTipo, setNombreTipo] = useState<string | null>(null);
  const [cantidad, setCantidad] = useState(obtenerCantidadCarrito());

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    const storedTipoCliente = localStorage.getItem("tipoCliente");

    setEmail(storedEmail);
    setTipoCliente(storedTipoCliente);

    let fetchNombreTipo = async (idTipo: string) => {
        try{
            const nombre = await getNombreTipo({ id: Number(idTipo) });
            setNombreTipo(nombre);
            localStorage.setItem("nombreTipo", nombre);
        } catch (error) {
        console.error("Error al obtener el nombre del tipo de cliente:", error);
      }
    };
    fetchNombreTipo(storedTipoCliente || "");
  }, []);
  switch (tipoCliente) {
    case "1":
      window.location.href = "./clienteProfile";
      break;
    case "2":
      window.location.href = "./productos-especiales";
      break;
    case "3":
      window.location.href = "./admin-panel";
      break;
  }
  return (
    <>
      <HeaderClienteIngresado cantidad={cantidad} />
        <div className="bienvenida-page-container">
            
            <div className="bienvenida-card">
                
                {/* Icono de Bienvenida */}
                <div className="bienvenida-icon">
                    🛒
                </div>

                {/* Mensaje principal de bienvenida */}
                <h2>
                    ¡Bienvenido/a, 
                    <span className="email-highlight"> 
                        {email ? email.split('@')[0] : 'Cliente'}
                    </span>!
                </h2>
                
                {/* Resumen del estatus y mensaje */}
                <p className="bienvenida-slogan">
                    Has iniciado sesión con éxito. Estás listo para explorar nuestros productos.
                </p>

                {/* Panel de Información del Tipo de Cliente */}
                <div className="info-panel-tipo">
                    <p>
                        Tu estatus de cliente es: 
                        <span className="tag-tipo-bienvenida">
                             {nombreTipo || 'Cargando...'}
                        </span>
                    </p>
                </div>

                {/* Opciones/Botones principales (Call to Action) */}
                <div className="action-buttons">
                    <Link to="/">
                        <button className="btn-primary-action">
                            Ver Productos
                        </button>
                    </Link> 
                    <Link to="/clienteProfile"><button className="btn-secondary-action">
                        Ir a Mi Perfil
                    </button>
                    </Link>
                    <Link to="/carrito">
                    <button className="btn-secondary-action">
                        Ver Carrito ({cantidad})
                    </button>
                    </Link>
                </div>
            </div>

            {/* Opcional: Una pequeña sección para mostrar la cantidad del carrito de forma destacada */}
            <div className="resumen-carrito">
                <h3>Tu Carrito</h3>
                <p className="cantidad-destacada">
                    {cantidad}
                </p>
                <p>productos esperando</p>
            </div>
        </div>
    </>
  );
}