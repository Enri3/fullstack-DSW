import { Request, Response } from "express";
import { AppDataSource } from "../database"; 
import { Descuento } from "../entidades/descuento";
import { ProductoDescuento } from "../entidades/productos_descuentos"
import { Producto } from "../entidades/producto";
import { In } from "typeorm"; 

function normalizeDateOnly(input: unknown): string {
  if (!input) return "";
  const raw = String(input);
  if (/^\d{4}-\d{2}-\d{2}/.test(raw)) {
    return raw.slice(0, 10);
  }

  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  return new Date(parsed.getTime() - parsed.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10);
}

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

    const fdStr = normalizeDateOnly(fechaDesde);
    const fhStr = normalizeDateOnly(fechaHasta);

    if (!fdStr || !fhStr) {
      res.status(400).json({ message: "Formato de fecha inválido" });
      return;
    }

    const cantidadSolapados = await productosDescuentoRepository
      .createQueryBuilder("pd")
      .innerJoin("pd.descuento", "d")
      .where("pd.idProd IN (:...idsProductos)", { idsProductos })
      .andWhere("NOT (d.fechaHasta < :fd OR d.fechaDesde > :fh)", { fd: fdStr, fh: fhStr })
      .getCount();

    if (cantidadSolapados > 0) {
      res.status(400).json({ message: "Ya existe un descuento activo/solapado para al menos un producto" });
      return;
    }

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

    res.status(200).json({ message: "Descuento creado y asociado correctamente", idDesc });
  } catch (error: any) {
    console.error("Error en addDescuento:", error.message || error);
    res.status(500).json({ message: "Error interno al agregar el descuento" });
  }
}

export const buscarDescuentoFiltro = async (req: Request, res: Response): Promise<void> => {
  try {
    const { idProd, nombreProd } = req.body; 

    const productoDescuentoRepository = AppDataSource.getRepository(ProductoDescuento);

    let qb = productoDescuentoRepository
      .createQueryBuilder("pd")
      .innerJoinAndSelect("pd.producto", "producto")
      .innerJoinAndSelect("pd.descuento", "descuento")
      .where("producto.deleted = 0")
      //para no mostrar descuentos futuros descomentar la siguiente línea:
      //.andWhere("descuento.fechaDesde <= CURRENT_DATE")
      .andWhere("descuento.fechaHasta >= CURRENT_DATE");

    if (idProd !== undefined && idProd !== null && String(idProd).trim() !== "") {
      qb = qb.andWhere("descuento.fechaDesde <= CURRENT_DATE").andWhere("producto.idProd = :idProd", { idProd: Number(idProd) });
    } else if (nombreProd && String(nombreProd).trim() !== "") {
      const filtro = String(nombreProd).trim().toLowerCase();
      qb = qb.andWhere("LOWER(producto.nombreProd) LIKE :filtro", { filtro: `%${filtro}%` });
    }

    qb = qb
      .orderBy("descuento.fechaDesde", "ASC")
      .addOrderBy("descuento.idDesc", "ASC")
      .addOrderBy("producto.nombreProd", "ASC");

    const resultados = await qb.getMany();

    const descuentosEncontrados = resultados.map((pd) => {
      const prod = pd.producto as Producto | undefined;
      const desc = pd.descuento as Descuento | undefined;

      return {
        idProd: prod?.idProd ?? null,
        nombreProd: prod?.nombreProd ?? "",
        medida: prod?.medida ?? "",
        stock: prod?.stock ?? 0,
        urlImg: prod?.urlImg ?? "",
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
