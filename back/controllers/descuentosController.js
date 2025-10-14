const { getConnection } = require("../src/database");

const addDescuento = async (req, res) => {
  const { porcentaje, fechaDesde, fechaHasta, idProd } = req.body;
  
  if (!porcentaje || !idProd || !fechaDesde || !fechaHasta)
    return res.status(400).json({ message: "Faltan completar campos obligatorios" });

  try {
    const conn = await getConnection();

    const existe = await conn.query("SELECT * FROM descuentos WHERE idProd = ? AND fechaInicio = ? AND fechaFin = ? AND porcentaje = ?", [idProd, fechaInicio, fechaFin, porcentaje]);

    if (existe.length > 0) {
      return res.status(400).json({ message: "El descuento ya existe" });
    }

    await conn.query(
      "INSERT INTO descuentos ( porcentaje, fechaInicio, fechaFin, idProducto) VALUES ( ?, ?, ?, ?)",
      [porcentaje, fechaInicio, fechaFin, idProd]
    );
    await conn.query(
      "INSERT INTO productos_descuentos (idProducto) VALUES (?)",
      [ idProd]
    );

    res.json({ message: "Descuento agregado con éxito" });
  } catch (error) {
    console.error("Error en addDescuento:", error);
    res.status(500).json({ message: "Error al agregar el descuento", detalle: error.message });
  }
};

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