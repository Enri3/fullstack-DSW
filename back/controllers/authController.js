const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { getConnection } = require("../src/database");

const registrarCliente = async (req, res) => {
  const { nombre, apellido, direccion, email, password } = req.body;

  if (!nombre || !email || !password || !direccion)
    return res.status(400).json({ message: "Faltan completar campos obligatorios" });

  try {
    const conn = await getConnection();

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
      return res.status(400).json({ message: "El cliente ingresado no existe" });

    const cliente = rows[0];
    const coincide = await bcrypt.compare(password, cliente.password);
    if (!coincide)
      return res.status(400).json({ message: "La contraseña ingresada es incorrecta" });

    const token = jwt.sign(
      { id: cliente.idCli, nombre: cliente.nombre, tipo: cliente.idTipoCli },
      "clave_secreta_super_segura",
      { expiresIn: "2h" }
    );

    res.json({ message: "Login exitoso", token, cliente});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al iniciar sesión" });
  }
};

const editarCliente = async (req, res) => {
  const { idCli, nombre, apellido, direccion, email, password } = req.body;

  if (!idCli) {
    return res.status(400).json({ message: "Falta el ID del cliente" });
  }

  try {
    const conn = await getConnection();
    let hashedPassword;

    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    await conn.query(
      `UPDATE clientes 
       SET nombre = ?, apellido = ?, direccion = ?, email = ?, 
           password = COALESCE(?, password)
       WHERE idCli = ?`,
      [nombre, apellido, direccion, email, hashedPassword, idCli]
    );

    res.json({ message: "Cliente actualizado correctamente" });
  } catch (error) {
    console.error("Error en editarCliente:", error);
    res.status(500).json({ message: "Error al actualizar el cliente" });
  }
};

module.exports = { registrarCliente, loginCliente, editarCliente };