import { Request, Response } from "express";
import { AppDataSource } from "../database";
import { TipoCliente } from "../entidades/tipo-cliente";

const tipoClienteRepository = AppDataSource.getRepository(TipoCliente);

export const getTiposClientes = async (_req: Request, res: Response): Promise<void> => {
  try {
    const tipos = await tipoClienteRepository.find({
      select: ["idTipoCli", "nombreTipo"],
      order: { idTipoCli: "ASC" },
    });

    res.json(tipos);
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : String(error);
    console.error("Error en getTiposClientes:", mensaje);
    res.status(500).json({
      message: "Error al obtener los tipos de cliente",
      detalle: mensaje,
    });
  }
};

export const getNombreTipo = async (req: Request, res: Response): Promise<void> => {
  const { idTipoCli } = req.params;

  if (!idTipoCli) {
    res.status(400).json({ message: "Falta el idTipoCli" });
    return;
  }

  try {
    const tipo = await tipoClienteRepository.findOne({
      where: { idTipoCli: Number(idTipoCli) },
    });

    if (!tipo) {
      res.status(404).json({ message: "Tipo de cliente no encontrado" });
      return;
    }

    res.json({ nombreTipoCli: tipo.nombreTipo });
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : String(error);
    console.error("Error en getNombreTipoCliente:", mensaje);
    res.status(500).json({
      message: "Error al obtener el tipo de cliente",
      detalle: mensaje,
    });
  }
};