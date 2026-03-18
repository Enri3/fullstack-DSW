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

export async function updatePedidoEstado(
  idPedido: number,
  estadoPedido: string
): Promise<void> {
  try {
    const res = await fetch(`${API_URL}/${idPedido}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estadoPedido })
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
