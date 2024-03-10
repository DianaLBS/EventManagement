import { Request, Response } from "express";
import userService from "../services/user.service";
import Role from "../models/role.models";
import { UserDocument, UserInput } from "../models/user.models";
import bcrypt from "bcrypt";

class userController {
    
    public async create(req: Request, res: Response){
        try {
            const userExists: UserDocument | null = await userService.findByEmail(req.body.email);

            req.body.password = await bcrypt.hash(req.body.password, 10);

            if(userExists){
                return res.status(400).json({message: "User already exists"});
            }
            const foundRole = await Role.find({name:{$in: req.body.roles}})
            if(foundRole.length === 0){
                return res.status(400).json({message: "Role isn't valid"});
            }
            req.body.roles= foundRole.map(role => role._id);

            const user: UserDocument = await userService.create(req.body as UserInput)
            return res.status(201).json(user);

        } catch(error) {
            return res.status(500).json(error)
        }
    }

    public async getUsers(req: Request, res: Response) {

        try {
            const users = await userService.findAll(); //Tiene que esperar que esto termine para continuar
            res.json(users);        
        } catch(error) {
            return res.status(500).json(error)
        }
    }

    public async findById(req: Request, res: Response){
        try {
            const user: UserDocument | null = await userService.findById(req.params.id);
            
            if(!user){
                return res.status(404).json({message: "User not found"});
            }

            return res.status(200).json(user)
        } catch(error) {
            return res.status(500).json(error)
        }
    }

    public async update(req: Request, res: Response){
        try {
            const userExists: UserDocument | null = await userService.findById(req.params.id);

            if(!userExists){
                return res.status(404).json({message: "User not found"});
            }

            const updateUser: UserDocument | null = await userService.update(req.params.id, req.body);

            return res.status(200).json(updateUser)
            
        } catch(error) {
            return res.status(500).json(error)
        }
    }

    public async delete(req: Request, res: Response){
        try {

            const userExists: UserDocument | null = await userService.findById(req.params.id);

            if(!userExists){
                return res.status(404).json({message: "User not found"});
            }

            const  user : UserDocument | null = await userService.delete(req.params.id);

            return res.status(200).json("User has been deleted {user}");
        } catch(error) {
            return res.status(500).json(error)
        }
    }

    public async login(req: Request, res: Response){
        try {
            const userExists: UserDocument | null = await userService.findByEmail(req.body.email);

            if(!userExists){
                return res.status(401).json({message: "User not found"});
            }

            const isMatch:boolean  = await bcrypt.compare(req.body.password, userExists.password);

            if(!isMatch){
                return res.status(401).json({message: "Incorrect password"});
            }
            
            return res.status(200).json( userService.generateToken(userExists));

        } catch(error) {
            return res.status(500).json(error)
        }
    }

}

export default new userController();