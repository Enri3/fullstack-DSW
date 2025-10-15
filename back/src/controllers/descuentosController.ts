import { Request, Response } from "express";
import { getConnection } from "../database";

export const addDescuento = async (req: Request, res: Response): Promise<void> => {
  const { porcentaje, fechaDesde, fechaHasta, idsProductos } = req.body;

  if (!porcentaje || !fechaDesde || !fechaHasta || !idsProductos || idsProductos.length === 0) {
    res.status(400).json({ message: "Faltan campos o productos" });
    return;
  }

  try {
    const conn = await getConnection();

    const fechaDesdeSQL = new Date(fechaDesde).toISOString().slice(0, 10);
    const fechaHastaSQL = new Date(fechaHasta).toISOString().slice(0, 10);

    const [rows]: any[] = await conn.query(
      "SELECT idDesc FROM descuentos WHERE porcentaje = ? AND fechaDesde = ? AND fechaHasta = ?",
      [porcentaje, fechaDesdeSQL, fechaHastaSQL]
    );
    const existe = rows;

    if (existe && existe.length > 0) {
      const idDescExistente = existe[0].idDesc;

      for (const idProd of idsProductos) {
        const [yaAsociado]: any[] = await conn.query(
          "SELECT * FROM productos_descuentos WHERE idDesc = ? AND idProd = ?",
          [idDescExistente, idProd]
        );

        if (yaAsociado.length > 0) {
          res.status(400).json({
            message: `El producto (ID ${idProd}) ya tiene asignado ese mismo descuento.`,
          });
          return;
        }
      }

      for (const idProd of idsProductos) {
        await conn.query(
          "INSERT INTO productos_descuentos (idDesc, idProd) VALUES (?, ?)",
          [idDescExistente, idProd]
        );
      }

      res.json({
        message: "El descuento ya existía, pero fue asociado a nuevos productos.",
        idDesc: idDescExistente,
      });
      return;
    }

    // Si no existe, crear el descuento y asociarlo a los productos
    const result: any = await conn.query(
      "INSERT INTO descuentos (porcentaje, fechaDesde, fechaHasta) VALUES (?, ?, ?)",
      [porcentaje, fechaDesdeSQL, fechaHastaSQL]
    );
    const idDesc = result.insertId;

    for (const idProd of idsProductos) {
      await conn.query(
        "INSERT INTO productos_descuentos (idDesc, idProd) VALUES (?, ?)",
        [idDesc, idProd]
      );
    }

    res.json({ message: "Descuento creado y asociado correctamente ✅", idDesc });
  } catch (error: any) {
    console.error("Error en addDescuento:", error.message || error);
    res.status(500).json({ message: "Error al agregar el descuento", detalle: error.message });
  }
};

export const getAllProductos = async (req: Request, res: Response): Promise<void> => {
  try {
    const conn = await getConnection();
    const rows: any[] = await conn.query("SELECT * FROM productos");
    res.json(rows);
  } catch (error: any) {
    console.error("Error al obtener productos:", error.message || error);
    res.status(500).json({ message: "Error al obtener productos" });
  }
};