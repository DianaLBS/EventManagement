/**import { Request, Response, NextFunction } from "express";
import { UserDocument } from "../models/user.models"; // Asegúrate de importar el tipo correcto para `UserDocument`

interface RequestWithUser extends Request {
  user: UserDocument;
}

const validateRole = (role: string) => {
  return (req: RequestWithUser, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user || user.role !== role) {
      return res.status(403).json({ message: "Forbidden" });
    }

    next();
  };
};

export default validateRole;
**/
