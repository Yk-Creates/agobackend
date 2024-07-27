// routes/driverRoutes.js

import { Router } from "express";
import { createDriver, getDriverBookings, getDriverProfile, loginDriver, updateDriverStatus } from "../controllers/driver.js";

const router = Router();

// Route to register a new driver
router.post("/register", createDriver);

//to login driver 
router.post('/login', loginDriver);

// Route to update driver's status
router.put("/:driverId/status", updateDriverStatus);

// Route to get all bookings for a driver
router.get('/bookings/all/:driverId', getDriverBookings);

// Route to get driver's profile information
router.get('/drivers/:id', getDriverProfile);





export default router;
