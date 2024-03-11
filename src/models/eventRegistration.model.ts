import mongoose from "mongoose";


// Define the structure of the event data in the database
export interface EventRegistrationInput {
    user: mongoose.Types.ObjectId; // Referencia al ID del usuario
    event: mongoose.Types.ObjectId; // Referencia al ID del evento
}

// Define the document structure for mongoose, includes both Event and mongoose.Document properties
export interface RegistrationDocument extends EventRegistrationInput, mongoose.Document {
    
}

const registrationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
});

// Create the model in db
const Registration = mongoose.model<RegistrationDocument>('Registration', registrationSchema);

export { Registration };

