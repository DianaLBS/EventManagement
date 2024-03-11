import mongoose, { model } from "mongoose";

/**
 * Represents the schema for the 'type' collection in the database.
 */
const typeSchema = new mongoose.Schema({
    name: {type: String, required: true},
}, {versionKey: false} );


export default model("Type", typeSchema);