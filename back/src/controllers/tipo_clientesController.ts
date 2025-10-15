import { Request, Response } from "express";
import { getConnection } from "../database";

export const getNombreTipo = async (req: Request, res: Response): Promise<void> => {
  const { idTipoCli } = req.params;

  if (!idTipoCli) {
    res.status(400).json({ message: "Falta el idTipoCli" });
    return;
  }

  try {
    const conn = await getConnection();

   
    const rows: any[] = await conn.query(
      "SELECT nombreTipo FROM tipo_clientes WHERE idTipoCli = ?",
      [idTipoCli]
    );

    if (rows.length === 0) {
      res.status(404).json({ message: "Tipo de cliente no encontrado" });
      return;
    }

    res.json({ nombreTipoCli: rows[0].nombreTipo });
  } catch (error: any) {
    console.error("Error en getNombreTipoCliente:", error.message || error);
    res.status(500).json({ message: "Error al obtener el tipo de cliente", detalle: error.message });
  }
};