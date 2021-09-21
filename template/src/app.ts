import express, { json, urlencoded } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import responseTime from 'response-time';

const app = express();
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(helmet());
app.use(cors());
app.use(cookieParser());
app.use(responseTime());
process.env.NODE_ENV !== 'production' && app.use(morgan('development'));

app.use('*', (_, res) => res.status(404).json({ error: 'not found' }));

export default app;
