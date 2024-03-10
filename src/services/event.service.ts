import { EventModel, EventDocument } from "../models/event.models";
import { UserDocument } from "../models/user.models";

/**
 * Service class for managing events.
 */
class EventService {
    /**
     * Creates a new event.
     * @param eventData - The data for the event.
     * @returns A promise that resolves to the created event.
     */
    public async createEvent(eventData: Partial<EventDocument>): Promise<EventDocument> {
        const event: EventDocument = await EventModel.create(eventData);
        return event;
    }

    /**
     * Retrieves all events.
     * @returns A promise that resolves to an array of events.
     */
    public async getAllEvents(filter:any[]): Promise<EventDocument[]> {
        const events: EventDocument[] = await EventModel.find(filter);
        return events;
    }

    /**
     * Retrieves an event by its ID.
     * @param id - The ID of the event.
     * @returns A promise that resolves to the event, or null if not found.
     */
    public async getEventById(id: string): Promise<EventDocument | null> {
        const event: EventDocument | null = await EventModel.findById(id);
        return event;
    }

    /**
     * Updates an event.
     * @param id - The ID of the event to update.
     * @param eventData - The updated data for the event.
     * @returns A promise that resolves to the updated event, or null if not found.
     * @throws An error if the event is not found.
     */
    public async updateEvent(id: string, eventData: Partial<EventDocument>): Promise<EventDocument | null> {
        const event: EventDocument | null = await EventModel.findById(id);

        if (!event) {
            throw new Error("Event not found");
        }

        const updatedEvent: EventDocument | null = await EventModel.findByIdAndUpdate(id, eventData, { new: true });
        return updatedEvent;
    }

    /**
     * Deletes an event.
     * @param id - The ID of the event to delete.
     * @returns A promise that resolves when the event is deleted.
     * @throws An error if the user is not authorized to delete the event.
     */
    public async deleteEvent(id: string): Promise<void> {
        const event: EventDocument | null = await EventModel.findById(id);

        if (!event) {
            throw new Error("Event not found");
        }

        await EventModel.findByIdAndDelete(id);
    }
}

export default new EventService();