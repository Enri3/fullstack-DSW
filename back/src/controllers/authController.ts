import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getConnection } from "../database";

export const getAllClientes = async (req: Request, res: Response): Promise<void> => {
  try {
    const conn = await getConnection();
    const rows: any[] = await conn.query(
      "SELECT idCli, nombreCli, apellido, email, direccion FROM clientes WHERE idTipoCli != 1"
    );
    res.json(rows);
  } catch (error: any) {
    console.error("Error al obtener clientes:", error.message || error);
    res.status(500).json({ message: "Error al obtener clientes" });
  }
};

export const registrarCliente = async (req: Request, res: Response): Promise<void> => {
  const { nombreCli, apellido, direccion, email, password } = req.body;

  if (!nombreCli || !email || !password || !direccion) {
    res.status(400).json({ message: "Faltan completar campos obligatorios" });
    return;
  }

  try {
    const conn = await getConnection();
    const existe: any[] = await conn.query("SELECT * FROM clientes WHERE email = ?", [email]);

    if (existe.length > 0) {
      res.status(400).json({ message: "El cliente ya existe" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await conn.query(
      "INSERT INTO clientes (nombreCli, apellido, direccion, email, password, idTipoCli) VALUES (?, ?, ?, ?, ?, ?)",
      [nombreCli, apellido, direccion, email, hashedPassword, 1]
    );

    res.json({ message: "Cliente registrado con éxito" });
  } catch (error: any) {
    console.error("Error en registrarCliente:", error.message || error);
    res.status(500).json({ message: "Error al registrar el cliente", detalle: error.message });
  }
};

export const loginCliente = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const conn = await getConnection();
    const rows: any[] = await conn.query("SELECT * FROM clientes WHERE email = ?", [email]);

    if (rows.length === 0) {
      res.status(400).json({ message: "El cliente ingresado no existe" });
      return;
    }

    const cliente = rows[0];
    const coincide = await bcrypt.compare(password, cliente.password);

    if (!coincide) {
      res.status(400).json({ message: "La contraseña ingresada es incorrecta" });
      return;
    }

    const token = jwt.sign(
      { id: cliente.idCli, nombreCli: cliente.nombreCli, tipo: cliente.idTipoCli },
      process.env.JWT_SECRET || "clave_secreta_super_segura",
      { expiresIn: "2h" }
    );

    res.json({ message: "Login exitoso", token, cliente });
  } catch (error: any) {
    console.error(error.message || error);
    res.status(500).json({ message: "Error al iniciar sesión" });
  }
};

export const editarCliente = async (req: Request, res: Response): Promise<void> => {
  const { idCli, nombreCli, apellido, direccion, email, password } = req.body;

  if (!idCli) {
    res.status(400).json({ message: "Falta el ID del cliente" });
    return;
  }

  try {
    const conn = await getConnection();
    let hashedPassword: string | undefined;

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
  } catch (error: any) {
    console.error("Error en editarCliente:", error.message || error);
    res.status(500).json({ message: "Error al actualizar el cliente" });
  }
};

export const eliminarClientes = async (req: Request, res: Response): Promise<void> => {
  const { ids } = req.body;

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    res.status(400).json({ message: "Debe enviar un array de IDs válido" });
    return;
  }

  try {
    const conn = await getConnection();
    const result: any = await conn.query("DELETE FROM clientes WHERE idCli IN (?)", [ids]);

    res.json({ message: `Se eliminaron ${result.affectedRows} clientes correctamente.` });
  } catch (error: any) {
    console.error("Error al eliminar clientes:", error.message || error);
    res.status(500).json({ message: "Error al eliminar clientes" });
  }
};

export const cambiarPassword = async (req: Request, res: Response): Promise<void> => {
  const { idCli, passwordAnterior, passwordNueva } = req.body;

  if (!idCli || !passwordAnterior || !passwordNueva) {
    res.status(400).json({ message: "Faltan datos requeridos" });
    return;
  }

  try {
    const conn = await getConnection();
    const rows: any[] = await conn.query("SELECT * FROM clientes WHERE idCli = ?", [idCli]);
    const cliente = rows[0];

    if (!cliente) {
      res.status(404).json({ message: "Cliente no encontrado" });
      return;
    }

    const coincide = await bcrypt.compare(passwordAnterior, cliente.password);
    if (!coincide) {
      res.status(400).json({ message: "Contraseña actual incorrecta ❌" });
      return;
    }

    const hashedPassword = await bcrypt.hash(passwordNueva, 10);
    await conn.query("UPDATE clientes SET password = ? WHERE idCli = ?", [hashedPassword, idCli]);

    res.json({ message: "Contraseña actualizada correctamente ✅" });
  } catch (error: any) {
    console.error("Error al cambiar la contraseña:", error.message || error);
    res.status(500).json({ message: "Error al cambiar la contraseña" });
  }
};

export const buscarClienteFiltro = async (req: Request, res: Response): Promise<void> => {
  const { criterioFiltro } = req.body;

  try {
    const conn = await getConnection();
    let rows: any[];

    if (!criterioFiltro || criterioFiltro.trim() === "") {
      rows = await conn.query(
        "SELECT idCli, nombreCli, apellido, email, direccion, email FROM clientes WHERE idTipoCli != 1;"
      );
    } else {
      rows = await conn.query(
        `SELECT idCli, nombreCli, apellido, email, direccion, email
         FROM clientes
         WHERE (nombreCli LIKE CONCAT('%', ?, '%') OR email LIKE CONCAT('%', ?, '%'))
         AND idTipoCli != 1;`,
        [criterioFiltro, criterioFiltro]
      );
    }

    res.json(rows);
  } catch (error: any) {
    console.error("Error al ejecutar la consulta SQL:", error.message || error);
    res.status(500).json({ message: "Error interno del servidor al buscar." });
  }
};