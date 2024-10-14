import express, { Request, Response} from 'express';
import cors from 'cors';
import bookRoute from './handlers/book';
import { errorHandler } from './middlewares/error';

const app = express();

// body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false}));

// cors
app.use(cors());

app.get('/', (req:Request, res:Response) => {
  res.status(200).json({ success: true, message: 'Welcome to the Book API' });
})

app.use('/api/books', bookRoute);
app.use(errorHandler)

export default app;