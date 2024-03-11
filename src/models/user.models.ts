import mongoose, { model } from "mongoose";

export interface UserInput {
    name: string;
    email: string; 
    password: string;
    roles: string[];
    registrations?: mongoose.Types.ObjectId[];
}

export interface UserDocument extends UserInput, mongoose.Document {
    createdAt: Date;
    upDatedAt: Date;
    deletedAt: Date; 
}

const userSchema = new mongoose.Schema<UserDocument>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    roles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true }],
    registrations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Registration' }], // Nuevo campo para inscripciones
  }, { timestamps: true, collection: 'users' });


const User = mongoose.model<UserDocument>("User", userSchema);

export default User;