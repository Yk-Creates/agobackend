// routes/driverRoutes.js

import { Router } from "express";
import { createDriver, getDriverBookings, getDriverPastBookings, loginDriver, updateDriverStatus } from "../controllers/driver.js";

const router = Router();

// Route to register a new driver
router.post("/register", createDriver);

//to login driver 
router.post('/login', loginDriver);

// Route to update driver's status
router.put("/:driverId/status", updateDriverStatus);

// Route to fetch bookings assigned to a driver
router.get("/:driverId/bookings", getDriverBookings);

// Route to fetch past bookings assigned to a driver
router.get("/:driverId/past-bookings", getDriverPastBookings);

export default router;
