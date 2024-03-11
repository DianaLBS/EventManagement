import { Request, Response, NextFunction } from "express";
import jwt, { TokenExpiredError } from "jsonwebtoken";
import User from "../models/user.models";
import Role from "../models/role.models";

const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let token = req.headers.authorization;

        if (!token) {
            return res.status(401).json({ message: "Not authorized" });
        }

        token = token.replace("Bearer ", "");
        const decode: any = jwt.verify(token, process.env.JWT_SECRET || "secret");
        req.body.loggedUser = decode;
        req.params.id = decode.user_id;

        next();

    } catch (error) {
        if (error instanceof TokenExpiredError)
            return res.status(401).json({ message: "Token Expired", error });
        else
            return res.status(401).json({ message: "Token Invalid", error });
    }
};

const verifyRole = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const roles = await Role.find({ _id: { $in: user.roles } });
    
        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === "organizer") {
            next();
            return;
          }
        }
        return res.status(403).json({ message: "Require organizer Role" });

    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error });
    }
};

export { auth, verifyRole };
