import { Request, Response } from "express";
import userService from "../services/user.service";
import Role from "../models/role.models";
import { UserDocument, UserInput } from "../models/user.models";
import bcrypt from "bcrypt";

/**
 * Controller for user management.
 */
class UserController {
    
    /**
     * Creates a new user.
     * 
     * @param {Request} req - The HTTP request object.
     * @param {Response} res - The HTTP response object.
     * @returns {Promise<Response>} The HTTP response with the created user.
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
     * Gets all users.
     * 
     * @param req - The HTTP request.
     * @param res - The HTTP response.
     * @returns A JSON response with all the found users.
     */
    public async getUsers(req: Request, res: Response) {

        try {
            const users = await userService.findAll(); // It has to wait for this to finish before continuing
            res.json(users);        
        } catch(error) {
            return res.status(500).json(error)
        }
    }

    /**
     * Finds a user by its ID.
     * 
     * @param req - The HTTP request object.
     * @param res - The HTTP response object.
     * @returns An HTTP response with the found user or an error message if not found.
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
     * Updates an existing user.
     * 
     * @param {Request} req - The HTTP request object.
     * @param {Response} res - The HTTP response object.
     * @returns {Promise<Response>} - A promise that resolves to the HTTP response with the updated user.
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
     * Deletes a user by its ID.
     * 
     * @param req - The HTTP request.
     * @param res - The HTTP response.
     * @returns A JSON response with the message "User has been deleted" if the user was successfully deleted.
     *          If the user is not found, a JSON response with the message "User not found" is returned.
     *          If an error occurs during the process, a JSON response with the status code 500 and the error is returned.
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
     * Performs user login.
     * 
     * @param req - The HTTP request containing the user login data.
     * @param res - The HTTP response to be sent to the client.
     * @returns A JSON object containing the authentication token if the login is successful, or an error message if it is not.
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

export default new UserController();
