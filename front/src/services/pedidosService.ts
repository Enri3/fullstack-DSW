import type { Pedido } from "../types/Pedido";
import type { PedidoProducto } from "../types/PedidoProducto";

const API_URL = "http://localhost:4000/pedidos";

type PedidoProductoPayload = Pick<PedidoProducto, "idProd" | "cantidadProdPed">;

export async function getPedidos(): Promise<Pedido[]> {
  try {
    const res = await fetch(`${API_URL}`);
    if (!res.ok) throw new Error("Error al obtener pedidos");
    const data = await res.json();
    return data as Pedido[];
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getPedidosByIdCliente(idCli: number): Promise<Pedido[]> {
  try {
    const res = await fetch(`${API_URL}/cliente/${idCli}`);
    if (!res.ok) throw new Error("Error al obtener pedidos del cliente");
    const data = await res.json();
    return data as Pedido[];
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getPedidoEnCarritoByCliente(idCli: number): Promise<Pedido | null> {
  try {
    const res = await fetch(`${API_URL}/cliente/${idCli}/enCarrito`);
    if (res.status === 404) return null;
    if (!res.ok) throw new Error("Error al obtener pedido en carrito del cliente");
    const data = await res.json();
    return data as Pedido;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getPedidoById(idPedido: number): Promise<Pedido> {
  try {
    const res = await fetch(`${API_URL}/${idPedido}`);
    if (!res.ok) throw new Error("Error al obtener pedido");
    const data = await res.json();
    return data as Pedido;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function createPedido(
  idCli: number,
  estadoPedido: string,
  productos: PedidoProductoPayload[]
): Promise<Pedido> {
  try {
    const res = await fetch(`${API_URL}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        idCli,
        estadoPedido,
        productos
      })
    });
    if (!res.ok) throw new Error("Error al crear pedido");
    const data = await res.json();
    return data.pedido as Pedido;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function agregarProductoEnCarrito(
  idCli: number,
  idProd: number,
  cantidadProdPed = 1
): Promise<Pedido> {
  return createPedido(idCli, "enCarrito", [{ idProd, cantidadProdPed }]);
}

export async function actualizarCantidadProductoEnPedido(
  idPedido: number,
  idProd: number,
  cantidadProdPed: number
): Promise<void> {
  try {
    const res = await fetch(`${API_URL}/${idPedido}/productos/${idProd}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cantidadProdPed })
    });

    if (!res.ok) throw new Error("Error al actualizar cantidad del producto en pedido");
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function updatePedidoEstado(
  idPedido: number,
  estadoPedido: string,
  metadata?: {
    formaEntrega?: string;
    medioPago?: string;
    montoTotal?: number;
    montoPagado?: number;
    vuelto?: number;
  }
): Promise<void> {
  try {
    const res = await fetch(`${API_URL}/${idPedido}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        estadoPedido,
        ...metadata
      })
    });
    if (!res.ok) throw new Error("Error al actualizar pedido");
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function deletePedido(idPedido: number): Promise<void> {
  try {
    const res = await fetch(`${API_URL}/${idPedido}`, {
      method: "DELETE"
    });
    if (!res.ok) throw new Error("Error al eliminar pedido");
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function reiniciarPedidoEnCarrito(idCli: number): Promise<void> {
  const pedidoEnCarrito = await getPedidoEnCarritoByCliente(idCli);
  if (!pedidoEnCarrito) return;
  await deletePedido(pedidoEnCarrito.idPedido);
}

export async function hidratarCarritoDesdePedidoEnCarrito(idCli: number): Promise<void> {
  const pedidoEnCarrito = await getPedidoEnCarritoByCliente(idCli);

  if (!pedidoEnCarrito || !pedidoEnCarrito.pedidoProductos || pedidoEnCarrito.pedidoProductos.length === 0) {
    localStorage.removeItem("productos");
    return;
  }

  const productos = pedidoEnCarrito.pedidoProductos
    .filter((pp) => pp.producto)
    .map((pp) => ({
      idProd: pp.idProd,
      nombreProd: pp.producto!.nombreProd,
      precioProd: pp.producto!.precioProd,
      urlImg: pp.producto!.urlImg,
      medida: pp.producto!.medida,
      cantidad: pp.cantidadProdPed,
    }));

  if (productos.length === 0) {
    localStorage.removeItem("productos");
    return;
  }

  localStorage.setItem("productos", JSON.stringify(productos));
}
