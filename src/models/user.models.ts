import mongoose, { model } from "mongoose";

/**
 * Represents the input data for creating a user.
 */
export interface UserInput {
    /**
     * The name of the user.
     */
    name: string;
    
    /**
     * The email address of the user.
     */
    email: string; 
    
    /**
     * The password of the user.
     */
    password: string;
    
    /**
     * The roles assigned to the user.
     */
    roles: string[];
    
    /**
     * The registrations made by the user.
     */
    registrations?: mongoose.Types.ObjectId[];
}

/**
 * Represents a User Document in the database.
 * Extends the UserInput interface and the mongoose.Document interface.
 */
export interface UserDocument extends UserInput, mongoose.Document {
    createdAt: Date;
    upDatedAt: Date;
    deletedAt: Date; 
}

/**
 * Represents the user schema for the MongoDB collection.
 */
const userSchema = new mongoose.Schema<UserDocument>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    roles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true }],
    registrations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Registration' }], // Nuevo campo para inscripciones
  }, { timestamps: true, collection: 'users' });


const User = mongoose.model<UserDocument>("User", userSchema);

export default User;