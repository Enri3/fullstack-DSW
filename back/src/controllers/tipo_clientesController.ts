import { Request, Response } from "express";
import { AppDataSource } from "../database";
import { TipoCliente } from "../../../entidades/tipo-cliente";

export const getNombreTipo = async (req: Request, res: Response): Promise<void> => {
  const { idTipoCli } = req.params;

  if (!idTipoCli) {
    res.status(400).json({ message: "Falta el idTipoCli" });
    return;
  }

  try {
    // Obtenemos el repositorio de la entidad TipoCliente
    const tipoClienteRepository = AppDataSource.getRepository(TipoCliente);

    // Buscamos el registro por ID
    const tipo = await tipoClienteRepository.findOne({
      where: { idTipoCli: Number(idTipoCli) },
    });

    // Si no existe el tipo de cliente, devolvemos 404
    if (!tipo) {
      res.status(404).json({ message: "Tipo de cliente no encontrado" });
      return;
    }

    // Respondemos igual que antes
    res.json({ nombreTipoCli: tipo.nombreTipo });
  } catch (error: any) {
    console.error("Error en getNombreTipoCliente:", error.message || error);
    res.status(500).json({
      message: "Error al obtener el tipo de cliente",
      detalle: error.message,
    });
  }
};