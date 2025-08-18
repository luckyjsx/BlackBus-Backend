
import { z } from 'zod';

export const busRouteSchema = z.object({
  routeNumber: z.string().min(1, 'Route number is required'),
  routeName: z.string().min(1, 'Route name is required'),
  startLocation: z.string().min(1, 'Start location is required'),
  endLocation: z.string().min(1, 'End location is required'),
  distance: z.number().positive('Distance must be a positive number'),
  estimatedTime: z.number().positive('Estimated time must be a positive number'),
  stops: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid stop ID')), // MongoDB ObjectId
  status: z.enum(['active', 'inactive']).optional().default('active'),
});

export type BusRouteInput = z.infer<typeof busRouteSchema>;
