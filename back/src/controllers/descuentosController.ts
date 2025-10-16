import { Request, Response } from "express";
import { AppDataSource } from "../database"; // Tu DataSource
import { Descuento } from "../../../entidades/descuento";
import { ProductoDescuento } from "../../../entidades/productos_descuentos"
import { Producto } from "../../../entidades/producto";
import { In } from "typeorm"; // Necesario para buscar múltiples IDs
import { create } from "domain";

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

export const addDescuento = async (req:Request, res:Response): Promise<void> =>{
  try {
    const { descuentoAgregar , idsProductosAgregar } = req.body;
    
    if(!descuentoAgregar || !idsProductosAgregar) return;
    
    const descuentosRepository = AppDataSource.getRepository(Descuento);
    const productosRepository = AppDataSource.getRepository(Producto);
    const productosDescuentoRepository = AppDataSource.getRepository(ProductoDescuento);
    
    let idDescuentoNuevo = 0;

    let descuento = await descuentosRepository.findOneBy({
      porcentaje: descuentoAgregar.porcentaje,
      fechaDesde: descuentoAgregar.fechaDesde,
      fechaHasta: descuentoAgregar.fechaHasta
    });

    if(descuento != null){
      let idDescuentoNuevo = descuento.idDesc;
    }else{
      const descuentoAg = descuentosRepository.create({
              porcentaje: parseFloat(descuentoAgregar.porcentaje),
              fechaDesde: new Date(descuentoAgregar.fechaDesde),
              fechaHasta: new Date(descuentoAgregar.fechaHasta),
          });
      descuentosRepository.save(descuentoAg);
      let idDescuentoNuevo = descuentoAg.idDesc;
    }
    
    for (const idProd of idsProductosAgregar){
      const prodDesc = await productosDescuentoRepository.findBy({idDesc : idDescuentoNuevo, idProd : idProd})
      if (prodDesc.length = 0){
        const prodDescAg = productosDescuentoRepository.create({
          idDesc: idDescuentoNuevo,
          idProd: idProd
        });
        productosDescuentoRepository.save(prodDescAg);
      }
    }
    res.status(200).json({ message: "Descuento creado con exito" });

  }catch (error: any) {
      console.error("Error en addDescuento1:", error.message || error);
      res.status(500).json({ message: "Error interno al agregar el descuento" });
  }
}

export const addDescuento2 = async (req:Request, res:Response): Promise<void> =>{
  try {
    const { descuentoAgregar , idsProductosAgregar } = req.body;
    
    if(!descuentoAgregar || !idsProductosAgregar) return;

    const descuentosRepository = AppDataSource.getRepository(Descuento);
    const productosDescuentoRepository = AppDataSource.getRepository(ProductoDescuento);

    let descuento = await descuentosRepository.findOne({ where : {
      porcentaje: descuentoAgregar.porcentaje,
      fechaDesde: descuentoAgregar.fechaDesde,
      fechaHasta: descuentoAgregar.fechaHasta
    }});

    let mensajeFinal:string;

    if (!descuento) {
          descuento = descuentosRepository.create({
              porcentaje: parseFloat(descuentoAgregar.porcentaje),
              fechaDesde: new Date(descuentoAgregar.fechaDesde),
              fechaHasta: new Date(descuentoAgregar.fechaHasta),
          });
        descuento = await descuentosRepository.save(descuento);
        mensajeFinal = "Descuento creado y asociado correctamente ✅";

        const idTodos: number[] = idsProductosAgregar;

        const relaciones: ProductoDescuento[] = idTodos.map(idProd => {
        const relacion = new ProductoDescuento();
      
        relacion.idDesc = descuento!.idDesc as number;   
        relacion.idProd = idProd;             
        return relacion;
      });
      await productosDescuentoRepository.save(relaciones);
    } else {
        mensajeFinal = "El descuento ya existía, pero fue asociado a nuevos productos.";
        

        const coincidencias = await productosDescuentoRepository
        .createQueryBuilder("dp")
        .select("dp.idProd")
        .where("dp.idDesc = :idDesc", { idDesc: descuento.idDesc })
        .andWhere("dp.idProd IN (:...idsProductos)", { idsProductosAgregar })
        .getMany();

        const idsRelacionados = coincidencias.map(dp => dp.idProd);
    
        const idTodos: number[] = idsProductosAgregar;

        const idsAgregar = idTodos.filter(idProd => !idsRelacionados.includes(idProd));

        const relaciones: ProductoDescuento[] = idsAgregar.map(idProd => {
        const relacion = new ProductoDescuento();
        relacion.idDesc = descuento!.idDesc as number;
        relacion.idProd = idProd;
        return relacion;
        });
        if(relaciones.length > 0) await productosDescuentoRepository.save(relaciones);
      }
    res.status(200).json({ message: mensajeFinal });
  } catch (error: any) {
      console.error("Error en addDescuento1:", error.message || error);
      res.status(500).json({ message: "Error interno al agregar el descuento" });
  }
}