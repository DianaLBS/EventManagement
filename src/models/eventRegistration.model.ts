import mongoose from "mongoose";


/**
 * Represents the input for creating an event registration.
 */
export interface EventRegistrationInput {
    user: mongoose.Types.ObjectId; // Referencia al ID del usuario
    event: mongoose.Types.ObjectId; // Referencia al ID del evento
}

/**
 * Represents a registration document that extends the EventRegistrationInput interface and the mongoose.Document interface.
 */
export interface RegistrationDocument extends EventRegistrationInput, mongoose.Document {
    
}

/**
 * Represents the registration schema for an event registration.
 */
const registrationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
});

// Create the model in db
const Registration = mongoose.model<RegistrationDocument>('Registration', registrationSchema);

export { Registration };

