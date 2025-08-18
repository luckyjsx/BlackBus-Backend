
import BusRoute from '@src/model/bus-routes/bus-routes';
import BusStop from '@src/model/bus-routes/bus-stops';
import { Request, Response } from 'express';
import { busRouteSchema } from '@src/schemas/bus-routes/bus-routes.schema';

const createBusRoute = async (req: Request, res: Response) => {
  try {
    // ✅ Validate request body
    const parsed = busRouteSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const {
      routeNumber,
      routeName,
      startLocation,
      endLocation,
      distance,
      estimatedTime,
      stops,
      status,
    } = parsed.data;

    // ✅ Optional: Ensure all stop IDs exist
    const stopDocs = await BusStop.find({ _id: { $in: stops } });

    if (stopDocs.length !== stops.length) {
      return res.status(400).json({
        message: 'One or more stop IDs are invalid',
      });
    }

    // ✅ Create and save the bus route
    const newRoute = new BusRoute({
      routeNumber,
      routeName,
      startLocation,
      endLocation,
      distance,
      estimatedTime,
      stops,
      status,
    });

    const savedRoute = await newRoute.save();

    return res.status(201).json({
      message: 'Bus route created successfully',
      data: savedRoute,
    });
  } catch (error) {
    console.error('Error creating bus route:', error);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};



export  {createBusRoute};
