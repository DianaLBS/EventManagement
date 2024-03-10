import UserModel, {UserInput, UserDocument} from "../models/user.models";
import jwt from "jsonwebtoken";

class UserService {

    public async create(userInput: UserInput ): Promise<UserDocument> {
        try {
            const users = await UserModel.create(userInput);
            return users;
        } catch(error) {
            throw error;
        }
    }
    
    public async findByEmail(email: any): Promise<UserDocument | null> {
        try {
            const user = await UserModel.findOne({email: email}); 
            return user;  
        } catch(error) {
            throw error;
        }
    }

    public async findAll(): Promise<UserDocument[]> {
        try {
            const users = await UserModel.find();
            return users;
        } catch(error) {
            throw error;
        }
    }


    public async update(id: string, userInput: UserInput): Promise<UserDocument | null> {
        try {
            const user: UserDocument | null = await UserModel.findOneAndUpdate({_id: id}, userInput, {
                returnOriginal: false
            });
            return user;
        } catch(error) {
            throw error;
        }
    }

    public async findById(id: string): Promise<UserDocument | null> {
        try {
            const user = await UserModel.findById(id);
            return user;
        } catch(error) {
            throw error;
        }
    }

    public async delete(id: string): Promise<UserDocument | null> {
        try { 
            return await UserModel.findOneAndDelete({_id: id});
        } catch(error) {
            throw error;
        }
    }

    public generateToken(user: UserDocument): string {
        try { 
            return jwt.sign({user_id: user.id, email:user.email}, 
                process.env.JWT_SECRET || "secret",
                {expiresIn: "5m"});
        } catch(error) {
            throw error;
        }
    }

}

export default new UserService();   