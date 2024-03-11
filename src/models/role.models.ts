import mongoose, { model } from "mongoose";

/**
 * Represents the schema for the role model.
 */
const roleSchema = new mongoose.Schema({
    name: {type: String, required: true},
}, {versionKey: false} );


export default model("Role", roleSchema);