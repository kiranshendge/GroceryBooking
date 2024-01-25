import 'reflect-metadata';
import express, { json } from 'express';
import rootRouter from './routes';
import { PORT } from './secret';

const app = express();
app.use(json());

app.use('/api', rootRouter);
app.get('/', (req, res) => {
    res.json("working");
})

app.listen(PORT, () => {
    console.log('Listening to port', PORT);
})