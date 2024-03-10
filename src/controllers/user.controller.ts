import { Request, Response } from "express";
import userService from "../services/user.service";
import Role from "../models/role.models";
import { UserDocument, UserInput } from "../models/user.models";
import bcrypt from "bcrypt";

/**
 * Controlador para la gestión de usuarios.
 */
class userController {
    
    /**
     * Crea un nuevo usuario.
     * 
     * @param {Request} req - El objeto de solicitud HTTP.
     * @param {Response} res - El objeto de respuesta HTTP.
     * @returns {Promise<Response>} La respuesta HTTP con el usuario creado.
     */
    /**
     * Crea un nuevo usuario.
     * 
     * @param req - El objeto Request que contiene los datos de la solicitud.
     * @param res - El objeto Response utilizado para enviar la respuesta.
     * @returns Una respuesta JSON con el usuario creado o un mensaje de error.
     */
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

    /**
     * Obtiene todos los usuarios.
     * 
     * @param req - La solicitud HTTP.
     * @param res - La respuesta HTTP.
     * @returns Una respuesta JSON con todos los usuarios encontrados.
     */
    public async getUsers(req: Request, res: Response) {

        try {
            const users = await userService.findAll(); //Tiene que esperar que esto termine para continuar
            res.json(users);        
        } catch(error) {
            return res.status(500).json(error)
        }
    }

    /**
     * Busca un usuario por su ID.
     * 
     * @param req - El objeto de solicitud HTTP.
     * @param res - El objeto de respuesta HTTP.
     * @returns Una respuesta HTTP con el usuario encontrado o un mensaje de error si no se encuentra.
     */
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

    /**
     * Actualiza un usuario existente.
     * 
     * @param {Request} req - El objeto de solicitud HTTP.
     * @param {Response} res - El objeto de respuesta HTTP.
     * @returns {Promise<Response>} - Una promesa que resuelve en la respuesta HTTP con el usuario actualizado.
     */
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

    /**
     * Elimina un usuario por su ID.
     * 
     * @param req - La solicitud HTTP.
     * @param res - La respuesta HTTP.
     * @returns Una respuesta JSON con el mensaje "User has been deleted" si el usuario se eliminó correctamente.
     *          Si el usuario no se encuentra, se devuelve una respuesta JSON con el mensaje "User not found".
     *          Si ocurre un error durante el proceso, se devuelve una respuesta JSON con el código de estado 500 y el error.
     */
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

    /**
     * Realiza el inicio de sesión de un usuario.
     * 
     * @param req - La solicitud HTTP que contiene los datos de inicio de sesión del usuario.
     * @param res - La respuesta HTTP que se enviará al cliente.
     * @returns Un objeto JSON que contiene el token de autenticación si el inicio de sesión es exitoso, o un mensaje de error si no lo es.
     */
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