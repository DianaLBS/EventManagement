import { Request, Response, NextFunction } from "express";
import jwt, { TokenExpiredError } from "jsonwebtoken";

const auth  =  async (req: Request, res: Response, next: NextFunction) => {
    try { 
        let token =  req.headers.authorization;

        if (!token){
            return res.status(401).json({message: "Not authorized"});
        }

        token = token.replace("Bearer ","");
        const  decode: any = jwt.verify(token, process.env.JWT_SECRET || "secret"); 
        req.body.loggedUser =  decode;
        req.params.id = decode.user_id;

        //return res.status(200).json(decode);
        next();
        
    } catch(error) {
        if (error instanceof TokenExpiredError)
            return res.status(401).json({message: "Token Expired", error });
        else 
            return res.status(401).json({message: "Token Invalid", error });
    }
}

export default auth;