import { Request, Response } from "express";
import { UserDocument } from "../models/user.models";
import { EventModel, EventDocument } from "../models/event.models";
import EventService from "../services/event.service"; // Import the EventService class using default import

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
            const event: EventDocument = await EventModel.create(req.body);
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
          const { date, location, type } = req.query;
      
        let filter: any = {};

        if (date) {
            filter.date = date;
        }

        if (location) {
            filter.location = location;
        }

        if (type) {
            filter.type = type;
        }

        const events: EventDocument[] = await EventService.getAllEvents(filter);
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
            const event: EventDocument | null = await EventModel.findById(req.params.id);
            if (!event) {
                return res.status(404).json({ message: "Event not found" });
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
            const eventExists: EventDocument | null = await EventModel.findById(req.params.id);

            if (!eventExists) {
                return res.status(404).json({ message: "Event not found" });
            }

            const event: EventDocument | null = await EventModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
            return res.status(200).json(event);
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
            const eventExists: EventDocument | null = await EventModel.findById(req.params.id);

            if (!eventExists) {
                return res.status(404).json({ message: "Event not found" });
            }

            await EventModel.findByIdAndDelete(req.params.id);
            return res.status(200).json({ message: "Event has been deleted" });
        } catch (error) {
            return res.status(500).json(error);
        }
    }
}

export default new EventController();
