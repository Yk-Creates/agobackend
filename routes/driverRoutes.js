// routes/driverRoutes.js

import { Router } from "express";
import { createDriver, getDriverBookings, getDriverPastBookings, getTodayBookings, loginDriver, updateDriverStatus } from "../controllers/driver.js";

const router = Router();

// Route to register a new driver
router.post("/register", createDriver);

//to login driver 
router.post('/login', loginDriver);

// Route to update driver's status
router.put("/:driverId/status", updateDriverStatus);

// Route to get today's bookings for a driver
router.get('/bookings/today/:driverId', getTodayBookings);

// Route to get all bookings for a driver
router.get('/bookings/all/:driverId', getDriverBookings);

// Route to get past bookings for a driver
router.get('/bookings/past/:driverId', getDriverPastBookings);



export default router;
