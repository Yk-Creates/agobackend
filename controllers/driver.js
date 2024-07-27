// controllers/driver.js

import jwt from 'jsonwebtoken'; // Import the jsonwebtoken library
import mongoose from 'mongoose';
import { CabOrder } from "../models/cab-order.js";
import { Driver } from "../models/driver.js";

// Create a new driver
export const createDriver = async (req, res) => {
  try {
    const {
      name,
      phone,
      carNumber,
      drivingLicense,
      aadhaarCard,
      employmentType,
      carType,
      carModel,
      carYear,
      status,
      password
    } = req.body;

    // Validate required fields
    if (!name || !phone || !carNumber || !drivingLicense || !aadhaarCard || !employmentType || !carType || !carModel || !carYear || status === undefined || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check for duplicate phone, carNumber, drivingLicense, or aadhaarCard
    const existingDriver = await Driver.findOne({
      $or: [
        { phone },
        { carNumber },
        { drivingLicense },
        { aadhaarCard }
      ]
    });

    if (existingDriver) {
      return res.status(409).json({ error: 'Driver with given phone, car number, driving license, or aadhaar card already exists' });
    }

    // Create new driver instance
    const newDriver = new Driver({
      name,
      phone,
      carNumber,
      drivingLicense,
      aadhaarCard,
      employmentType,
      carType,
      carModel,
      carYear,
      status,
      password // Save the password in plain text
    });

    // Save the new driver to database
    await newDriver.save();

    // Respond with the newly created driver and success message
    res.status(201).json({
      message: 'Driver creation successful',
      driver: newDriver
    });
  } catch (error) {
    // Handle validation errors
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({ error: error.message });
    }
    // Handle other errors
    console.error('Error creating driver:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const loginDriver = async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({ error: 'Phone number and password are required' });
    }

    // Find driver by phone number
    const driver = await Driver.findOne({ phone });
    if (!driver) {
      return res.status(401).json({ error: 'Invalid phone number or password' });
    }

    // Check password (assuming plain text comparison)
    if (password !== driver.password) {
      return res.status(401).json({ error: 'Invalid phone number or password' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: driver._id.toString() }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({
      message: 'Login successful',
      token,
      driver: {
        id: driver._id.toString(),
        name: driver.name,
        phone: driver.phone,
        carNumber: driver.carNumber,
        carModel: driver.carModel,
        carYear: driver.carYear,
        carType: driver.carType,
        status: driver.status,
        driverType: driver.driverType,
      },
    });
  } catch (error) {
    console.error('Error logging in driver:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Update driver's status
export const updateDriverStatus = async (req, res) => {
  try {
    const { driverId } = req.params;
    const { status } = req.body;

    console.log('Received status:', status); // Add this line to log the received status

    if (status === undefined) {
      return res.status(400).json({ message: "Status is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(driverId)) {
      return res.status(400).json({ message: "Invalid driver ID format" });
    }

    const driver = await Driver.findByIdAndUpdate(
      driverId,
      { status },
      { new: true, runValidators: true }
    );

    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    res.status(200).json({ message: "Driver status updated successfully", driver });
  } catch (error) {
    console.error('Error updating driver status:', error);
    res.status(500).json({ message: "Server error", error });
  }
};


// Get all bookings for a driver
export const getDriverBookings = async (req, res) => {
  try {
    const { driverId } = req.params;

    // Validate driverId
    if (!driverId) {
      return res.status(400).json({ message: "Driver ID is required" });
    }

    // Find all bookings assigned to the driver
    const bookings = await CabOrder.find({ driver: driverId }).populate('user').populate('driver');

    if (!bookings.length) {
      return res.status(404).json({ message: "No bookings found for this driver" });
    }

    res.status(200).json({ message: "All bookings retrieved successfully", bookings });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getDriverProfile = async (req, res) => {
  try {
    const driverId = req.params.id;
    const driver = await Driver.findById(driverId).select('-password'); // Exclude password field

    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    res.status(200).json(driver);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


