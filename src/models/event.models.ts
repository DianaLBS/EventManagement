import mongoose, { Document, Schema } from 'mongoose';

/**
 * Represents the input data for creating an event.
 */
export interface EventInput {
    /**
     * The title of the event.
     */
    title: string;
    
    /**
     * The description of the event.
     */
    description: string;
    
    /**
     * The date of the event.
     */
    date: string;
    
    /**
     * The time of the event.
     */
    time: string;
    
    /**
     * The location of the event.
     */
    location: string;
    
    /**
     * Optional array of registration IDs associated with the event.
     */
    registrations?: mongoose.Types.ObjectId[];
}

// Define the document structure for mongoose, includes both Event and mongoose.Document properties
export interface EventDocument extends EventInput, mongoose.Document {
    createdAt: Date;
    upDatedAt: Date;
    deletedAt: Date; 
    createdBy: mongoose.Types.ObjectId;
    
}

/**
 * Represents the schema for an event in the application.
 */
const EventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    location: { type: String, required: true },
    eventType: { ref: "Type", type: mongoose.Schema.Types.ObjectId, required: true },
    createdBy: { ref: "User", type: mongoose.Schema.Types.ObjectId },
    registrations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Registration' }], // Nuevo campo para inscripcioness
}, { timestamps: true });

// Create the model in db
const EventModel = mongoose.model<EventDocument>('Event', EventSchema);

export { EventModel };
