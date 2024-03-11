import { Express } from "express";

import userController from "../controllers/user.controller";
import auth from "../middlewares/auth";
import eventController from "../controllers/event.controller";
//import validateRole from "../middlewares/validateRole";
import validateSchema from "../middlewares/validateSchema";
import  userSchema  from "../schemas/user.schema";
import  eventSchema  from "../schemas/event.schema";

const routes = (app: Express) => {
    app.get('/users', userController.getUsers);
    app.post('/users', validateSchema(userSchema), userController.create);
    app.put('/users/:id', userController.update );
    app.delete('/users/:id', userController.delete );
    app.get('/users/profile', auth, userController.findById);
    app.get('/users/:id', userController.findById);
    app.post('/login/', userController.login);
    //Events
    app.post('/event', auth, validateSchema(eventSchema), eventController.create);
    app.get('/event', eventController.getEvents);
    app.get('/event/:id', eventController.getById);
    app.put('/event/:idevent', auth, eventController.update);
    app.delete('/event/:idevent', auth, eventController.delete);
    
};

export default routes;