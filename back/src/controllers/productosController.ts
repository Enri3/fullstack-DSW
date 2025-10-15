import { Request, Response } from "express";
import { AppDataSource } from "../database";
import { Producto} from "../../../entidades/producto";

const productoRepo = AppDataSource.getRepository(Producto);



export const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await productoRepo.find();
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

    const nuevoProducto = productoRepo.create({
      nombreProd,
      medida: medida || null,
      precioProd: precioNum,
      urlImg: urlImg || null,
      deleted: 0
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

    res.json(producto);
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

    const producto = await productoRepo.findOne({ where: { idProd: Number(idProd) } });
    if (!producto) {
      res.status(404).json({ error: "Producto no encontrado" });
      return;
    }

    productoRepo.merge(producto, { nombreProd, medida, precioProd: precioNum, urlImg });
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

export const buscarProducto = async (req: Request, res: Response): Promise<void> => {
  const { nombreProdBuscado } = req.body;

  try {
    let productos;
    if (!nombreProdBuscado || nombreProdBuscado.trim() === "") {
      productos = await productoRepo.find({ where: { deleted: 0 } });
    } else {
      productos = await productoRepo
        .createQueryBuilder("producto")
        .where("producto.deleted = 0")
        .andWhere("producto.nombreProd LIKE :nombre", { nombre: `%${nombreProdBuscado}%` })
        .getMany();
    }

    res.json(productos);
  } catch (error: any) {
    console.error("Error al buscar productos:", error.message || error);
    res.status(500).json({ message: "Error interno del servidor al buscar." });
  }
};