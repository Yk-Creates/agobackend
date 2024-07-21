import express from 'express';
import { createDriver, getDriverBookings, getDriverPastBookings, updateDriverStatus } from '../controllers/driver.js';


const router = express.Router();

// Route to register a new driver
router.route('/register').post(createDriver)


// Route to update driver's status
router.put('/driver/:driverId/status', updateDriverStatus);

// Route to fetch bookings assigned to a driver
router.get('/driver/:driverId/bookings', getDriverBookings);

// Route to fetch past bookings assigned to a driver
router.get('/driver/:driverId/past-bookings', getDriverPastBookings);

export default router;
