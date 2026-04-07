import e, { Request, Response } from "express";
import { AppDataSource } from "../database";
import { Producto} from "../../../entidades/producto";
import { calcularPrecioFinalProducto } from "../services/preciosService";
import jwt from "jsonwebtoken";

const productoRepo = AppDataSource.getRepository(Producto);

function getIdTipoCliFromToken(req: Request): number | undefined {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return undefined;
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return undefined;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "clave_secreta_super_segura") as { tipo?: number | string };
    const tipo = Number(decoded?.tipo);
    return Number.isNaN(tipo) ? undefined : tipo;
  } catch {
    return undefined;
  }
}

async function mapProductoConPrecioFinal(producto: Producto, idTipoCli?: number) {
  const precio = await calcularPrecioFinalProducto(Number(producto.precioProd), producto.idProd, idTipoCli);

  return {
    ...producto,
    precioFinalProd: precio.precioFinalProd,
    porcentajeDescuentoProducto: precio.porcentajeDescuentoProducto,
    porcentajeDescuentoTipoCliente: precio.porcentajeDescuentoTipoCliente,
  };
}


export const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await productoRepo.find();
    const idTipoCli = getIdTipoCliFromToken(req);
    const productosConPrecioFinal = await Promise.all(result.map((p) => mapProductoConPrecioFinal(p, idTipoCli)));
    res.json(productosConPrecioFinal);
  } catch (error: any) {
    console.error("Error al obtener productos:", error.message || error);
    res.status(500).json({ error: "Error al obtener productos" });
  }
};

export const getAllenAlta = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await productoRepo.find();
    const productosEnAlta = result.filter((producto) => Number(producto.deleted ?? 0) === 0);
    const idTipoCli = getIdTipoCliFromToken(req);
    const productosConPrecioFinal = await Promise.all(productosEnAlta.map((p) => mapProductoConPrecioFinal(p, idTipoCli)));
    res.json(productosConPrecioFinal);
  } catch (error: any) {
    console.error("Error al obtener productos en alta:", error.message || error);
    res.status(500).json({ error: "Error al obtener productos en alta" });
  }
};

export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nombreProd, medida, precioProd, stock } = req.body;
    const file = req.file as Express.Multer.File | undefined;

    if (!nombreProd || !precioProd || !stock) {
      res.status(400).json({ error: "Faltan campos obligatorios" });
      return;
    }

    const precioNum = parseFloat(precioProd);
    if (isNaN(precioNum)) {
      res.status(400).json({ error: "El precio debe ser un número" });
      return;
    }

    const stockNum = parseInt(stock, 10);
    if (isNaN(stockNum) || stockNum < 0) {
      res.status(400).json({ error: "El stock debe ser un número entero no negativo" });
      return;
    }

    const nuevoProducto = productoRepo.create({
      nombreProd,
      medida: medida || null,
      precioProd: precioNum,
      urlImg: file ? `/fotosProductos/${file.filename}` : "",
      deleted: 0,
      stock: stockNum
    });

    await productoRepo.save(nuevoProducto);

    res.status(201).json(nuevoProducto);
  } catch (error: any) {
    console.error("Error al agregar producto:", error.message || error);
    res.status(500).json({ error: "Error al agregar producto" });
  }
};

export const getById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { idProd } = req.params;
    const producto = await productoRepo.findOne({ where: { idProd: Number(idProd) } });

    if (!producto) {
      res.status(404).json({ error: "Producto no encontrado" });
      return;
    }

    const idTipoCli = getIdTipoCliFromToken(req);
    const productoConPrecioFinal = await mapProductoConPrecioFinal(producto, idTipoCli);

    res.json(productoConPrecioFinal);
  } catch (error: any) {
    console.error("Error al obtener producto por ID:", error.message || error);
    res.status(500).json({ error: "Error al obtener producto" });
  }
};


export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const { idProd } = req.params;
    const { nombreProd, medida, precioProd, stock } = req.body;
    const file = req.file as Express.Multer.File | undefined;

    if (!nombreProd || !precioProd || !stock) {
      res.status(400).json({ error: "Faltan campos obligatorios" });
      return;
    }

    const precioNum = parseFloat(precioProd);
    if (isNaN(precioNum)) {
      res.status(400).json({ error: "El precio debe ser un número válido" });
      return;
    }
    const stockNum = parseInt(stock, 10);
    if (isNaN(stockNum) || stockNum < 0) {
      res.status(400).json({ error: "El stock debe ser un número entero no negativo" });
      return;
    }

    const producto = await productoRepo.findOne({ where: { idProd: Number(idProd) } });
    if (!producto) {
      res.status(404).json({ error: "Producto no encontrado" });
      return;
    }

    producto.nombreProd = nombreProd;
    producto.medida = medida;
    producto.precioProd = precioNum;
    producto.stock = stockNum;

    if (file) {
      producto.urlImg = `/fotosProductos/${file.filename}`;
    }

    await productoRepo.save(producto);

    res.json({ message: "Producto actualizado correctamente" });
  } catch (error: any) {
    console.error("Error al actualizar producto:", error.message || error);
    res.status(500).json({ error: "Error al actualizar producto" });
  }
};


export const deleteProd = async (req: Request, res: Response): Promise<void> => {
  try {
    const { idProd } = req.params;
    const producto = await productoRepo.findOne({ where: { idProd: Number(idProd) } });

    if (!producto) {
      res.status(404).json({ error: "Producto no encontrado" });
      return;
    }

    producto.deleted = 1;
    await productoRepo.save(producto);

    res.json({ message: "Producto eliminado correctamente" });
  } catch (error: any) {
    console.error("Error al eliminar producto:", error.message || error);
    res.status(500).json({ error: "Error al eliminar producto" });
  }
};

export const darDeAlta = async (req: Request, res: Response): Promise<void> => {
  try {
    const { idProd } = req.params;
    const producto = await productoRepo.findOne({ where: { idProd: Number(idProd) } });

    if (!producto) {
      res.status(404).json({ error: "Producto no encontrado" });
      return;
    }

    producto.deleted = 0;
    await productoRepo.save(producto);

    res.json({ message: "Producto dado de alta correctamente" });
  } catch (error: any) {
    console.error("Error al dar de alta producto:", error.message || error);
    res.status(500).json({ error: "Error al dar de alta producto" });
  }
};

export const buscarProducto = async (req: Request, res: Response): Promise<void> => {
  const { nombreProdBuscado, admin } = req.body;

  try {
    let productos;

    
    if (!nombreProdBuscado || nombreProdBuscado.trim() === "") {

      productos = admin
        ? await productoRepo.find() 
        : await productoRepo.find({ where: { deleted: 0 } });

    } else {

      let query = productoRepo
        .createQueryBuilder("producto")
        .where("producto.nombreProd LIKE :nombre", {
          nombre: `%${nombreProdBuscado}%`,
        });

      
      if (!admin) {
        query = query.andWhere("producto.deleted = 0");
      }

      productos = await query.getMany();
    }

    const tipoCli = getIdTipoCliFromToken(req);
    const productosConPrecioFinal = await Promise.all(productos.map((p: Producto) => mapProductoConPrecioFinal(p, tipoCli)));

    res.json(productosConPrecioFinal);

  } catch (error: any) {
    console.error("Error al buscar productos:", error.message || error);
    res.status(500).json({ message: "Error interno del servidor al buscar." });
  }
};