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