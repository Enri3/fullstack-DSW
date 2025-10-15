const API_URL = "http://localhost:4000/descuentos"; 
import type {Descuento , DescuentoConProductos as DescuentoP } from "../../../entidades/descuento";

//Agregar un descuento
export const addDescuento = async (descuento: DescuentoP) => {
  try {
    const res = await fetch(`${API_URL}/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(descuento),
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
