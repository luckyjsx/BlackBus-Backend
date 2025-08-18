import { z } from "zod";

export const createCitySchema = z.object({
  name: z.string().min(1),
  state: z.string().min(1),
  country: z.string().min(1),
  aliases: z.array(z.string()).optional(),
  popularity: z.number().optional(),
});

export const searchCitiesSchema = z.object({
  query: z.string().min(2, "Query must be at least 2 characters"),
  limit: z
    .union([z.string().regex(/^\d+$/), z.undefined()])
    .transform(val => (val ? parseInt(val, 10) : undefined))
    .optional(),
});
