import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../database";
import { Cliente } from "../entidades/cliente";
import axios from "axios";

const clienteRepo = AppDataSource.getRepository(Cliente);

export const getAllClientes = async (req: Request, res: Response): Promise<void> => {
  try {
    const clientes = await clienteRepo
      .createQueryBuilder("cliente")
      .select(["cliente.idCli", "cliente.nombreCli", "cliente.apellido", "cliente.email", "cliente.direccion", "cliente.idTipoCli"])
      .where("cliente.idTipoCli != :tipo", { tipo: 1 })
      .getMany();

    res.json(clientes);
  } catch (error: any) {
    console.error("Error al obtener clientes:", error.message || error);
    res.status(500).json({ message: "Error al obtener clientes" });
  }
};

export const registrarCliente = async (req: Request, res: Response): Promise<void> => {
  const { nombreCli, apellido, direccion, email, password, captcha } = req.body;

  if (!nombreCli || !email || !password || !direccion) {
    res.status(400).json({ message: "Faltan completar campos obligatorios" });
    return;
  }

  if (!captcha) {
    res.status(400).json({ message: "Captcha requerido" });
    return;
  }

  try {
    const captchaVerify = await axios.post(
      "https://www.google.com/recaptcha/api/siteverify",
      null,
      {
        params: {
          secret: "6LcId4wsAAAAAG7kuR7k-YkRvypmdG9t8VapFDV8",
          response: captcha,
        },
      }
    );

    if (!captchaVerify.data.success) {
      res.status(400).json({ message: "Captcha inválido" });
      return;
    }

    const existe = await clienteRepo.findOne({ where: { email } });

    if (existe) {
      res.status(400).json({ message: "El cliente ya existe" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const nuevo = clienteRepo.create({
      nombreCli,
      apellido,
      direccion,
      email,
      password: hashedPassword,
      idTipoCli: 2,
      creado_en: new Date(),
    });

    await clienteRepo.save(nuevo);

    const token = jwt.sign(
      { id: nuevo.idCli, nombreCli: nuevo.nombreCli, tipo: nuevo.idTipoCli },
      process.env.JWT_SECRET || "clave_secreta_super_segura",
      { expiresIn: "2h" }
    );

    res.json({ message: "Cliente registrado con éxito", token, cliente: nuevo });

  } catch (error: any) {
    console.error("Error en registrarCliente:", error.message || error);
    res.status(500).json({
      message: "Error al registrar el cliente",
      detalle: error.message,
    });
  }
};

export const loginCliente = async (req: Request, res: Response): Promise<void> => {
  const { email, password, captcha } = req.body;

  if (!captcha) {
    res.status(400).json({ message: "Captcha requerido" });
    return;
  }

  try {
    const captchaVerify = await axios.post(
      "https://www.google.com/recaptcha/api/siteverify",
      null,
      {
        params: {
          secret: "6LcId4wsAAAAAG7kuR7k-YkRvypmdG9t8VapFDV8",
          response: captcha,
        },
      }
    );

    if (!captchaVerify.data.success) {
      res.status(400).json({ message: "Captcha inválido" });
      return;
    }

    const cliente = await clienteRepo.findOne({ where: { email } });

    if (!cliente) {
      res.status(400).json({ message: "El mail ingresado no existe" });
      return;
    }

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
    const cliente = await clienteRepo.findOne({ where: { idCli } });
    if (!cliente) {
      res.status(404).json({ message: "Cliente no encontrado" });
      return;
    }

    if (password) {
      cliente.password = await bcrypt.hash(password, 10);
    }

    cliente.nombreCli = nombreCli;
    cliente.apellido = apellido;
    cliente.direccion = direccion;
    cliente.email = email;

    await clienteRepo.save(cliente);

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
    const result = await clienteRepo.delete(ids);
    const afectados = result.affected || 0;
    res.json({ message: `Se eliminaron ${afectados} clientes correctamente.` });
  } catch (error: any) {
    console.error("Error al eliminar clientes:", error.message || error);
    res.status(500).json({ message: "Error al eliminar clientes" });
  }
};

export const cambiarTipoClientes = async (req: Request, res: Response): Promise<void> => {
  const { ids, idTipoCli } = req.body;

  const idTipoClienteNumerico = Number(idTipoCli);
  if (!ids || !Array.isArray(ids) || ids.length === 0 || Number.isNaN(idTipoClienteNumerico)) {
    res.status(400).json({ message: "Debe enviar ids e idTipoCli validos" });
    return;
  }

  try {
    const result = await clienteRepo
      .createQueryBuilder()
      .update(Cliente)
      .set({ idTipoCli: idTipoClienteNumerico })
      .whereInIds(ids)
      .execute();

    const afectados = result.affected || 0;
    res.json({ message: `Se actualizo el tipo de ${afectados} clientes correctamente.` });
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : String(error);
    console.error("Error al cambiar tipo de clientes:", mensaje);
    res.status(500).json({ message: "Error al cambiar tipo de clientes" });
  }
};

export const cambiarPassword = async (req: Request, res: Response): Promise<void> => {
  const { idCli, passwordAnterior, passwordNueva } = req.body;

  if (!idCli || !passwordAnterior || !passwordNueva) {
    res.status(400).json({ message: "Faltan datos requeridos" });
    return;
  }

  try {
    const cliente = await clienteRepo.findOne({ where: { idCli } });
    if (!cliente) {
      res.status(404).json({ message: "Cliente no encontrado" });
      return;
    }

    const coincide = await bcrypt.compare(passwordAnterior, cliente.password);
    if (!coincide) {
      res.status(400).json({ message: "Contraseña actual incorrecta ❌" });
      return;
    }

    cliente.password = await bcrypt.hash(passwordNueva, 10);
    await clienteRepo.save(cliente);

    res.json({ message: "Contraseña actualizada correctamente ✅" });
  } catch (error: any) {
    console.error("Error al cambiar la contraseña:", error.message || error);
    res.status(500).json({ message: "Error al cambiar la contraseña" });
  }
};

export const buscarClienteFiltro = async (req: Request, res: Response): Promise<void> => {
  const { criterioFiltro } = req.body;

  try {
    let clientes;
    if (!criterioFiltro || criterioFiltro.trim() === "") {
      clientes = await clienteRepo
        .createQueryBuilder("cliente")
        .select(["cliente.idCli", "cliente.nombreCli", "cliente.apellido", "cliente.email", "cliente.direccion", "cliente.idTipoCli"])
        .where("cliente.idTipoCli != :tipo", { tipo: 1 })
        .getMany();
    } else {
      clientes = await clienteRepo
        .createQueryBuilder("cliente")
        .select(["cliente.idCli", "cliente.nombreCli", "cliente.apellido", "cliente.email", "cliente.direccion", "cliente.idTipoCli"])
        .where("cliente.idTipoCli != :tipo", { tipo: 1 })
        .andWhere("(cliente.nombreCli LIKE :q OR cliente.email LIKE :q)", { q: `%${criterioFiltro}%` })
        .getMany();
    }

    res.json(clientes);
  } catch (error: any) {
    console.error("Error al ejecutar la consulta SQL:", error.message || error);
    res.status(500).json({ message: "Error interno del servidor al buscar." });
  }
};