import {Router} from "express";
import validateRequest from "@src/middleware/validateRequest";
import { busRouteSchema } from "@src/schemas/bus-routes/bus-routes.schema";
import { createBusRoute } from "@src/controller/bus-routes/bus-routes";

const router = Router();

// POST /bus-routes — create a new route
router.post("/bus-route", validateRequest(busRouteSchema), createBusRoute);

export default router;
