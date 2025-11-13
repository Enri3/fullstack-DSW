const API_URL = "http://localhost:4000/descuentos"; 
import type { Descuento, DescuentoConProductos as DescuentoP } from "../types/Descuentos";

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

export const buscarDescuentoFiltro = async (nomProdBuscados: string) => {
  try {
    const res = await fetch(`${API_URL}/buscPorProd`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nomProdBuscados }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Error al buscar descuento desde el service");
    }

    return data;
  } catch (error) {
    console.error("Error al buscar descuento:", error);
    throw error;
  }
};
export const buscarPorProd = async (nomProdBuscados : string) => {
  try {
    const res = await fetch(`${API_URL}/buscDescFilt`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nomProdBuscados }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Error al buscar descuento desde el service");
    }

    return data;
  } catch (error) {
    console.error("Error al buscar descuento:", error);
    throw error;
  }
}

export const eliminarDescuentos = async (idsDescuentos: number[]) => {
  if (!Array.isArray(idsDescuentos) || idsDescuentos.length === 0) {
    throw new Error("Debe proporcionar al menos un ID de descuento para eliminar");
  }

  try {
    const response = await fetch(`${API_URL}/delete`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idsDescuentos }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al eliminar descuentos");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en eliminarDescuentosService:", error);
    throw error;
  }
};