// controllers/busStopController.ts
import BusStop from '@src/model/bus-routes/bus-stops';
import { Request, Response } from 'express';

export const createBusStop = async (req: Request, res: Response) => {
  try {
    const busStop = new BusStop(req.body);
    const savedStop = await busStop.save();
    res.status(200).json(savedStop);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Failed to create bus stop', error });
  }
};

export const getAllBusStops = async (_req: Request, res: Response) => {
  try {
    const stops = await BusStop.find();
    res.status(200).json(stops);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch bus stops' });
  }
};

export const getBusStopById = async (req: Request, res: Response) => {
  try {
    const stop = await BusStop.findById(req.params.id);
    if (!stop) {
      return res.status(404).json({ message: 'Bus stop not found' });
    }
    return res.status(200).json(stop);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch bus stop' });
    return;
  }
};


