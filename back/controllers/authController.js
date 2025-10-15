const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { getConnection } = require("../src/database");

const getAllClientes = async (req, res) => {
  try {
    const conn = await getConnection();
    const rows = await conn.query("SELECT idCli, nombreCli, apellido, email, direccion, email FROM clientes WHERE idTipoCli != 1");
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener clientes:", error);
    res.status(500).json({ message: "Error al obtener clientes" });
  }
};

const registrarCliente = async (req, res) => {
  const { nombreCli, apellido, direccion, email, password } = req.body;

  if (!nombreCli || !email || !password || !direccion)
    return res.status(400).json({ message: "Faltan completar campos obligatorios" });

  try {
    const conn = await getConnection();

    const existe = await conn.query("SELECT * FROM clientes WHERE email = ?", [email]);

    if (existe.length > 0) {
      return res.status(400).json({ message: "El cliente ya existe" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await conn.query(
      "INSERT INTO clientes (nombreCli, apellido, direccion, email, password, idTipoCli) VALUES (?, ?, ?, ?, ?, ?)",
      [nombreCli, apellido, direccion, email, hashedPassword, 1]
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
      { id: cliente.idCli, nombreCli: cliente.nombreCli, tipo: cliente.idTipoCli },
      "clave_secreta_super_segura",
      { expiresIn: "2h" }
    );

    res.json({ message: "Login exitoso", token, cliente });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al iniciar sesión" });
  }
};

const editarCliente = async (req, res) => {
  const { idCli, nombreCli, apellido, direccion, email, password } = req.body;

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
       SET nombreCli = ?, apellido = ?, direccion = ?, email = ?, 
           password = COALESCE(?, password)
       WHERE idCli = ?`,
      [nombreCli, apellido, direccion, email, hashedPassword, idCli]
    );

    res.json({ message: "Cliente actualizado correctamente" });
  } catch (error) {
    console.error("Error en editarCliente:", error);
    res.status(500).json({ message: "Error al actualizar el cliente" });
  }
};

const eliminarClientes = async (req, res) => {
  const { ids } = req.body;

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ message: "Debe enviar un array de IDs válido" });
  }

  try {
    const conn = await getConnection();

    const result = await conn.query(
      `DELETE FROM clientes WHERE idCli IN (?)`,
      [ids]
    );

    res.json({
      message: `Se eliminaron ${result.affectedRows} clientes correctamente.`,
    });
  } catch (error) {
    console.error("Error al eliminar clientes:", error);
    res.status(500).json({ message: "Error al eliminar clientes" });
  }
};

const cambiarPassword = async (req, res) => {
  const { idCli, passwordAnterior, passwordNueva } = req.body;

  if (!idCli || !passwordAnterior || !passwordNueva) {
    return res.status(400).json({ message: "Faltan datos requeridos" });
  }

  try {
    const conn = await getConnection();

    const [cliente] = await conn.query("SELECT * FROM clientes WHERE idCli = ?", [idCli]);
    if (!cliente) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }

    const coincide = await bcrypt.compare(passwordAnterior, cliente.password);
    if (!coincide) {
      return res.status(400).json({ message: "Contraseña actual incorrecta ❌" });
    }

    const hashedPassword = await bcrypt.hash(passwordNueva, 10);
    await conn.query("UPDATE clientes SET password = ? WHERE idCli = ?", [hashedPassword, idCli]);

    res.json({ message: "Contraseña actualizada correctamente ✅" });
  } catch (error) {
    console.error("Error al cambiar la contraseña:", error);
    res.status(500).json({ message: "Error al cambiar la contraseña" });
  }
};

const buscarClienteFiltro = async (req, res) => {
  const { criterioFiltro } = req.body;

  try {
    const conn = await getConnection();
    let rows;

    // Si el nombre está vacío → devolver todos los clientes
    if (!criterioFiltro || criterioFiltro.trim() === "") {
      rows = await conn.query("SELECT idCli, nombreCli, apellido, email, direccion, email FROM clientes WHERE idTipoCli != 1;");
    } else {
      rows = await conn.query(
        `SELECT idCli, nombreCli, apellido, email, direccion, email
         FROM clientes
         WHERE (nombreCli LIKE CONCAT('%', ?, '%') OR email LIKE CONCAT('%', ?, '%'))
         AND idTipoCli != 1;`,
        [criterioFiltro]
      );
    }

    res.json(rows); // 🔹 respuesta unificada
  } catch (error) {
    console.error("Error al ejecutar la consulta SQL:", error);
    res.status(500).json({ message: "Error interno del servidor al buscar." });
  }
};

module.exports = { getAllClientes, registrarCliente, loginCliente, editarCliente, eliminarClientes, cambiarPassword , buscarClienteFiltro};