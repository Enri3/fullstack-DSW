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

export const getEnCarritoByIdCliente = async (req: Request, res: Response): Promise<void> => {
  try {
    const { idCli } = req.params;

    const pedido = await pedidoRepo.findOne({
      where: {
        idCli: Number(idCli),
        estadoPedido: "enCarrito"
      },
      relations: ["cliente", "pedidoProductos", "pedidoProductos.producto"]
    });

    if (!pedido) {
      res.status(404).json({ error: "No hay pedido en carrito para este cliente" });
      return;
    }

    res.json(pedido);
  } catch (error: any) {
    console.error("Error al obtener pedido en carrito del cliente:", error.message || error);
    res.status(500).json({ error: "Error al obtener pedido en carrito" });
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

    if (!idCli || !estadoPedido || !productos || !Array.isArray(productos) || productos.length === 0) {
      res.status(400).json({ error: "Faltan campos obligatorios o el formato de productos es incorrecto" });
      return;
    }

    let pedidoGuardado: Pedido;

    if (estadoPedido === "enCarrito") {
      const pedidoExistente = await pedidoRepo.findOne({
        where: { idCli: Number(idCli), estadoPedido: "enCarrito" }
      });

      if (pedidoExistente) {
        pedidoGuardado = pedidoExistente;
      } else {
        const nuevoPedido = pedidoRepo.create({
          idCli,
          estadoPedido: "enCarrito",
          fechaPedido: new Date()
        });
        pedidoGuardado = await pedidoRepo.save(nuevoPedido);
      }
    } else {
      const nuevoPedido = pedidoRepo.create({
        idCli,
        estadoPedido,
        fechaPedido: new Date()
      });
      pedidoGuardado = await pedidoRepo.save(nuevoPedido);
    }

    for (const producto of productos) {
      if (!producto.idProd || !producto.cantidadProdPed) {
        res.status(400).json({ error: "Cada producto debe tener idProd y cantidadProdPed" });
        return;
      }

      const cantidad = Number(producto.cantidadProdPed);
      if (Number.isNaN(cantidad) || cantidad <= 0) {
        res.status(400).json({ error: "cantidadProdPed debe ser mayor a 0" });
        return;
      }

      const productoExistente = await pedidoProductoRepo.findOne({
        where: {
          idPedido: pedidoGuardado.idPedido,
          idProd: Number(producto.idProd)
        }
      });

      if (productoExistente) {
        productoExistente.cantidadProdPed += cantidad;
        await pedidoProductoRepo.save(productoExistente);
      } else {
        const pedidoProducto = pedidoProductoRepo.create({
          idPedido: pedidoGuardado.idPedido,
          idProd: Number(producto.idProd),
          cantidadProdPed: cantidad
        });

        await pedidoProductoRepo.save(pedidoProducto);
      }
    }

    res.status(201).json({
      message: estadoPedido === "enCarrito"
        ? "Producto agregado al pedido en carrito"
        : "Pedido creado correctamente",
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

export const updateProductoCantidad = async (req: Request, res: Response): Promise<void> => {
  try {
    const { idPedido, idProd } = req.params;
    const { cantidadProdPed } = req.body;

    const pedido = await pedidoRepo.findOne({
      where: { idPedido: Number(idPedido) }
    });

    if (!pedido) {
      res.status(404).json({ error: "Pedido no encontrado" });
      return;
    }

    if (pedido.estadoPedido !== "enCarrito") {
      res.status(400).json({ error: "Solo se pueden modificar productos de pedidos en carrito" });
      return;
    }

    const cantidad = Number(cantidadProdPed);
    if (Number.isNaN(cantidad) || cantidad < 0) {
      res.status(400).json({ error: "cantidadProdPed debe ser un numero mayor o igual a 0" });
      return;
    }

    const idPedidoNum = Number(idPedido);
    const idProdNum = Number(idProd);

    const pedidoProductoExistente = await pedidoProductoRepo.findOne({
      where: {
        idPedido: idPedidoNum,
        idProd: idProdNum
      }
    });

    if (cantidad === 0) {
      if (pedidoProductoExistente) {
        await pedidoProductoRepo.remove(pedidoProductoExistente);
      }
    } else if (pedidoProductoExistente) {
      pedidoProductoExistente.cantidadProdPed = cantidad;
      await pedidoProductoRepo.save(pedidoProductoExistente);
    } else {
      const nuevoPedidoProducto = pedidoProductoRepo.create({
        idPedido: idPedidoNum,
        idProd: idProdNum,
        cantidadProdPed: cantidad
      });
      await pedidoProductoRepo.save(nuevoPedidoProducto);
    }

    const cantidadItems = await pedidoProductoRepo.count({
      where: { idPedido: idPedidoNum }
    });

    if (cantidadItems === 0) {
      await pedidoRepo.remove(pedido);
      res.json({
        message: "Producto actualizado y pedido eliminado por quedar vacio",
        pedidoEliminado: true
      });
      return;
    }

    res.json({
      message: "Cantidad del producto actualizada correctamente",
      pedidoEliminado: false
    });
  } catch (error: any) {
    console.error("Error al actualizar cantidad del producto en pedido:", error.message || error);
    res.status(500).json({ error: "Error al actualizar cantidad del producto" });
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
