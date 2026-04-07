import { AppDataSource } from "../database";
import { ProductoDescuento } from "../../../entidades/productos_descuentos";
import { TipoCliente } from "../../../entidades/tipo-cliente";

export type PrecioCalculado = {
  precioBase: number;
  precioFinalProd: number;
  porcentajeDescuentoProducto: number;
  porcentajeDescuentoTipoCliente: number;
};

function normalizeDateOnly(input: Date | string): string {
  const raw = input instanceof Date ? input.toISOString() : String(input);
  return raw.slice(0, 10);
}

function redondear2(valor: number): number {
  return Math.round((valor + Number.EPSILON) * 100) / 100;
}

export async function getDescuentoActivoProducto(idProd: number): Promise<number> {
  return getDescuentoActivoProductoEnFecha(idProd, new Date());
}

export async function getDescuentoActivoProductoEnFecha(idProd: number, fechaReferencia: Date | string): Promise<number> {
  const repo = AppDataSource.getRepository(ProductoDescuento);
  const fecha = normalizeDateOnly(fechaReferencia);

  const relacionActiva = await repo
    .createQueryBuilder("pd")
    .innerJoinAndSelect("pd.descuento", "descuento")
    .where("pd.idProd = :idProd", { idProd })
    .andWhere("descuento.fechaDesde <= :fecha", { fecha })
    .andWhere("descuento.fechaHasta >= :fecha", { fecha })
    .orderBy("descuento.fechaDesde", "DESC")
    .addOrderBy("descuento.idDesc", "DESC")
    .getOne();

  if (!relacionActiva?.descuento) {
    return 0;
  }

  const porcentaje = Number(relacionActiva.descuento.porcentaje);
  return Number.isNaN(porcentaje) ? 0 : porcentaje;
}

export async function getDescuentoTipoCliente(idTipoCli?: number): Promise<number> {
  if (!idTipoCli || Number.isNaN(Number(idTipoCli))) {
    return 0;
  }

  const tipoClienteRepo = AppDataSource.getRepository(TipoCliente);
  const tipoCliente = await tipoClienteRepo.findOne({ where: { idTipoCli: Number(idTipoCli) } });

  if (!tipoCliente) {
    return 0;
  }

  const porcentaje = Number(tipoCliente.descuento);
  if (Number.isNaN(porcentaje) || porcentaje <= 0) {
    return 0;
  }

  if (porcentaje > 0 && porcentaje <= 1) {
    return porcentaje * 100;
  }

  return porcentaje;
}

export async function calcularPrecioFinalProducto(
  precioBaseInput: number,
  idProd: number,
  idTipoCli?: number
): Promise<PrecioCalculado> {
  return calcularPrecioFinalProductoConFecha(precioBaseInput, idProd, idTipoCli, new Date());
}

export async function calcularPrecioFinalProductoConFecha(
  precioBaseInput: number,
  idProd: number,
  idTipoCli?: number,
  fechaReferencia?: Date | string
): Promise<PrecioCalculado> {
  const precioBase = Number(precioBaseInput);
  const safePrecioBase = Number.isNaN(precioBase) ? 0 : precioBase;

  const porcentajeDescuentoProducto = fechaReferencia
    ? await getDescuentoActivoProductoEnFecha(idProd, fechaReferencia)
    : await getDescuentoActivoProducto(idProd);
  const porcentajeDescuentoTipoCliente = await getDescuentoTipoCliente(idTipoCli);

  const factorProducto = 1 - porcentajeDescuentoProducto / 100;
  const factorTipoCliente = 1 - porcentajeDescuentoTipoCliente / 100;

  const precioFinalProd = redondear2(safePrecioBase * factorProducto * factorTipoCliente);

  return {
    precioBase: safePrecioBase,
    precioFinalProd,
    porcentajeDescuentoProducto,
    porcentajeDescuentoTipoCliente,
  };
}
