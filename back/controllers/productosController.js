const database = require('../src/database');

exports.getAll = async (req, res) => {
  try {
    const connection = await database.getConnection();
    const result = await connection.query("SELECT * FROM productos");
    console.log("Resultado DB:", result); // <- revisa en consola del servidor
    res.json(result);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({ error: "Error al obtener productos" });
  }
};

exports.create = async (req, res) => {
  try {
    const { nombreProd, medida, precioProd, urlImg } = req.body;

    if (!nombreProd || !precioProd) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    const precioNum = parseFloat(precioProd);
    if (isNaN(precioNum)) {
      return res.status(400).json({ error: "El precio debe ser un número" });
    }

    const connection = await database.getConnection();
    const query = "INSERT INTO productos (nombreProd, medida, precioProd, urlImg) VALUES (?, ?, ?, ?)";
    const result = await connection.query(query, [nombreProd, medida || null, precioNum, urlImg || null]);

    res.status(201).json({ idProd: result.insertId, nombreProd, medida, precioProd: precioNum, urlImg });
  } catch (error) {
    console.error("Error al agregar producto:", error);
    res.status(500).json({ error: "Error al agregar producto" });
  }
};

exports.getById = async (req, res) => {
  try {
    const { idProd } = req.params;
    const connection = await database.getConnection();
    console.log("Conectado a la BD, buscando producto con ID:", idProd);

    const rows = await connection.query("SELECT * FROM productos WHERE idProd = ?", [idProd]);
    console.log("Resultado de la consulta:", rows);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Error al obtener producto por ID:", error.message);
    res.status(500).json({ error: "Error al obtener producto" });
  }
};

exports.update = async (req, res) => {
  try {
    const { idProd } = req.params;
    const { nombreProd, medida, precioProd, urlImg } = req.body;

    if (!nombreProd || !precioProd) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    const precioNum = parseFloat(precioProd);
    if (isNaN(precioNum)) {
      return res.status(400).json({ error: "El precio debe ser un número válido" });
    }

    const connection = await database.getConnection();
    const result = await connection.query(
      "UPDATE productos SET nombreProd = ?, medida = ?, precioProd = ?, urlImg = ? WHERE idProd = ?",
      [nombreProd, medida || null, precioNum, urlImg || null, idProd]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json({ message: "Producto actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar producto:", error.message);
    res.status(500).json({ error: "Error al actualizar producto" });
  }
};

exports.delete = async (req, res) => {
  try {
    const { idProd } = req.params;
    const connection = await database.getConnection();

    const query = "DELETE FROM productos WHERE idProd = ?";
    const result = await connection.query(query, [idProd]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    res.status(500).json({ error: "Error al eliminar producto" });
  }
};

exports.buscarProducto = async(req, res) => {
  const { nombreProdBuscar } = req.body;

  try{
    const conn = await getConnection();

    const [rows] = await conn.query(
    `SELECT idProd, nombreProd, precioProd, medida
    FROM productos
    WHERE nombreProd LIKE '%?%' AND deleted = 0`,[nombreProdBuscar]);
    
    res.json(rows);
  }catch (error){
    console.error('Error al ejecurtar la consulta SQL: ', error);
    res.status(500).json({ message: 'Error interno del servidor al buscar.' });
  }
}