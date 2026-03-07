import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const verificarToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Token no proporcionado" });
  }

  const token = authHeader.split(" ")[1]!;

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "clave_vivelas"
    );

    (req as any).usuario = decoded;

    next();
  } catch (error) {
    return res.status(403).json({ message: "Token inválido o expirado" });
  }
};