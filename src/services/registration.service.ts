import {Registration} from "../models/eventRegistration.model";

class RegistrationService {
    // Otros métodos del servicio aquí...

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

export default new RegistrationService();
