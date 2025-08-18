import { Router } from "express";
import { searchCities, getPopularCities, createCity } from "@src/controller/bus-routes/city";
import validateRequest from "@src/middleware/validateRequest";
import { createCitySchema, searchCitiesSchema } from "@src/schemas/bus-routes/city";

const router = Router();

// Create a new city
router.post("/create-city", validateRequest(createCitySchema), createCity);

// Search cities with query and limit as query params
router.get("/search", validateRequest(searchCitiesSchema, "query"), searchCities);

// Get popular cities
router.get("/popular", getPopularCities);

export default router;
