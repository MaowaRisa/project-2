import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';
import router from './app/routes';
import cookieParser from 'cookie-parser';
const app: Application = express();
// const port = 3000

// Parsers
app.use(express.json());
app.use(cookieParser())
app.use(cors({origin:['http://localhost:5173']}));

// application routes
app.use('/api/v1', router);
const test = async (req: Request, res: Response) => {
  const a = 10;
  // Promise.reject();
  res.send(a);
};
app.get('/', test);
// middleware for error handling
app.use(globalErrorHandler);
// Not found
app.use(notFound);

export default app;
