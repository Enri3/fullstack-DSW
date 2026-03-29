import { Request, Response, NextFunction } from "express";

export const verificarAdmin = (req: Request, res: Response, next: NextFunction) => {
  const usuario = (req as any).usuario;

  if (!usuario) {
    return res.status(401).json({ message: "Token no proporcionado o inválido" });
  }

  if (usuario.tipo !== 1) {
    return res.status(403).json({ message: "Acceso denegado: solo administradores permitidos" });
  }

  next();
};
