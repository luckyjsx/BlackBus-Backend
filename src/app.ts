import express from 'express';
import { config } from 'dotenv';
import connectToDatabase from './config/databaseConnection';
import bodyParser from 'body-parser';
import busRoutes from './routes/bus-routes';
import busStopRoutes from './routes/bus-stops';
import authRoutes from './routes/auth';

config();
connectToDatabase();
const app = express();
const port = process.env.PORT || 3000;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.json());

app.use('/api/v1/bus', busRoutes);
app.use('/api/v1/bus-stop', busStopRoutes);
app.use('/api/v1/auth', authRoutes);

app.get('/', (_req, res) => {
  res.send('Server is up and running!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
