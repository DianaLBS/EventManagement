import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.models";

interface RequestWithUser extends Request {
  user: any;
}

const authMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    // Obtén el token de autenticación del encabezado Authorization
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(403).json({ message: "Authentication token missing" });
    }

    // Verifica el token y obtén el payload
    const payload = jwt.verify(token, process.env.JWT_SECRET_KEY as string);

    // Busca al usuario en la base de datos
    const user = await User.findById(payload.id).populate('role');

    if (!user) {
      return res.status(403).json({ message: "Invalid authentication token" });
    }

    // Guarda el usuario en req.user
    req.user = user;

    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid authentication token" });
  }
};

export default authMiddleware;