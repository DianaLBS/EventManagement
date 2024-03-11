import { Request, Response } from "express";
import { EventDocument, EventModel } from "../models/event.models";
import eventService from "../services/event.service";
import Type from "../models/type.models";
import registrationService from "../services/registration.service";
import User, { UserDocument } from "../models/user.models";
import userService from "../services/user.service";
/**
 * Controller for event management.
 */
class EventController {
    /**
     * Creates a new event.
     * 
     * @param req - The HTTP request object.
     * @param res - The HTTP response object.
     * @returns The HTTP response with the created event or an error in case of failure.
     */
    public async create(req: Request, res: Response) {
        try {

            const eventType = await Type.findOne({ name: req.body.eventType });
            const user: UserDocument | null = await userService.findById(req.params.id);

            if (!eventType) {
                return res.status(400).json({ error: 'Event type not found' });
            }

            const event: EventDocument = await eventService.createEvent({
                ...req.body,
                eventType: eventType._id,
                createdBy: user?._id
            });
            return res.status(201).json(event);
        } catch (error) {
            return res.status(500).json(error);
        }
    }

   
    /**
     * Gets events based on the provided query parameters.
     * 
     * @param req - The HTTP request object.
     * @param res - The HTTP response object.
     * @returns An HTTP response with the found events.
     */
    public async getEvents(req: Request, res: Response) {
        try {
            const { date, location, eventType } = req.query;
        
            let filter: any = {};

            if (date) {
                filter.date = date;
            }

            if (location) {
                filter.location = location;
            }

            if (eventType) {
                const eventTypeObj = await Type.findOne({ name: eventType });

                if (!eventTypeObj) {
                    return res.status(400).json({ error: 'Event type not found' });
                }

                filter.eventType = eventTypeObj._id;
            }

            const events: EventDocument[] = await eventService.getAllEvents(filter);
            return res.status(200).json(events);
        } catch (error) {
            return res.status(500).json(error);
        }
    }

    /**
     * Gets an event by its ID.
     * 
     * @param req - The HTTP request.
     * @param res - The HTTP response.
     * @returns An HTTP response with the found event or an error message if the event is not found.
     */
    public async getById(req: Request, res: Response) {
        try {
            const event: EventDocument | null = await eventService.getEventById(req.params.idevent);
            
            if (!event) {
                return res.status(404).json({ message: "Event not found getbyid" });
            }

            return res.status(200).json(event);
        } catch (error) {
            return res.status(500).json(error);
        }
    }

    /**
     * Updates an existing event.
     * 
     * @param req - The HTTP request object.
     * @param res - The HTTP response object.
     * @returns The HTTP response with the updated event.
     */
    public async update(req: Request, res: Response) {
        try {
            const event: EventDocument | null = await eventService.getEventById(req.params.idevent);
            
            if (!event) {
                return res.status(404).json({ message: "Event not found controller" });
            }

             // Verifica si el usuario que realiza la solicitud es el mismo que creó el evento
            if (event.createdBy.toString() !== req.params.id) {
                return res.status(403).json({ message: "You are not authorized to update this event" });
            }


            const updatedEvent: EventDocument | null = await eventService.updateEvent(req.params.idevent, req.body);
            return res.status(200).json(updatedEvent);
        } catch (error) {
            return res.status(500).json(error);
        }
    }

    /**
     * Deletes an event.
     * 
     * @param req - The HTTP request object.
     * @param res - The HTTP response object.
     * @returns A promise that resolves to an HTTP response object.
     */
    public async delete(req: Request, res: Response) {
        try {
            const event: EventDocument | null = await eventService.getEventById(req.params.idevent);

            if (!event) {
                return res.status(404).json({ message: "Event not found" });
            }

            if (event.createdBy.toString() !== req.params.id) {
                return res.status(403).json({ message: "You are not authorized to delete this event" });
            }

            const  deleteEvent : EventDocument | null = await eventService.deleteEvent(req.params.idevent);
            return res.status(200).json({ message: "Event has been deleted {event}" });
        } catch (error) {
            return res.status(500).json(error);
        }
    }

        /**
     * Endpoint para que los usuarios se inscriban en un evento.
     * @param req - El objeto de solicitud HTTP.
     * @param res - El objeto de respuesta HTTP.
     * @returns El evento actualizado con la nueva inscripción.
     */
        public async registerForEvent(req: Request, res: Response) {
            try {
                const userId = req.params.id; // Obtén el ID del usuario autenticado desde el token
                const eventId = req.params.eventId; // Obtén el ID del evento desde los parámetros de ruta
                const registration = await registrationService.registerUserForEvent(userId, eventId);
                // Actualiza el usuario con el nuevo registro
                await User.findByIdAndUpdate(userId, { $push: { registrations: registration._id } });

                // Actualiza el evento con el nuevo registro
                await EventModel.findByIdAndUpdate(eventId, { $push: { registrations: registration._id } });
                return res.status(200).json(registration);
            } catch (error) {
                return res.status(500).json(error);
            }
        }
    
        /**
         * Endpoint para que los usuarios vean los eventos en los que están inscritos.
         * @param req - El objeto de solicitud HTTP.
         * @param res - El objeto de respuesta HTTP.
         * @returns Una lista de eventos en los que está inscrito el usuario.
         */
        public async getRegisteredEvents(req: Request, res: Response) {
            try {
                const userId = req.params.id; // Obtén el ID del usuario autenticado desde el token
                const registeredEvents = await registrationService.getRegisteredEventsByUserId(userId);
                return res.status(200).json(registeredEvents);
            } catch (error) {
                return res.status(500).json(error);
            }
        }
    
        /**
         * Endpoint para que los organizadores vean una lista de asistentes para sus eventos.
         * @param req - El objeto de solicitud HTTP.
         * @param res - El objeto de respuesta HTTP.
         * @returns Una lista de usuarios inscritos en el evento del organizador.
         */
        public async getAttendeesForEvent(req: Request, res: Response) {
            try {
                const eventId = req.params.eventId; // Obtén el ID del evento desde los parámetros de ruta
                const attendees = await registrationService.getAttendeesForEvent(eventId);
                return res.status(200).json(attendees);
            } catch (error) {
                return res.status(500).json(error);
            }
        }
    
}

export default new EventController();
