import mongoose, { Document, Schema } from 'mongoose';

// Define the structure of the event data in the database
export interface EventInput {
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    
}

// Define the document structure for mongoose, includes both Event and mongoose.Document properties
export interface EventDocument extends EventInput, mongoose.Document {
    createdAt: Date;
    upDatedAt: Date;
    deletedAt: Date; 
    
}

// Define the schema that will be used for data validation
const EventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    location: { type: String, required: true },
    eventType: { ref: "Type", type: mongoose.Schema.Types.ObjectId, required: true },
    createdBy: { ref: "User", type: mongoose.Schema.Types.ObjectId, required: true },
}, { timestamps: true });

// Create the model in db
const EventModel = mongoose.model<EventDocument>('Event', EventSchema);

export { EventModel };
