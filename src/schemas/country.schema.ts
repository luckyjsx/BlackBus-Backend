import { z } from 'zod';

export const createCountrySchema = z.object({
    name: z.string().min(1, "Country name is required"),
    availableLanguages: z.array(z.string()).min(1, "At least one language is required"),
});

export const updateCountrySchema = z.object({
    name: z.string().min(1, 'Country name is required').optional(),
    availableLanguages: z.array(z.string()).min(1, 'At least one language is required').optional(),
});

export const getCountryByIdSchema = z.object({
    id: z.string().min(1, 'Country ID is required'),
});

export const getLanguagesByCountrySchema = z.object({
    countryId: z.string().min(1, 'Country ID is required'),
});



