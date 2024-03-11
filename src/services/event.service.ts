import { EventModel, EventDocument , EventInput} from "../models/event.models";
import { Registration   } from "../models/eventRegistration.model";


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
        try {
            const event = await EventModel.findById(id);
            return event;
        } catch(error) {
            throw error;
        }
    }

    /**
     * Updates an event.
     * @param id - The ID of the event to update.
     * @param eventData - The updated data for the event.
     * @returns A promise that resolves to the updated event, or null if not found.
     * @throws An error if the event is not found.
     */
    public async updateEvent(id: string, eventInput:EventInput): Promise<EventDocument | null> {
        try {
            const event: EventDocument | null = await EventModel.findOneAndUpdate({_id: id}, eventInput, {
                returnOriginal: false
            });
            return event;
        } catch(error) {
            throw error;
        }
    }

    /**
     * Deletes an event.
     * @param id - The ID of the event to delete.
     * @returns A promise that resolves when the event is deleted.
     * @throws An error if the user is not authorized to delete the event.
     */
    public async deleteEvent(id: string): Promise<EventDocument | null> {
        try { 
            return await EventModel.findOneAndDelete({_id: id});
        } catch(error) {
            throw error;
        }
    }

    /**
     * Registra a un usuario para un evento.
     * @param userId - El ID del usuario que se va a registrar.
     * @param eventId - El ID del evento al que se va a registrar el usuario.
     * @returns La inscripción creada.
     */
    public async registerUserForEvent(userId: string, eventId: string) {
        const registrationData = { user: userId, event: eventId };
        const registration = await Registration.create(registrationData);
        return registration;
    }

    /**
     * Obtiene los eventos en los que está inscrito un usuario.
     * @param userId - El ID del usuario para el que se van a buscar los eventos inscritos.
     * @returns Una lista de eventos en los que está inscrito el usuario.
     */
    public async getRegisteredEventsByUserId(userId: string) {
        const registrations = await Registration.find({ user: userId }).populate('event');
        const registeredEvents = registrations.map(registration => registration.event);
        return registeredEvents;
    }

    /**
     * Obtiene una lista de asistentes para un evento.
     * @param eventId - El ID del evento para el que se van a buscar los asistentes.
     * @returns Una lista de usuarios inscritos en el evento.
     */
    public async getAttendeesForEvent(eventId: string) {
        const registrations = await Registration.find({ event: eventId }).populate('user');
        const attendees = registrations.map(registration => registration.user);
        return attendees;
    }

    
}

export default new EventService();