import { Express } from "express";

import userController from "../controllers/user.controller";
import { auth, verifyRole } from "../middlewares/auth";
import  eventController  from "../controllers/event.controller";
import validateSchema from "../middlewares/validateSchema";
import  userSchema  from "../schemas/user.schema";
import  eventSchema  from "../schemas/event.schema";

/**
 * Registers all the routes for the application.
 * @param {Express} app - The Express application instance.
 */
const routes = (app: Express) => {
    app.get('/users', auth,userController.getUsers);
    app.post('/users', validateSchema(userSchema), userController.create);
    app.put('/users/:id',auth, userController.update );
    app.delete('/users/:id',auth, verifyRole, userController.delete );
    app.get('/users/profile',auth,verifyRole, userController.findById);
    app.get('/users/:id', auth, userController.findById);
    app.post('/login/', userController.login);
    //Events
    app.post('/event', auth,verifyRole, validateSchema(eventSchema), eventController.create);
    app.get('/event',auth, eventController.getEvents);
    app.get('/event/:idevent',auth, eventController.getById);
    app.put('/event/:idevent', auth,verifyRole, eventController.update);
    app.delete('/event/:idevent', auth,verifyRole, eventController.delete);
    //Register for event
    app.post("/event/:eventId/", auth, eventController.registerForEvent);
    app.get("/eventsRegistered", auth, eventController.getRegisteredEvents);
    app.get("/eventAttendees/:eventId", auth,verifyRole, eventController.getAttendeesForEvent);
    
};

export default routes;