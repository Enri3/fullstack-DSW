import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../db/connection.js";

export const registrarCliente = async (req, res) => {
  const { nombre, apellido, direccion, email, password } = req.body;

  if (!nombre || !email || !password)
    return res.status(400).json({ message: "Faltan completar campos obligatorios" });

  try {
    const [existe] = await pool.query("SELECT * FROM clientes WHERE email = ?", [email]);
    if (existe.length > 0) return res.status(400).json({ message: "El cliente que se intenta registrar ya existe" });

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      "INSERT INTO clientes (nombre, apellido, direccion, email, password, idTipoCli) VALUES (?, ?, ?, ?, ?, ?)",
      [nombre, apellido, direccion, email, hashedPassword, 1] // tipoCliente "Inicial"
    );

    res.json({ message: "Cliente registrado con éxito" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al registrar el cliente" });
  }
};

export const loginCliente = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await pool.query("SELECT * FROM clientes WHERE email = ?", [email]);
    if (rows.length === 0) return res.status(400).json({ message: "Cliente ingresado no ha sido encontrado" });

    const cliente = rows[0];
    const coincide = await bcrypt.compare(password, cliente.password);
    if (!coincide) return res.status(400).json({ message: "La contraseña ingresada es incorrecta" });

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