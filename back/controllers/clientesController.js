const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { getConnection } = require("../src/database");

const registrarCliente = async (req, res) => {
  const { nombre, apellido, direccion, email, password } = req.body;

  if (!nombre || !email || !password) {
    return res.status(400).json({ message: "Faltan completar campos obligatorios" });
  }

  try {
    const conn = await getConnection();

    const existe = await conn.query("SELECT * FROM clientes WHERE email = ?", [email]);
    if (existe.length > 0) {
      return res.status(400).json({ message: "El cliente que se intenta registrar ya existe" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await conn.query(
      "INSERT INTO clientes (nombre, apellido, direccion, email, password, idTipoCli) VALUES (?, ?, ?, ?, ?, ?)",
      [nombre, apellido, direccion, email, hashedPassword, 1] // tipoCliente "Inicial"
    );

    res.json({ message: "Cliente registrado con éxito" });
  } catch (error) {
    console.error("Error en registrarCliente:", error);
    res.status(500).json({ message: "Error al registrar el cliente" });
  }
};

const loginCliente = async (req, res) => {
  const { email, password } = req.body;

  try {
    const conn = await getConnection();

    const rows = await conn.query("SELECT * FROM clientes WHERE email = ?", [email]);
    if (rows.length === 0) {
      return res.status(400).json({ message: "El cliente ingresado no existe" });
    }

    const cliente = rows[0];
    const coincide = await bcrypt.compare(password, cliente.password);
    if (!coincide) {
      return res.status(400).json({ message: "La contraseña ingresada es incorrecta" });
    }

    const token = jwt.sign(
      { id: cliente.idCli, nombre: cliente.nombreCli, tipo: cliente.idTipoCli },
      "clave_secreta_super_segura",
      { expiresIn: "2h" }
    );
    
    res.json({ 
    message: "Login exitoso", 
    token, 
    cliente
    });
  } catch (error) {
    console.error("Error en loginCliente:", error);
    res.status(500).json({ message: "Error al iniciar sesión" });
  }
};

module.exports = {
  registrarCliente,
  loginCliente
};