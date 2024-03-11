import express, {Express, Request, Response} from "express";
import dotenv from 'dotenv';
import {db} from './config/db';
import routes from "./routes";
import {createRoles, createEventTypes} from './libs/initialSetup';

const app: Express = express();
dotenv.config();
createRoles().catch(console.error);
createEventTypes().catch(console.error);

app.use(express.json());
app.use(express.urlencoded({extended:true}));

/**
 * The port number for the server.
 * If the `PORT` environment variable is set, it will use that value.
 * Otherwise, it will default to 3000.
 */
const port = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World');    
});


//Importamos routes
routes(app);

db.then( () => {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`)
        
    })
} );