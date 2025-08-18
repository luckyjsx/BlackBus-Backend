// routes/busStopRoutes.ts
import {Router} from 'express';
import validateRequest from '@src/middleware/validateRequest';
import { busStopSchema } from '@src/schemas/bus-routes/bus-stop.schema';
import { createBusStop, getAllBusStops, getBusStopById } from '@src/controller/bus-routes/bus-stops';

const router = Router();

// POST /api/bus-stops
router.post('/', validateRequest(busStopSchema),createBusStop);

// GET /api/bus-stops
router.get('/', getAllBusStops);

// GET /api/bus-stops/:id
router.get('/:id', getBusStopById);

export default router;
