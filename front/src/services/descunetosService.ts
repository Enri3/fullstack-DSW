const API_URL = "http://localhost:4000/descuentos"; 
import type { Descuento, DescuentoConProductos as DescuentoP } from "../types/Descuento";

//Agregar un descuento
export const addDescuento = async (descuento: Descuento, idsProductos: number[]
) => {
  try {
    // Combinamos ambos en un solo cuerpo antes de enviar
    const body: DescuentoP = {
      ...descuento,
      idsProductos,
    };

    const res = await fetch(`${API_URL}/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Error al agregar descuento");
    }

    return data;
  } catch (error: any) {
    console.error("Error en addDescuento:", error);
    throw error;
  }
};

// Obtiene todos los productos disponibles (para asignar descuentos)
export const getAllProductos = async () => {
  try {
    const res = await fetch(`${API_URL}/getAllProd`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Error al obtener productos");
    }

    return data;
  } catch (error: any) {
    console.error("Error en getAllProductos:", error);
    throw error;
  }
};

export const getNewId = async () => {
  try {
    const res = await fetch(`${API_URL}/getNewId`, {
      method: "GET",
      headers: {"Content-Type": "application/json"},
    });

    const data = await res.json

    if (!res.ok) {
      throw new Error(data.message || "Error al obtener nuevo ID");
    }
  } catch (error: any) {
    console.error("Error en getNewId: ",error)
    throw error;
  }
}