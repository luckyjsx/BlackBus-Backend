import express from 'express';
import { config } from 'dotenv';
import connectToDatabase from './config/databaseConnection';
import bodyParser from 'body-parser';
import busRoutes from './routes/bus-routes';
import busStopRoutes from './routes/bus-stops';
import authRoutes from './routes/auth';
import countryRoutes from './routes/country';

config();
connectToDatabase();
const app = express();
const port = process.env.PORT ? Number(process.env.PORT) : 3000;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.json());

app.use('/api/v1/bus', busRoutes);
app.use('/api/v1/bus-stop', busStopRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/countries', countryRoutes);

app.get('/', (_req, res) => {
  res.send('Server is up and running!');
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port ${port}`);
});
