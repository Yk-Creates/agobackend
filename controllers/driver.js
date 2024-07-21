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


export const updateDriverStatus = async (req, res) => {
    try {
      const { driverId } = req.params;
      const { status } = req.body;
  
      // Validate status field
      if (status === undefined) {
        return res.status(400).json({ message: "Status is required" });
      }
  
      // Find driver by ID and update status
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
      res.status(500).json({ message: "Server error", error });
    }
  };


  export const getDriverBookings = async (req, res) => {
    try {
      const { driverId } = req.params;
  
      // Validate driverId
      if (!driverId) {
        return res.status(400).json({ message: "Driver ID is required" });
      }
  
      // Find bookings assigned to the driver
      const bookings = await CabOrder.find({ driver: driverId }).populate('user').populate('driver');
  
      if (!bookings) {
        return res.status(404).json({ message: "No bookings found for this driver" });
      }
  
      res.status(200).json({ message: "Bookings retrieved successfully", bookings });
    } catch (error) {
      console.error("Error fetching bookings:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };


  export const getDriverPastBookings = async (req, res) => {
    try {
      const { driverId } = req.params;
      const currentDate = new Date();
  
      // Validate driverId
      if (!driverId) {
        return res.status(400).json({ message: "Driver ID is required" });
      }
  
      // Find past bookings assigned to the driver
      const pastBookings = await CabOrder.find({
        driver: driverId,
        date: { $lt: currentDate }
      }).populate('user').populate('driver');
  
      if (!pastBookings.length) {
        return res.status(404).json({ message: "No past bookings found for this driver" });
      }
  
      res.status(200).json({ message: "Past bookings retrieved successfully", pastBookings });
    } catch (error) {
      console.error("Error fetching past bookings:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  routes.js