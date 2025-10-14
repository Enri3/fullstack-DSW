
const { getConnection } = require("../src/database");

const addDescuento = async (req, res) => {
  const { porcentaje, fechaDesde, fechaHasta, idsProductos } = req.body;

  //Valido que no falten campos requeridos
  if (!porcentaje || !fechaDesde || !fechaHasta || !idsProductos || idsProductos.length === 0) {
    return res.status(400).json({ message: "Faltan campos o productos" });
  }

  try {
    const conn = await getConnection();
    //convierto fechas a formato SQL (YYYY-MM-DD)
    const fechaDesdeSQL = new Date(fechaDesde).toISOString().slice(0, 10);
    const fechaHastaSQL = new Date(fechaHasta).toISOString().slice(0, 10);

  const [rows] = await conn.query(
    "SELECT idDesc FROM descuentos WHERE porcentaje = ? AND fechaDesde = ? AND fechaHasta = ?",
    [porcentaje, fechaDesdeSQL, fechaHastaSQL] // <-- aquí debes usar fechaDesdeSQL y fechaHastaSQL
  );
    const existe = rows;

    //Me fijo si el descuento ya existe
    if (existe && existe.length > 0) {
      // Si ya existe ese descuento general, ahora validamos si ya está asociado a los mismos productos
      const idDescExistente = existe[0].idDesc;

      for (const idProd of idsProductos) {
        const [yaAsociado] = await conn.query(
          "SELECT * FROM productos_descuentos WHERE idDesc = ? AND idProd = ?",
          [idDescExistente, idProd]
        );

        if (yaAsociado.length > 0) {
          return res.status(400).json({
            message: `El producto (ID ${idProd}) ya tiene asignado ese mismo descuento.`,
          });
        }
      }

      // Si llegamos aquí, significa que el descuento existe pero no está asociado a los productos actuales
      for (const idProd of idsProductos) {
        await conn.query(
          "INSERT INTO productos_descuentos (idDesc, idProd) VALUES (?, ?)",
          [idDescExistente, idProd]
        );
      }

      return res.json({
        message: "El descuento ya existía, pero fue asociado a nuevos productos.",
        idDesc: idDescExistente,
      });
    }
    
    // Si el descuento no existe, lo creamos y asociamos a los productos
      const result = await conn.query(
      "INSERT INTO descuentos (porcentaje, fechaDesde, fechaHasta) VALUES (?, ?, ?)",
      [porcentaje, fechaDesdeSQL, fechaHastaSQL]
    );
    const idDesc = result.insertId;

    //Cree el descuento, ahora lo asocio a los productos
    for (const idProd of idsProductos) {
      await conn.query(
        "INSERT INTO productos_descuentos (idDesc, idProd) VALUES (?, ?)",
        [idDesc, idProd]
      );
    }

    res.json({ message: "Descuento creado y asociado correctamente ✅", idDesc });

  } catch (error) {
    console.error("Error en addDescuento:", error);
    res.status(500).json({ message: "Error al agregar el descuento", detalle: error.message });
  }
}

const getAllProductos = async (req, res) => {
  try {
    const conn = await getConnection();
    const rows = await conn.query("SELECT * FROM productos");
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({ message: "Error al obtener productos" });
  }
};

module.exports = { addDescuento , getAllProductos};