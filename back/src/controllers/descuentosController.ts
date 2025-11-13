import { Request, Response } from "express";
import { AppDataSource } from "../database"; 
import { Descuento } from "../../../entidades/descuento";
import { ProductoDescuento } from "../../../entidades/productos_descuentos"
import { Producto } from "../../../entidades/producto";
import { In } from "typeorm"; 

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

    const fdStr = new Date(fechaDesde).toISOString().slice(0, 10);
    const fhStr = new Date(fechaHasta).toISOString().slice(0, 10);

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
        fechaDesde: fdStr as unknown as Date,
        fechaHasta: fhStr as unknown as Date,
      });
      const guardado = await descuentosRepository.save(nuevo);
      idDesc = guardado.idDesc as number;
    } else {
      idDesc = descuento.idDesc as number;
    }

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
    const { nomProdBuscados } = req.body; 

    const productoDescuentoRepository = AppDataSource.getRepository(ProductoDescuento);

    let qb = productoDescuentoRepository
      .createQueryBuilder("pd")
      .innerJoinAndSelect("pd.producto", "producto")
      .innerJoinAndSelect("pd.descuento", "descuento")
      .where("producto.deleted = 0");

    if (nomProdBuscados && String(nomProdBuscados).trim() !== "") {
      const filtro = nomProdBuscados.trim().toLowerCase();
      qb = qb.andWhere("LOWER(producto.nombreProd) LIKE :filtro", { filtro: `%${filtro}%` });
    }

    const resultados = await qb.getMany();

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

    if (!Array.isArray(idsDescuentos) || idsDescuentos.length === 0) {
      res.status(400).json({ message: "Debe proporcionar una lista de IDs de descuentos a eliminar" });
      return;
    }

    const descuentoRepository = AppDataSource.getRepository(Descuento);

    const existentes = await descuentoRepository.findByIds(idsDescuentos);

    if (existentes.length === 0) {
      res.status(404).json({ message: "No se encontraron descuentos con los IDs proporcionados" });
      return;
    }

    await descuentoRepository.remove(existentes);

    res.status(200).json({
      message: `Se eliminaron correctamente ${existentes.length} descuento(s) junto con sus relaciones`,
    });
  } catch (error) {
    console.error("Error al eliminar descuentos:", error);
    res.status(500).json({ message: "Error interno al eliminar los descuentos" });
  }
};
