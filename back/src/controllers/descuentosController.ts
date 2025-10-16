import { Request, Response } from "express";
import { AppDataSource } from "../database"; // Tu DataSource
import { Descuento } from "../../../entidades/descuento";
import { ProductoDescuento } from "../../../entidades/productos_descuentos"
import { Producto } from "../../../entidades/producto";
import { In } from "typeorm"; // Necesario para buscar múltiples IDs

// Ejemplo simple de otro controlador con TypeORM
export const getAllProductos = async (req: Request, res: Response): Promise<void> => {
    try {
        const productoRepository = AppDataSource.getRepository(Producto);
        const productos = await productoRepository.find();
        res.json(productos);
    } catch (error: any) {
        console.error("Error al obtener productos:", error.message || error);
        res.status(500).json({ message: "Error al obtener productos" });
    }
};

export const addDescuento = async (req:Request, res:Response): Promise<void> => {
  try {
    // Frontend envía { porcentaje, fechaDesde, fechaHasta, idsProductos }
    const { porcentaje, fechaDesde, fechaHasta, idsProductos } = req.body;
    if (
      porcentaje === undefined ||
      !fechaDesde ||
      !fechaHasta ||
      !Array.isArray(idsProductos) ||
      idsProductos.length === 0
    ) {
      res.status(400).json({ message: "Datos inválidos para crear descuento" });
      return;
    }

    const descuentosRepository = AppDataSource.getRepository(Descuento);
    const productosDescuentoRepository = AppDataSource.getRepository(ProductoDescuento);

    // Buscar si ya existe un descuento con mismos valores
    let descuento = await descuentosRepository.findOne({
      where: {
        porcentaje: Number(porcentaje),
        fechaDesde: new Date(fechaDesde),
        fechaHasta: new Date(fechaHasta)
      }
    });

    if (!descuento) {
      descuento = descuentosRepository.create({
        porcentaje: Number(porcentaje),
        fechaDesde: new Date(fechaDesde),
        fechaHasta: new Date(fechaHasta)
      });
      descuento = await descuentosRepository.save(descuento);
    }

    const idDesc = descuento.idDesc as number;

    // Obtener relaciones existentes para evitar duplicados
    const existentes = await productosDescuentoRepository.find({
      where: { idDesc, idProd: In(idsProductos) }
    });
    const yaRelacionados = new Set(existentes.map(e => e.idProd));

    const nuevasRelaciones: ProductoDescuento[] = idsProductos
      .filter((id: number) => !yaRelacionados.has(id))
      .map((idProd: number) => {
        const r = new ProductoDescuento();
        r.idDesc = idDesc;
        r.idProd = idProd;
        return r;
      });

    if (nuevasRelaciones.length > 0) {
      await productosDescuentoRepository.save(nuevasRelaciones);
    }

    res.status(200).json({ message: "Descuento creado y asociado correctamente ✅", idDesc });
  } catch (error: any) {
    console.error("Error en addDescuento:", error.message || error);
    res.status(500).json({ message: "Error interno al agregar el descuento" });
  }
}

