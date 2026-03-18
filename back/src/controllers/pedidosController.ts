import { Request, Response } from "express";
import { AppDataSource } from "../database";
import { Pedido } from "../../../entidades/pedido";
import { PedidoProducto } from "../../../entidades/pedido_productos";

const pedidoRepo = AppDataSource.getRepository(Pedido);
const pedidoProductoRepo = AppDataSource.getRepository(PedidoProducto);

export const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const resultado = await pedidoRepo.find({
      relations: ["cliente", "pedidoProductos", "pedidoProductos.producto"]
    });
    res.json(resultado);
  } catch (error: any) {
    console.error("Error al obtener pedidos:", error.message || error);
    res.status(500).json({ error: "Error al obtener pedidos" });
  }
};

export const getByIdCliente = async (req: Request, res: Response): Promise<void> => {
  try {
    const { idCli } = req.params;
    const resultado = await pedidoRepo.find({
      where: { idCli: Number(idCli) },
      relations: ["cliente", "pedidoProductos", "pedidoProductos.producto"]
    });

    if (resultado.length === 0) {
      res.status(404).json({ error: "No hay pedidos para este cliente" });
      return;
    }

    res.json(resultado);
  } catch (error: any) {
    console.error("Error al obtener pedidos del cliente:", error.message || error);
    res.status(500).json({ error: "Error al obtener pedidos del cliente" });
  }
};

export const getById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { idPedido } = req.params;
    const pedido = await pedidoRepo.findOne({
      where: { idPedido: Number(idPedido) },
      relations: ["cliente", "pedidoProductos", "pedidoProductos.producto"]
    });

    if (!pedido) {
      res.status(404).json({ error: "Pedido no encontrado" });
      return;
    }

    res.json(pedido);
  } catch (error: any) {
    console.error("Error al obtener pedido por ID:", error.message || error);
    res.status(500).json({ error: "Error al obtener pedido" });
  }
};

export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const { idCli, estadoPedido, productos } = req.body;

    if (!idCli || !estadoPedido || !productos || !Array.isArray(productos)) {
      res.status(400).json({ error: "Faltan campos obligatorios o el formato de productos es incorrecto" });
      return;
    }

    // Crear nuevo pedido
    const nuevoPedido = pedidoRepo.create({
      idCli,
      estadoPedido,
      fechaPedido: new Date()
    });

    const pedidoGuardado = await pedidoRepo.save(nuevoPedido);

    // Agregar los productos al pedido
    for (const producto of productos) {
      if (!producto.idProd || !producto.cantidadProdPed) {
        res.status(400).json({ error: "Cada producto debe tener idProd y cantidadProdPed" });
        return;
      }

      const pedidoProducto = pedidoProductoRepo.create({
        idPedido: pedidoGuardado.idPedido,
        idProd: producto.idProd,
        cantidadProdPed: producto.cantidadProdPed
      });

      await pedidoProductoRepo.save(pedidoProducto);
    }

    res.status(201).json({
      message: "Pedido creado correctamente",
      pedido: pedidoGuardado
    });
  } catch (error: any) {
    console.error("Error al crear pedido:", error.message || error);
    res.status(500).json({ error: "Error al crear pedido" });
  }
};

export const updateEstado = async (req: Request, res: Response): Promise<void> => {
  try {
    const { idPedido } = req.params;
    const { estadoPedido } = req.body;

    if (!estadoPedido) {
      res.status(400).json({ error: "El estado del pedido es requerido" });
      return;
    }

    const pedido = await pedidoRepo.findOne({ where: { idPedido: Number(idPedido) } });

    if (!pedido) {
      res.status(404).json({ error: "Pedido no encontrado" });
      return;
    }

    pedidoRepo.merge(pedido, { estadoPedido });
    await pedidoRepo.save(pedido);

    res.json({ message: "Pedido actualizado correctamente" });
  } catch (error: any) {
    console.error("Error al actualizar pedido:", error.message || error);
    res.status(500).json({ error: "Error al actualizar pedido" });
  }
};

export const deletePedido = async (req: Request, res: Response): Promise<void> => {
  try {
    const { idPedido } = req.params;

    const pedido = await pedidoRepo.findOne({ where: { idPedido: Number(idPedido) } });

    if (!pedido) {
      res.status(404).json({ error: "Pedido no encontrado" });
      return;
    }

    await pedidoRepo.remove(pedido);

    res.json({ message: "Pedido eliminado correctamente" });
  } catch (error: any) {
    console.error("Error al eliminar pedido:", error.message || error);
    res.status(500).json({ error: "Error al eliminar pedido" });
  }
};
