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
    const { nombre, medida, precio, urlImg } = req.body;

    if (!nombre || !precio) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    const precioNum = parseFloat(precio);
    if (isNaN(precioNum)) {
      return res.status(400).json({ error: "El precio debe ser un número" });
    }

    const connection = await database.getConnection();
    const query = "INSERT INTO productos (nombre, medida, precio, urlImg) VALUES (?, ?, ?, ?)";
    const result = await connection.query(query, [nombre, medida || null, precioNum, urlImg || null]);

    res.status(201).json({ id: result.insertId, nombre, medida, precio: precioNum, urlImg });
  } catch (error) {
    console.error("Error al agregar producto:", error);
    res.status(500).json({ error: "Error al agregar producto" });
  }
};

exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await database.getConnection();
    console.log("Conectado a la BD, buscando producto con ID:", id);

    const rows = await connection.query("SELECT * FROM productos WHERE id = ?", [id]);
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
    const { id } = req.params;
    const { nombre, medida, precio, urlImg } = req.body;

    if (!nombre || !precio) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    const precioNum = parseFloat(precio);
    if (isNaN(precioNum)) {
      return res.status(400).json({ error: "El precio debe ser un número válido" });
    }

    const connection = await database.getConnection();
    const result = await connection.query(
      "UPDATE productos SET nombre = ?, medida = ?, precio = ?, urlImg = ? WHERE id = ?",
      [nombre, medida || null, precioNum, urlImg || null, id]
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
    const { id } = req.params;
    const connection = await database.getConnection();

    const query = "DELETE FROM productos WHERE id = ?";
    const result = await connection.query(query, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    res.status(500).json({ error: "Error al eliminar producto" });
  }
};