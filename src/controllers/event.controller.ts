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
            console.log(req.params.idevent)
            console.log(event)
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
         * Endpoint for users to register for an event.
         * @param req - The HTTP request object.
         * @param res - The HTTP response object.
         * @returns The updated event with the new registration.
         */
        public async registerForEvent(req: Request, res: Response) {
            try {
                const userId = req.params.id; // Get the authenticated user ID from the token
                const eventId = req.params.eventId; // Get the event ID from the route parameters
                const registration = await registrationService.registerUserForEvent(userId, eventId);
                // Update the user with the new registration
                await User.findByIdAndUpdate(userId, { $push: { registrations: registration._id } });

                // Update the event with the new registration
                await EventModel.findByIdAndUpdate(eventId, { $push: { registrations: registration._id } });
                return res.status(200).json(registration);
            } catch (error) {
                return res.status(500).json(error);
            }
        }

        /**
         * Endpoint for users to see the events they are registered for.
         * @param req - The HTTP request object.
         * @param res - The HTTP response object.
         * @returns A list of events the user is registered for.
         */
        public async getRegisteredEvents(req: Request, res: Response) {
            try {
                const userId = req.params.id; // Get the authenticated user ID from the token
                const registeredEvents = await registrationService.getRegisteredEventsByUserId(userId);
                return res.status(200).json(registeredEvents);
            } catch (error) {
                return res.status(500).json(error);
            }
        }

        /**
         * Endpoint for organizers to see a list of attendees for their events.
         * @param req - The HTTP request object.
         * @param res - The HTTP response object.
         * @returns A list of users registered for the organizer's event.
         */
        public async getAttendeesForEvent(req: Request, res: Response) {
            try {
                const eventId = req.params.eventId; // Get the event ID from the route parameters
                const attendees = await registrationService.getAttendeesForEvent(eventId);
                return res.status(200).json(attendees);
            } catch (error) {
                return res.status(500).json(error);
            }
        }
    }

export default new EventController();
