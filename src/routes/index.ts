import { Express } from "express";

import userController from "../controllers/user.controller";
import { auth, verifyRole } from "../middlewares/auth";
import validateSchema from "../middlewares/validateSchema";
import userSchema from "../schemas/user.schema";

const routes = (app: Express) => {
    app.get('/users', auth,userController.getUsers);
    app.post('/users', validateSchema(userSchema), userController.create);
    app.put('/users/:id',auth, userController.update );
    app.delete('/users/:id',auth, verifyRole, userController.delete );
    app.get('/users/profile',auth,verifyRole, userController.findById);
    app.get('/users/:id', auth, userController.findById);
    app.post('/login/', userController.login);
};

export default routes;