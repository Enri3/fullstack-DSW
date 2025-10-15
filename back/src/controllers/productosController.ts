import { Request, Response } from "express";
import { getConnection } from "../database";

export const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const connection = await getConnection();
    const result = await connection.query("SELECT * FROM productos");
    console.log("Resultado DB:", result);
    res.json(result);
  } catch (error: any) {
    console.error("Error al obtener productos:", error.message || error);
    res.status(500).json({ error: "Error al obtener productos" });
  }
};

export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nombreProd, medida, precioProd, urlImg } = req.body;

    if (!nombreProd || !precioProd) {
      res.status(400).json({ error: "Faltan campos obligatorios" });
      return;
    }

    const precioNum = parseFloat(precioProd);
    if (isNaN(precioNum)) {
      res.status(400).json({ error: "El precio debe ser un número" });
      return;
    }

    const connection = await getConnection();
    const query = "INSERT INTO productos (nombreProd, medida, precioProd, urlImg) VALUES (?, ?, ?, ?)";
    const result: any = await connection.query(query, [nombreProd, medida || null, precioNum, urlImg || null]);

    res.status(201).json({ idProd: result.insertId, nombreProd, medida, precioProd: precioNum, urlImg });
  } catch (error: any) {
    console.error("Error al agregar producto:", error.message || error);
    res.status(500).json({ error: "Error al agregar producto" });
  }
};

export const getById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { idProd } = req.params;
    const connection = await getConnection();

    const rows: any[] = await connection.query("SELECT * FROM productos WHERE idProd = ?", [idProd]);

    if (rows.length === 0) {
      res.status(404).json({ error: "Producto no encontrado" });
      return;
    }

    res.json(rows[0]);
  } catch (error: any) {
    console.error("Error al obtener producto por ID:", error.message || error);
    res.status(500).json({ error: "Error al obtener producto" });
  }
};

export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const { idProd } = req.params;
    const { nombreProd, medida, precioProd, urlImg } = req.body;

    if (!nombreProd || !precioProd) {
      res.status(400).json({ error: "Faltan campos obligatorios" });
      return;
    }

    const precioNum = parseFloat(precioProd);
    if (isNaN(precioNum)) {
      res.status(400).json({ error: "El precio debe ser un número válido" });
      return;
    }

    const connection = await getConnection();
    const result: any = await connection.query(
      "UPDATE productos SET nombreProd = ?, medida = ?, precioProd = ?, urlImg = ? WHERE idProd = ?",
      [nombreProd, medida || null, precioNum, urlImg || null, idProd]
    );

    if (result.affectedRows === 0) {
      res.status(404).json({ error: "Producto no encontrado" });
      return;
    }

    res.json({ message: "Producto actualizado correctamente" });
  } catch (error: any) {
    console.error("Error al actualizar producto:", error.message || error);
    res.status(500).json({ error: "Error al actualizar producto" });
  }
};

export const deleteProd = async (req: Request, res: Response): Promise<void> => {
  try {
    const { idProd } = req.params;
    const connection = await getConnection();

    const result: any = await connection.query("DELETE FROM productos WHERE idProd = ?", [idProd]);

    if (result.affectedRows === 0) {
      res.status(404).json({ error: "Producto no encontrado" });
      return;
    }

    res.json({ message: "Producto eliminado correctamente" });
  } catch (error: any) {
    console.error("Error al eliminar producto:", error.message || error);
    res.status(500).json({ error: "Error al eliminar producto" });
  }
};

export const buscarProducto = async (req: Request, res: Response): Promise<void> => {
  const { nombreProdBuscado } = req.body;

  try {
    const conn = await getConnection();
    let rows: any[];

    if (!nombreProdBuscado || nombreProdBuscado.trim() === "") {
      rows = await conn.query("SELECT * FROM productos WHERE deleted = 0;");
    } else {
      rows = await conn.query(
        `SELECT *
         FROM productos
         WHERE nombreProd LIKE CONCAT('%', ?, '%')
         AND deleted = 0;`,
        [nombreProdBuscado]
      );
    }

    res.json(rows);
  } catch (error: any) {
    console.error("Error al ejecutar la consulta SQL:", error.message || error);
    res.status(500).json({ message: "Error interno del servidor al buscar." });
  }
};