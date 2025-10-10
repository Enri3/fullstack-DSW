const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { getConnection } = require("../src/database");

const registrarCliente = async (req, res) => {
  const { nombre, apellido, direccion, email, password } = req.body;

  if (!nombre || !email || !password || !direccion)
    return res.status(400).json({ message: "Faltan completar campos obligatorios" });

  try {
    const conn = await getConnection();

    // 🚨 FIX: promise-mysql devuelve directamente un array de filas, no [rows]
    const existe = await conn.query("SELECT * FROM clientes WHERE email = ?", [email]);

    if (existe.length > 0) {
      return res.status(400).json({ message: "El cliente ya existe" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await conn.query(
      "INSERT INTO clientes (nombre, apellido, direccion, email, password, idTipoCli) VALUES (?, ?, ?, ?, ?, ?)",
      [nombre, apellido, direccion, email, hashedPassword, 1]
    );

    res.json({ message: "Cliente registrado con éxito" });
  } catch (error) {
    console.error("Error en registrarCliente:", error);
    res.status(500).json({ message: "Error al registrar el cliente", detalle: error.message });
  }
};

const loginCliente = async (req, res) => {
  const { email, password } = req.body;

  try {
    const conn = await getConnection();
    const rows = await conn.query("SELECT * FROM clientes WHERE email = ?", [email]);
    if (rows.length === 0)
      return res.status(400).json({ message: "Cliente no encontrado" });

    const cliente = rows[0];
    const coincide = await bcrypt.compare(password, cliente.password);
    if (!coincide)
      return res.status(400).json({ message: "Contraseña incorrecta" });

    const token = jwt.sign(
      { id: cliente.idCli, nombre: cliente.nombre, tipo: cliente.idTipoCli },
      "clave_secreta_super_segura",
      { expiresIn: "2h" }
    );

    res.json({ message: "Login exitoso", token, tipoCliente: cliente.idTipoCli });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al iniciar sesión" });
  }
};

module.exports = { registrarCliente, loginCliente };