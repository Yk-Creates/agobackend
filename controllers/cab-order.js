import { CabOrder } from "../models/cab-order.js";
import jwt from "jsonwebtoken";
import Rate from "../models/rate.js";

export const bookCab = async (req, res) => {
  try {
    // Extract the token from headers
    const { token } = req.headers;

    // Extract necessary fields from the request body
    const {
      startLat,
      startLong,
      endLat,
      endLong,
      date,
      time,
      type,
      desc,
      model,
    } = req.body;

    // Check if the token is present
    if (!token) {
      return res.status(401).json({ message: "Token is required" });
    }

    // Verify and decode the token
    const decodedUser = jwt.verify(token, process.env.JWT_SECRET);

    // Ensure all required location fields are present
    if (!startLat || !startLong || !endLat || !endLong) {
      return res
        .status(400)
        .json({ message: "All location fields are required" });
    }

    // Validate the type field against the enum values
    const validTypes = ["CAB", "AMBULANCE", "COURRIER"];
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        message: `Type must be one of the following: ${validTypes.join(", ")}`,
      });
    }

    // Check if the date and time are provided, else use the current date and time
    const bookingDate = date || new Date().toISOString().split("T")[0]; // Default to current date if not provided
    const bookingTime =
      time || new Date().toISOString().split("T")[1].split(".")[0]; // Default to current time if not provided

    // Create the cab order
    const cabOrder = await CabOrder.create({
      user: decodedUser.userId,
      start: {
        latitude: startLat,
        longitude: startLong,
      },

      end: {
        latitude: endLat,
        longitude: endLong,
      },
      status: "REQUESTED", // Default status
      date: bookingDate,
      time: bookingTime,
      type: type, // Set the type for the start location
      desc: desc, // Set the description
      model: model,
    });

    // Send a success response with the created cab order
    res
      .status(201)
      .json({ message: "Cab order successfully created", cabOrder });
  } catch (error) {
    console.error(error);

    // Send an error response if something goes wrong
    res.status(500).json({
      message: "An error occurred while booking the cab",
      error: error.message,
    });
  }
};

export const getRate = async (req, res) => {
  try {
    const rates = await Rate.find();
    if (!rates) {
      return res.status(404).json({ message: "Rates not found" });
    }
    res.status(200).json(rates);
  } catch (error) {
    console.error("Error fetching rates:", error);
    res.status(500).json({ message: "Server Error" });
  }
};


