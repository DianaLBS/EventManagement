import mongoose, { model } from "mongoose";

const roleSchema = new mongoose.Schema({
    name: {type: String, required: true},
}, {versionKey: false} );


export default model("Role", roleSchema);