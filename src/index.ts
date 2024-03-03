import 'reflect-metadata';
import express, {Request, Response, NextFunction, json } from 'express';
import rootRouter from './routes';
import { PORT } from './secret';
import errorHandler  from './exceptions/index';

const app = express();
app.use(json());
app.use('/api', rootRouter);
app.get('/', (req, res) => {
    res.json("working");
})

errorHandler(app);

app.listen(PORT, () => {
    console.log('Listening to port', PORT);
})