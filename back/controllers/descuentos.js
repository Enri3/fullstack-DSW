const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { getConnection } = require("../src/database");

const getAllDescuentosConProductos = async (req, res) => {
  try {
    const conn = await getConnection();
    const rows = await conn.query("SELECT d.*, p.nombre AS productoNombre FROM descuentos d INNER JOIN productos_descuentos pd ON d.idDesc = pd.idDesc INNER JOIN productos p ON pd.idProd = p.idProd");
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener descuentos con productos:", error);
    res.status(500).json({ message: "Error al obtener descuentos con productos" });
  }
};

const addDescuento = async (req, res) => {
  const { idDesc, porcentaje, fechaInicio, fechaFin, idProd } = req.body;

  if (!porcentaje || !idProd || !fechaInicio || !fechaFin)
    return res.status(400).json({ message: "Faltan completar campos obligatorios" });

  try {
    const conn = await getConnection();

    const existe = await conn.query("SELECT * FROM descuentos WHERE idProd = ? AND fechaInicio = ? AND fechaFin = ? AND porcentaje = ?", [idProd, fechaInicio, fechaFin, porcentaje]);

    if (existe.length > 0) {
      return res.status(400).json({ message: "El descuento ya existe" });
    }

    await conn.query(
      "INSERT INTO descuentos (idDesc, porcentaje, fechaInicio, fechaFin, idProducto) VALUES (?, ?, ?, ?, ?)",
      [idDesc, porcentaje, fechaInicio, fechaFin, idProd]
    );
    await conn.query(
      "INSERT INTO productos_descuentos (idDesc, idProducto) VALUES (?, ?)",
      [idDesc, idProd]
    );

    res.json({ message: "Descuento agregado con éxito" });
  } catch (error) {
    console.error("Error en addDescuento:", error);
    res.status(500).json({ message: "Error al agregar el descuento", detalle: error.message });
  }
};

const deleteMultipleDescuentos = async (req, res) => {
  const { ids } = req.body;

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ message: "Debe enviar un array de IDs válido" });
  }

  try {
    const conn = await getConnection();

    // Eliminamos todos los IDs de una vez
    const result = await conn.query(
      `DELETE FROM descuentos WHERE idDesc IN (?)`,
      [ids]
    );

    res.json({
      message: `Se eliminaron ${result.affectedRows} descuentos correctamente.`,
    });
  } catch (error) {
    console.error("Error al eliminar clientes:", error);
    res.status(500).json({ message: "Error al eliminar clientes" });
  }
};