import mongoose, { Document, Schema } from 'mongoose';

// Define the structure of the event data in the database
interface Event {
    title: string;
    description: string;
    date: Date;
    time: string;
    location: string;
}

// Define the document structure for mongoose, includes both Event and mongoose.Document properties
interface EventDocument extends Event, Document {}

// Define the schema that will be used for data validation
const EventSchema = new Schema<EventDocument>({
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    location: { type: String, required: true },
     
});

// Create the model in db
const EventModel = mongoose.model<EventDocument>('Event', EventSchema);

export { Event, EventDocument, EventModel };
