import { Request, Response } from "express";
import { AppDataSource } from "../database";
import { Pedido } from "../../../entidades/pedido";
import { PedidoProducto } from "../../../entidades/pedido_productos";
import { Preference, Payment } from "mercadopago";
import client from "../config/mercadopago";
import { calcularPrecioFinalProductoConFecha } from "../services/preciosService";

const pedidoRepo = AppDataSource.getRepository(Pedido);
const pedidoProductoRepo = AppDataSource.getRepository(PedidoProducto);

const mapPedidoProductoConPrecioHistorico = async (pp: any, idTipoCli: number, fechaReferencia: Date | string) => {
  if (!pp.producto) {
    return pp;
  }

  const precio = await calcularPrecioFinalProductoConFecha(
    Number(pp.producto.precioProd),
    pp.producto.idProd,
    idTipoCli,
    fechaReferencia
  );

  return {
    ...pp,
    producto: {
      ...pp.producto,
      precioFinalProd: precio.precioFinalProd,
      porcentajeDescuentoProducto: precio.porcentajeDescuentoProducto,
      porcentajeDescuentoTipoCliente: precio.porcentajeDescuentoTipoCliente,
    },
  };
};

const mapPedidoProductoToMpItem = async (pp: any, idTipoCli: number) => {
  const producto = pp.producto;

  if (!producto) {
    throw new Error("Producto no cargado en la relación");
  }

  const precioCalculado = await calcularPrecioFinalProductoConFecha(
    Number(producto.precioProd),
    producto.idProd,
    idTipoCli,
    new Date()
  );
  const precio = Number(precioCalculado.precioFinalProd);
  const cantidad = Number(pp.cantidadProdPed);

  if (!producto.nombreProd) {
    throw new Error(`Producto sin nombre (id ${producto.idProd})`);
  }

  if (isNaN(precio)) {
    throw new Error(`Precio inválido para producto ${producto.nombreProd}`);
  }

  if (isNaN(cantidad)) {
    throw new Error(`Cantidad inválida para producto ${producto.nombreProd}`);
  }

  return {
    id: producto.idProd.toString(),
    title: producto.nombreProd,
    quantity: cantidad,
    unit_price: precio,
  };
};

export const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const resultado = await pedidoRepo.find({
      relations: ["cliente", "pedidoProductos", "pedidoProductos.producto"],
      order: { fechaPedido: "DESC" }
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
      relations: ["cliente", "pedidoProductos", "pedidoProductos.producto"],
      order: { fechaPedido: "DESC" }
    });

    if (resultado.length === 0) {
      res.status(404).json({ error: "No hay pedidos para este cliente" });
      return;
    }

    const pedidosConPrecio = await Promise.all(
      resultado.map(async (pedido) => {
        const idTipoCli = Number(pedido.cliente?.idTipoCli ?? 0);
        const pedidoProductos = await Promise.all(
          pedido.pedidoProductos.map((pp) => mapPedidoProductoConPrecioHistorico(pp, idTipoCli, pedido.fechaPedido))
        );

        return {
          ...pedido,
          pedidoProductos,
        };
      })
    );

    res.json(pedidosConPrecio);
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

    const idTipoCli = Number(pedido.cliente?.idTipoCli ?? 0);
    const fechaPedido = pedido.fechaPedido;
    const pedidoProductosConPrecio = await Promise.all(
      pedido.pedidoProductos.map((pp) => mapPedidoProductoConPrecioHistorico(pp, idTipoCli, fechaPedido))
    );

    res.json({
      ...pedido,
      pedidoProductos: pedidoProductosConPrecio,
    });
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

    const idTipoCli = Number(pedido.cliente?.idTipoCli ?? 0);
    const pedidoProductos = await Promise.all(
      pedido.pedidoProductos.map((pp) => mapPedidoProductoConPrecioHistorico(pp, idTipoCli, pedido.fechaPedido))
    );

    res.json({
      ...pedido,
      pedidoProductos,
    });
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
    const { estadoPedido, formaEntrega, medioPago, montoTotal, montoPagado, vuelto } = req.body;

    if (!estadoPedido) {
      res.status(400).json({ error: "El estado del pedido es requerido" });
      return;
    }

    const pedido = await pedidoRepo.findOne({ where: { idPedido: Number(idPedido) } });

    if (!pedido) {
      res.status(404).json({ error: "Pedido no encontrado" });
      return;
    }

    const dataToMerge: Partial<Pedido> = { estadoPedido };

    if (typeof formaEntrega === "string") {
      dataToMerge.formaEntrega = formaEntrega;
    }

    if (typeof medioPago === "string") {
      dataToMerge.medioPago = medioPago;
    }

    if (montoTotal !== undefined && montoTotal !== null) {
      const total = Number(montoTotal);
      if (!Number.isNaN(total)) {
        dataToMerge.montoTotal = total;
      }
    }

    if (montoPagado !== undefined && montoPagado !== null) {
      const pagado = Number(montoPagado);
      if (!Number.isNaN(pagado)) {
        dataToMerge.montoPagado = pagado;
      }
    }

    if (vuelto !== undefined && vuelto !== null) {
      const vueltoNumero = Number(vuelto);
      if (!Number.isNaN(vueltoNumero)) {
        dataToMerge.vuelto = vueltoNumero;
      }
    }

    pedidoRepo.merge(pedido, dataToMerge);
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

export const crearPreferencia = async (req: Request, res: Response): Promise<void> => {
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


    const idTipoCli = Number(pedido.cliente?.idTipoCli ?? 0);
    const fechaPedido = pedido.fechaPedido;

    const items = await Promise.all(
      pedido.pedidoProductos.map((pp: any) => mapPedidoProductoToMpItem(pp, idTipoCli))
    );


    const preference = new Preference(client);
   
    const response = await preference.create({
      body: {
        items,
        external_reference: pedido.idPedido.toString(),
        back_urls: {
          //las urls hay que escribirlas como dice el ngrok en el puerto de FRONT
          success: "https://barb-illtempered-nakia.ngrok-free.dev/exito",
          failure: "https://barb-illtempered-nakia.ngrok-free.dev/fracaso",
          pending: "https://barb-illtempered-nakia.ngrok-free.dev/pendiente",
        },
        //auto_return NO va cuando estoy trabajando en prueba
        auto_return: "approved",
        //la url hay que escribirlas como dice el ngrok en el puerto de BACK
        notification_url: "https://barb-illtempered-nakia.ngrok-free.dev/pedidos/webhook",
      }
    });

    res.json({
      id: response.id
    });

  } catch (error: any) {
    console.error("ERROR COMPLETO:", error);
    res.status(500).json({ error: error.message });
  }

  
};

export const recibirWebhookMP = async (req: Request, res: Response) => {
  try {
    const { type, data } = req.body;

    console.log("Webhook recibido:", req.body);

    if (type === "payment") {
      const paymentClient = new Payment(client);

      const payment = await paymentClient.get({
        id: data.id,
      });

      const estado = payment.status;
      const idPedido = payment.external_reference;

      console.log("Pedido:", idPedido, "Estado:", estado);

      if (!idPedido) {
        return res.sendStatus(200);
      }

     
      const pedido = await pedidoRepo.findOne({
        where: { idPedido: Number(idPedido) },
        relations: ["pedidoProductos", "pedidoProductos.producto"]
      });

      if (!pedido) {
        return res.sendStatus(200);
      }

      if (estado === "approved") {
        pedido.estadoPedido = "pagado";

        for (const pp of pedido.pedidoProductos) {
          const producto = pp.producto;

          if (!producto) continue;

          producto.stock = Number(producto.stock) - Number(pp.cantidadProdPed);

          if (producto.stock < 0) {
            producto.stock = 0; 
          }

          await AppDataSource.getRepository("Producto").save(producto);
        }
      }

      if (estado === "rejected" || estado === "cancelled") {
        pedido.estadoPedido = "cancelado";
      }

      await pedidoRepo.save(pedido);
    }

    res.sendStatus(200);
  } catch (error) {
    console.error("Error webhook:", error);
    res.sendStatus(500);
  }
};
