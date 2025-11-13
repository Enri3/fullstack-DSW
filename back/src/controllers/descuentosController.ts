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

    // Normalizar fechas a 'YYYY-MM-DD' para evitar problemas de zona horaria
    const fdStr = new Date(fechaDesde).toISOString().slice(0, 10);
    const fhStr = new Date(fechaHasta).toISOString().slice(0, 10);

    // Buscar si ya existe un descuento con mismos valores (comparando por DATE exacta)
    const descuento = await descuentosRepository
      .createQueryBuilder("d")
      .where("d.porcentaje = :p", { p: Number(porcentaje) })
      .andWhere("d.fechaDesde = :fd", { fd: fdStr })
      .andWhere("d.fechaHasta = :fh", { fh: fhStr })
      .getOne();

    let idDesc: number;
    if (!descuento) {
      const nuevo = descuentosRepository.create({
        porcentaje: Number(porcentaje),
        // TypeORM permite strings 'YYYY-MM-DD' para columnas DATE en MySQL
        fechaDesde: fdStr as unknown as Date,
        fechaHasta: fhStr as unknown as Date,
      });
      const guardado = await descuentosRepository.save(nuevo);
      idDesc = guardado.idDesc as number;
    } else {
      idDesc = descuento.idDesc as number;
    }

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

export const buscarDescuentoFiltro = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nomProdBuscados } = req.body; // concuerda con lo que envía el front

    const productoDescuentoRepository = AppDataSource.getRepository(ProductoDescuento);

    // Base query: traemos la relación producto y descuento
    let qb = productoDescuentoRepository
      .createQueryBuilder("pd")
      .innerJoinAndSelect("pd.producto", "producto")
      .innerJoinAndSelect("pd.descuento", "descuento")
      .where("producto.deleted = 0");

    // Si hay filtro, aplicarlo (MySQL: usar LIKE; hacerlo case-insensitive con LOWER)
    if (nomProdBuscados && String(nomProdBuscados).trim() !== "") {
      const filtro = nomProdBuscados.trim().toLowerCase();
      qb = qb.andWhere("LOWER(producto.nombreProd) LIKE :filtro", { filtro: `%${filtro}%` });
    }

    // getMany devuelve entidades ProductoDescuento con producto y descuento cargados
    const resultados = await qb.getMany();

    // Mapear a la forma que espera el frontend
    const descuentosEncontrados = resultados.map((pd) => {
      const prod = pd.producto as Producto | undefined;
      const desc = pd.descuento as Descuento | undefined;

      return {
        idProd: prod?.idProd ?? null,
        nombreProd: prod?.nombreProd ?? "",
        idDesc: desc?.idDesc ?? null,
        porcentaje: desc ? Number(desc.porcentaje) : null,
        fechaDesde: desc?.fechaDesde ?? null,
        fechaHasta: desc?.fechaHasta ?? null,
      };
    });

    res.status(200).json(descuentosEncontrados);
  } catch (error) {
    console.error("Error al buscar descuentos:", error);
    res.status(500).json({ message: "Error interno al buscar descuentos" });
  }
};

export const eliminarDescuentos = async (req: Request, res: Response): Promise<void> => {
  try {
    const { idsDescuentos } = req.body;

    // Validar entrada
    if (!Array.isArray(idsDescuentos) || idsDescuentos.length === 0) {
      res.status(400).json({ message: "Debe proporcionar una lista de IDs de descuentos a eliminar" });
      return;
    }

    const descuentoRepository = AppDataSource.getRepository(Descuento);

    // Verificar que existan
    const existentes = await descuentoRepository.findByIds(idsDescuentos);

    if (existentes.length === 0) {
      res.status(404).json({ message: "No se encontraron descuentos con los IDs proporcionados" });
      return;
    }

    // Eliminar descuentos (con cascada)
    await descuentoRepository.remove(existentes);

    res.status(200).json({
      message: `Se eliminaron correctamente ${existentes.length} descuento(s) junto con sus relaciones`,
    });
  } catch (error) {
    console.error("Error al eliminar descuentos:", error);
    res.status(500).json({ message: "Error interno al eliminar los descuentos" });
  }
};
