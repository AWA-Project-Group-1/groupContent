import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import reviewsRouter from './routers/reviewRouter.js';

dotenv.config();

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Use the reviews router for /reviews endpoint
app.use('/reviews', reviewsRouter);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
