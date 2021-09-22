import express, { json, urlencoded } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import responseTime from 'response-time';
import xssClean from 'xss-clean';

const app = express();
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(helmet());
app.use(cors());
app.use(cookieParser());
app.use(responseTime());
app.use(xssClean());
process.env.NODE_ENV !== 'production' && app.use(morgan('development'));

app.use('*', (_, res) => res.status(404).json({ error: 'not found' }));
app.use((_, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.removeHeader('X-Frame-Options');
  next();
});

app.set('showStackError', true);

export default app;
