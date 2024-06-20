import mongoose from 'mongoose';
import { Driver } from '../models/driver.js';

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
      status
    } = req.body;

    // Validate required fields
    if (!name || !phone || !carNumber || !drivingLicense || !aadhaarCard || !employmentType || !carType || !carModel || !carYear || status === undefined) {
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
      status
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


// Get all drivers
export const getAllDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find();
    res.status(200).json(drivers);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


// Delete a driver by ID
export const deleteDriverById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    const deletedDriver = await Driver.findByIdAndDelete(id);
    if (!deletedDriver) {
      return res.status(404).json({ error: 'Driver not found' });
    }

    res.status(200).json({ message: 'Driver deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
