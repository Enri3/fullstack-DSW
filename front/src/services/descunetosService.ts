const API_URL = "http://localhost:4000/descuentos"; 

export const addDescuento = async (descuento: { porcentaje: number; idProd: number }) => {
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

export const getAllDescuentosConProductos = async () => {
  try {
    const res = await fetch(`${API_URL}/getAllConProductos`);
    if (!res.ok) throw new Error("Error al obtener descuentos con sus productos");
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const deleteMultipleDescuentos = async (ids: number[]) => {
  try {
    const res = await fetch(`${API_URL}/eliminar-multiple`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Error al eliminar descuentos");
    }

    return data;
  } catch (error: any) {
    console.error("Error en deleteMultipleDescuentos:", error);
    throw error;
  }
};