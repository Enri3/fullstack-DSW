const { getConnection } = require("../src/database");

const getNombreTipo = async (req, res) => {
  const { idTipoCli } = req.params;

  if (!idTipoCli) {
    return res.status(400).json({ message: "Falta el idTipoCli" });
  }

  try {
    const conn = await getConnection();
    
    const rows = await conn.query(
      "SELECT nombreTipo FROM tipo_clientes where idTipoCli = ?"
      [idTipoCli]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Tipo de cliente no encontrado" });
    }

    res.json({ 
      nombreTipoCli: rows[0].nombreTipoCli 
    });
  } catch (error) {
    console.error("Error en getNombreTipoCliente:", error);
    res.status(500).json({ message: "Error al obtener el tipo de cliente", detalle: error.message });
  }
};


module.exports = {
  getNombreTipo,
};