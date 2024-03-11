import mongoose, { model } from "mongoose";

const typeSchema = new mongoose.Schema({
    name: {type: String, required: true},
}, {versionKey: false} );


export default model("Type", typeSchema);