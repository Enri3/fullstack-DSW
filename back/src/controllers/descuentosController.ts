import { Request, Response } from "express";
import { AppDataSource } from "../database"; // Tu DataSource
import { Descuento } from "../../../entidades/descuento";
import { ProductoDescuento } from "../../../entidades/productos_descuentos"
import { Producto } from "../../../entidades/producto";
import { In } from "typeorm"; // Necesario para buscar múltiples IDs

// El controlador que reemplaza tu lógica SQL cruda
export const addDescuento = async (req: Request, res: Response): Promise<void> => {
    const { porcentaje, fechaDesde, fechaHasta, idsProductos } = req.body;

    // Validación inicial
    if (!porcentaje || !fechaDesde || !fechaHasta || !idsProductos || idsProductos.length === 0) {
        res.status(400).json({ message: "Faltan campos (porcentaje, fechas) o productos (idsProductos)." });
        return;
    }

    // Preparación de datos y limpieza de IDs
    const fechaDesdeObj = new Date(fechaDesde);
    const fechaHastaObj = new Date(fechaHasta);
    const idsProdNumericos = idsProductos.map((id: any) => parseInt(id, 10)).filter(Number.isInteger);

    // Formato de fecha para búsqueda exacta en la DB
    const fechaDesdeStr = fechaDesdeObj.toISOString().slice(0, 10);
    const fechaHastaStr = fechaHastaObj.toISOString().slice(0, 10);

    try {
        // --- Uso de Transacción de TypeORM para asegurar atomicidad (TODO o NADA) ---
        await AppDataSource.transaction(async (transactionalEntityManager) => {

            // Repositorios dentro de la transacción
            const DescuentoRepo = transactionalEntityManager.getRepository(Descuento);
            const ProdDescRepo = transactionalEntityManager.getRepository(ProductoDescuento);
            const ProductoRepo = transactionalEntityManager.getRepository(Producto);

            // 1. Verificar si los productos existen
            const productosExistentes = await ProductoRepo.findBy({
                idProd: In(idsProdNumericos), // Buscar todos los IDs en la lista
            });
            
            if (productosExistentes.length !== idsProdNumericos.length) {
                // Si no se encuentra al menos un producto, abortar la transacción
                const missingIds = idsProdNumericos.filter(id => !productosExistentes.some(p => p.idProd === id));
                throw new Error(`Error de Negocio: Los productos (IDs: ${missingIds.join(', ')}) no existen.`);
            }

            // 2. Buscar Descuento existente por sus valores
            let descuento = await DescuentoRepo.findOne({
                where: {
                    porcentaje: porcentaje,
                    fechaDesde: fechaDesdeStr as any, 
                    fechaHasta: fechaHastaStr as any, 
                }
            });

            let mensajeFinal: string;

            if (!descuento) {
                // 3a. Si NO existe, crear el nuevo descuento
                descuento = DescuentoRepo.create({
                    porcentaje: parseFloat(porcentaje),
                    fechaDesde: fechaDesdeObj,
                    fechaHasta: fechaHastaObj,
                });
                descuento = await DescuentoRepo.save(descuento);
                mensajeFinal = "Descuento creado y asociado correctamente ✅";
            } else {
                mensajeFinal = "El descuento ya existía, pero fue asociado a nuevos productos.";
            }

            const idDesc = descuento.idDesc;

            // 4. Verificar duplicados de asociación para el descuento existente/nuevo
            const asociacionesExistentes = await ProdDescRepo.find({
                where: { 
                    idDesc: idDesc,
                    idProd: In(idsProdNumericos) 
                }
            });

            if (asociacionesExistentes.length > 0) {
                // Si ya existe alguna asociación, abortar la transacción con un error de negocio
                const idsDuplicados = asociacionesExistentes.map(a => a.idProd).join(', ');
                throw new Error(`Error de Negocio: Los productos (IDs: ${idsDuplicados}) ya tienen asignado ese mismo descuento.`);
            }

            // 5. Crear y guardar las nuevas asociaciones (productos_descuentos)
            const nuevasAsociaciones = idsProdNumericos.map((idProd) => 
                ProdDescRepo.create({
                    idDesc: idDesc,
                    idProd: idProd
                })
            );
            
            await ProdDescRepo.save(nuevasAsociaciones);

            // Respuesta final si la transacción es exitosa
            res.json({ message: mensajeFinal, idDesc: idDesc });

        }); // La transacción se confirma (COMMIT) aquí.

    } catch (error: any) {
        // La transacción se revierte (ROLLBACK) si hay un error
        console.error("Error en addDescuento (TypeORM):", error.message || error);
        
        // Manejo específico para los errores lanzados dentro de la transacción (Errores de Negocio)
        if (error.message && error.message.includes('Error de Negocio')) {
            res.status(400).json({ message: error.message.replace('Error de Negocio: ', '') });
        } else {
            // Error interno del servidor o de la base de datos
            res.status(500).json({ 
                message: "Error interno del servidor al agregar el descuento", 
                detalle: error.message 
            });
        }
    }
};

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

export const addDescuento1 = async (req:Request, res:Response): Promise<void> =>{
  try {
    const { idsProductosAgregar , descuentoAgregar } = req.body;
    
    if(!idsProductosAgregar || !descuentoAgregar) return;

    const descuentosRepository = AppDataSource.getRepository(Descuento);
    const productosDescuentoRepository = AppDataSource.getRepository(ProductoDescuento);
    const productosRepository = AppDataSource.getRepository(Producto);
    //const idsTodos: number[] = idsProductosAgregar;
    //const idsAgregar: number[] = idsProductosAgregar;

    let descuento = await descuentosRepository.findOne({ where : {
      porcentaje: descuentoAgregar.porcentaje,
      fechaDesde: descuentoAgregar.fechaDesde,
      fechaHasta: descuentoAgregar.fechaHasta
    }});

    let mensajeFinal:string;

    if (!descuento) {
        descuento = descuentosRepository.create({
            porcentaje: parseFloat(descuentoAgregar.porcentaje),
            fechaDesde: descuentoAgregar.fechaDesdeObj,
            fechaHasta: descuentoAgregar.fechaHastaObj,
        });
        descuento = await descuentosRepository.save(descuento);
        mensajeFinal = "Descuento creado y asociado correctamente ✅";
    } else {
        mensajeFinal = "El descuento ya existía, pero fue asociado a nuevos productos.";
        

        const coincidencias = await productosDescuentoRepository
        .createQueryBuilder("dp")
        .select("dp.idProd")
        .where("dp.idDesc = :idDesc", { idDesc: descuento.idDesc })
        .andWhere("dp.idProd IN (:...idsProductos)", { idsProductosAgregar })
        .getMany();

        const idsRelacionados = coincidencias.map(dp => dp.idProd);
    
        //const idTodos: number[] = idsProductosAgregar;

        const idsAgregar = idsTodos.filter(idProd => !idsRelacionados.includes(idProd));

    }
    //const relaciones: ProductoDescuento[] = idsProductosAgregar.map(idsProd => {
    //const relacion = new ProductoDescuento();
    //relacion.idDesc = descuento.idDesc;   // o relacion.descuento = descuento si tenés relación ManyToOne
    //relacion.idProd = idProd;             // o relacion.producto = { idProd } si usás relación ManyToOne
    //return relacion;
    //});

    // 2️⃣ Guardar todos en la base de datos
    //await productosDescuentoRepository.save(relaciones);


  }

}