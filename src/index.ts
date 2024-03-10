import express, {Express, Request, Response} from "express";
import dotenv from 'dotenv';
import {db} from './config/db';
import routes from "./routes";

const app: Express = express();
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

const port = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World');    
});

app.get('/about', (req: Request, res: Response) => {
    res.send('About Us');
});

app.post('/about', (req: Request, res: Response) => {
    res.send('name: ' + req.body.name);
});

//Importamos routes
routes(app);

db.then( () => {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`)
        
    })
} );