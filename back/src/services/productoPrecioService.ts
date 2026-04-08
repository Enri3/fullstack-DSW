import { AppDataSource } from "../database";
import { Cliente } from "../../../entidades/cliente";
import { ProductoDescuento } from "../../../entidades/productos_descuentos";
import { TipoCliente } from "../../../entidades/tipo-cliente";

type PrecioProductoCalculado = {
  precioBaseProd: number;
  precioFinalProd: number;
  porcentajeDescuentoProducto: number;
  porcentajeDescuentoTipoCliente: number;
};

const clienteRepo = AppDataSource.getRepository(Cliente);
const tipoClienteRepo = AppDataSource.getRepository(TipoCliente);
const productoDescuentoRepo = AppDataSource.getRepository(ProductoDescuento);

function clampPorcentaje(value: number): number {
  if (Number.isNaN(value)) return 0;
  if (value < 0) return 0;
  if (value > 100) return 100;
  return value;
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

function formatDateOnly(date: Date): string {
  return date.toISOString().slice(0, 10);
}

async function obtenerDescuentoProductoVigente(idProd: number, hoy: Date): Promise<number> {
  const today = formatDateOnly(hoy);

  const raw = await productoDescuentoRepo
    .createQueryBuilder("pd")
    .innerJoin("pd.descuento", "d")
    .select("MAX(d.porcentaje)", "porcentaje")
    .where("pd.idProd = :idProd", { idProd })
    .andWhere("d.fechaDesde <= :today", { today })
    .andWhere("d.fechaHasta >= :today", { today })
    .getRawOne<{ porcentaje: string | number | null }>();

  const porcentaje = Number(raw?.porcentaje ?? 0);
  return clampPorcentaje(porcentaje);
}

async function obtenerDescuentoTipoCliente(idCli?: number): Promise<number> {
  if (!idCli) return 0;

  const cliente = await clienteRepo.findOne({ where: { idCli } });
  if (!cliente) return 0;

  const tipoCliente = await tipoClienteRepo.findOne({ where: { idTipoCli: Number(cliente.idTipoCli) } });
  const porcentaje = Number(tipoCliente?.descuento ?? 0);

  return clampPorcentaje(porcentaje);
}

export async function calcularPrecioProductoParaCliente(
  precioBase: number,
  idProd: number,
  idCli?: number
): Promise<PrecioProductoCalculado> {
  const precioNormalizado = Number.isFinite(precioBase) ? Number(precioBase) : 0;
  const base = precioNormalizado < 0 ? 0 : precioNormalizado;

  const [descuentoProducto, descuentoTipoCliente] = await Promise.all([
    obtenerDescuentoProductoVigente(idProd, new Date()),
    obtenerDescuentoTipoCliente(idCli),
  ]);

  const precioConDescuentoProducto = base * (1 - descuentoProducto / 100);
  const precioFinal = round2(precioConDescuentoProducto * (1 - descuentoTipoCliente / 100));

  return {
    precioBaseProd: round2(base),
    precioFinalProd: precioFinal,
    porcentajeDescuentoProducto: descuentoProducto,
    porcentajeDescuentoTipoCliente: descuentoTipoCliente,
  };
}
