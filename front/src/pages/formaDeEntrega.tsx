import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import HeaderConPanel from "../components/header_conBotonPanel";
import Footer from "../components/footer";
import { buildImageUrl } from "../utils/imageUrl";
import "../assets/styles/formaDeEntrega.css";
import "../assets/styles/cart.css";
import { obtenerCantidadCarrito, obtenerProductosCarrito } from "../services/cartService";

type ProductoCarrito = {
  idProd: number;
  nombreProd: string;
  precioProd: number;
  cantidad: number;
  urlImg?: string;
};

type ClienteStorage = {
  direccion?: string;
};

export default function FormaDeEntrega() {
  const navigate = useNavigate();
  const [cantidad] = useState(obtenerCantidadCarrito());
  const [productos, setProductos] = useState<ProductoCarrito[]>([]);
  const [direccionCliente, setDireccionCliente] = useState("");
  const [opcionEntrega, setOpcionEntrega] = useState<"domicilio" | "retiro" | null>(null);

  useEffect(() => {
    try {
      const prods = obtenerProductosCarrito().map((p: any) => {
        const precio = Number(p.precioProd);
        const cantidad = Number(p.cantidad);

        return {
          ...p,
          idProd: Number(p.idProd),
          precioProd: Number.isNaN(precio) ? 0 : precio,
          cantidad: Number.isNaN(cantidad) ? 0 : cantidad,
        };
      });

      setProductos(prods);

      const clienteJSON = localStorage.getItem("cliente");
      if (clienteJSON) {
        const cliente = JSON.parse(clienteJSON) as ClienteStorage;
        setDireccionCliente(cliente.direccion || "");
      }
    } catch (error) {
      console.error("Error al cargar forma de entrega:", error);
      setProductos([]);
    }
  }, []);

  const totalUnidades = useMemo(
    () => productos.reduce((acc, p) => acc + p.cantidad, 0),
    [productos]
  );

  const totalPrecio = useMemo(
    () => productos.reduce((acc, p) => acc + p.cantidad * p.precioProd, 0),
    [productos]
  );

  const handleElegirMedioPago = () => {
    if (!opcionEntrega) return;

    navigate("/medioDePago", {
      state: {
        formaEntrega: opcionEntrega,
        direccionCliente,
        totalUnidades,
        totalPrecio,
      }
    });
  };

  return (
    <>
      <HeaderConPanel cantidad={cantidad} />
      <main className="entrega-main">
        <section className="entrega-card">
          <h1>Forma de entrega</h1>
          <Link className="link-productos" to="/productosCliente">Volver a ver productos</Link>

          {productos.length === 0 ? (
            <div className="entrega-vacio">
              <p>No hay productos en el carrito para mostrar el resumen.</p>
              <Link className="link-productos" to="/productosCliente">Ver productos</Link>
            </div>
          ) : (
            <>
              <h2>Resumen de compra</h2>
              <section id="productos-container-carrito" className="lista-scroll-5 resumen-scroll-5">
                {productos.map((producto) => {
                  const subtotal = producto.precioProd * producto.cantidad;
                  return (
                    <article key={producto.idProd} className="tarjeta-producto-carrito resumen-carrito-item">
                      <img src={buildImageUrl(producto.urlImg)} alt={producto.nombreProd} />
                      <div className="resumen-carrito-info">
                        <h3>{producto.nombreProd}</h3>
                        <p className="precio">Precio unitario: ${producto.precioProd.toFixed(2)}</p>
                      </div>
                      <div className="resumen-carrito-extra">
                        <p>Cantidad: {producto.cantidad}</p>
                        <p className="subtotal">Subtotal: ${subtotal.toFixed(2)}</p>
                      </div>
                    </article>
                  );
                })}
              </section>

              <div className="resumen-total">
                <p>Total unidades: {totalUnidades}</p>
                <p>Total: ${totalPrecio.toFixed(2)}</p>
              </div>

              <h2>Selecciona la entrega</h2>
              <div className="opciones-entrega">
                <label className="opcion-entrega-item">
                  <input
                    type="radio"
                    name="formaEntrega"
                    value="domicilio"
                    checked={opcionEntrega === "domicilio"}
                    onChange={() => setOpcionEntrega("domicilio")}
                    disabled={!direccionCliente}
                  />
                  <span className="opcion-entrega-texto">
                    <strong>Domicilio del cliente</strong>
                    <span className="detalle-entrega">
                      {direccionCliente || "No hay domicilio cargado"}
                    </span>
                  </span>
                </label>

                <label className="opcion-entrega-item">
                  <input
                    type="radio"
                    name="formaEntrega"
                    value="retiro"
                    checked={opcionEntrega === "retiro"}
                    onChange={() => setOpcionEntrega("retiro")}
                  />
                  <span className="opcion-entrega-texto">
                    <strong>Retiro en local</strong>
                    <span className="detalle-entrega">Podes retirarlo en nuestro local durante el horario comercial.</span>
                  </span>
                </label>
              </div>

              <div className="acciones-entrega">
                <button
                  type="button"
                  className="btn-medio-pago"
                  disabled={!opcionEntrega}
                  onClick={handleElegirMedioPago}
                >
                  Continuar
                </button>
              </div>
            </>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
