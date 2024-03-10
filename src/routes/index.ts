import { Express } from "express";

import userController from "../controllers/user.controller";
import auth from "../middlewares/auth";
//import validateRole from "../middlewares/validateRole";
import validateSchema from "../middlewares/validateSchema";
import  userSchema  from "../schemas/user.schema";

const routes = (app: Express) => {
    app.get('/users', userController.getUsers);
    app.post('/users', validateSchema(userSchema), userController.create);
    app.put('/users/:id', userController.update );
    app.delete('/users/:id', userController.delete );
    app.get('/users/profile', auth, userController.findById);
    app.get('/users/:id', userController.findById);
    app.post('/login/', userController.login);
};

export default routes;