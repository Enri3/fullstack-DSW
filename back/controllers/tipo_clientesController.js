const { getConnection } = require("../src/database");

const getNombreTipo = async (req, res) => {
  try {
    const { id } = req.query;
    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ message: "ID de tipo de cliente no válido." });
    }
    const conn = await getConnection();
    const nombreTipo = await conn.query("SELECT tipo_clientes.nombreTipo FROM tipo_clientes where tipo_clientes.idTipoCli = ?", [id]);
    if (nombreTipo && nombreTipo.length > 0) {
      // Devolvemos el nombre del tipo, no el array completo.
      res.json(nombreTipo[0].nombreTipo); 
    } else {
      res.status(404).json({ message: "Tipo de cliente no encontrado." });
    }
 } catch (error) {
    console.error("Error en obtenerTiposClientes:", error);
    res.status(500).json({ message: "Error al obtener los tipos de clientes" });
 }
};

module.exports = {
  getNombreTipo,
};