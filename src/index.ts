import express, {Express, Request, Response} from "express";
import dotenv from 'dotenv';
const app: Express = express();
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

const port = process.env.PORT || 3000;

app.get('/', (req,res)=>{
    res.send('Hello World');
});

app.get('/aboutHola', (req,res)=>{
    res.send('About Us');
});

app.post('/about', (req,res)=>{
    res.send('name: '+ req.body.name);
})

app.listen(port,()=>{
    console.log('Server is running on port ' + port);
});