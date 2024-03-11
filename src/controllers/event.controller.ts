import { Request, Response } from "express";
import { EventDocument } from "../models/event.models";
import eventService from "../services/event.service";
import Type from "../models/type.models";
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

            if (!eventType) {
                return res.status(400).json({ error: 'Event type not found' });
            }

            const event: EventDocument = await eventService.createEvent({
                ...req.body,
                eventType: eventType._id
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
            const eventExists: EventDocument | null = await eventService.getEventById(req.params.idevent);

            if (!eventExists) {
                return res.status(404).json({ message: "Event not found" });
            }

            const  event : EventDocument | null = await eventService.deleteEvent(req.params.idevent);
            return res.status(200).json({ message: "Event has been deleted {event}" });
        } catch (error) {
            return res.status(500).json(error);
        }
    }
}

export default new EventController();
