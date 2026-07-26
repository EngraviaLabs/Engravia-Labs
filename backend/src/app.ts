import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import routes from './routes/index';
import { errorHandler, notFound } from './middleware/error.middleware';

const app: Application = express();

app.use(helmet());
app.use(mongoSanitize());
app.use(cors({ origin: [process.env.FRONTEND_URL!, process.env.ADMIN_URL!], credentials: true, methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'] }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 200, standardHeaders: true, legacyHeaders: false }));
app.use('/api/payments/stripe/webhook', express.raw({ type: 'application/json' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(compression());
if (process.env.NODE_ENV !== 'production') app.use(morgan('dev'));

app.get('/health', (_req: Request, res: Response) => res.json({ status: 'ok', env: process.env.NODE_ENV }));
app.use('/api', routes);
app.use(notFound);
app.use(errorHandler);

export default app;
