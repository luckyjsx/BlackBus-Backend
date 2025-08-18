
import { z } from 'zod';

export const coordinatesSchema = z.object({
  lat: z.number(),
  lng: z.number(),
});

export const busStopSchema = z.object({
  stop_name: z.string().min(1, 'Stop name is required'),
  arrival_time: z.coerce.date(),
  departure_time: z.coerce.date(),
  coordinates: coordinatesSchema,
});

export type BusStopInput = z.infer<typeof busStopSchema>;
