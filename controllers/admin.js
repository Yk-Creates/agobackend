import { CabOrder } from "../models/cab-order.js";

import moment from "moment";
import { Driver } from "../models/driver.js";

export const dashboardData = async (req, res) => {
  try {
    // Get the start and end of the current day
    const startOfDay = moment().startOf("day").toDate();
    const endOfDay = moment().endOf("day").toDate();

    // Find all orders within the date range
    const orders = await CabOrder.find({
      createdAt: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });
    const cabOrdersNumber = orders.length;

    // Count cab orders within the date range
    const cabOrdersCount = await CabOrder.countDocuments({
      type: "CAB",
      createdAt: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });

    // Count ambulance orders within the date range
    const ambulanceOrdersCount = await CabOrder.countDocuments({
      type: "AMBULANCE",
      createdAt: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });

    // Find the 5 most recent orders
    const fiveMostRecentOrders = await CabOrder.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user driver");

    return res.status(200).json({
      cabOrders: cabOrdersCount,
      ambulanceOrders: ambulanceOrdersCount,
      fiveMostRecentOrders,
    });
  } catch (error) {
    console.log("error in admin dashboard data controller:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const cabOrdersData = async (req, res) => {
  try {
    const orders = await CabOrder.find({ type: "CAB" })
      .populate("user")
      .sort({ createdAt: -1 })
      .populate("driver");

    return res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching cab orders:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const AmbulanceOrdersData = async (req, res) => {
  try {
    const orders = await CabOrder.find({ type: "AMBULANCE" })
      .populate("user")
      .sort({ createdAt: -1 })
      .populate("driver");

    return res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching cab orders:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const driverAvailableForOrders = async (req, res) => {
  try {
    const drivers = await Driver.find({ status: true }).select(
      "_id name carNumber phone"
    );
    return res.status(200).json(drivers);
  } catch (error) {
    console.error("Error fetching drivers:", error);
    return res.status(500).json({ error: error.message });
  }
};

export const allDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find();
    return res.status(200).json(drivers);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const allotDriver = async (req, res) => {
  try {
    const { cabOrderId, driverId } = req.body;
    console.log(cabOrderId, driverId);
    // Validate cabOrderId and driverId
    if (!cabOrderId || !driverId) {
      return res
        .status(400)
        .json({ message: "Cab Order ID and Driver ID are required" });
    }

    const cabOrder = await CabOrder.findById(cabOrderId);

    // Check if the cab order exists
    if (!cabOrder) {
      return res.status(404).json({ message: "Cab Order not found" });
    }

    // Check if the driver exists (assuming you have a Driver model)
    const driver = await Driver.findById(driverId);
    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    // Update the cab order
    cabOrder.status = "ACCEPTED";
    cabOrder.driver = driverId;
    await cabOrder.save();
    const finalResponse = await CabOrder.findById(cabOrderId).populate(
      "driver"
    );
    return res.status(200).json({ message: "Driver Alloted", finalResponse });
  } catch (error) {
    console.error("Error allotting driver:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateRate = async (req, res) => {
  const { carType, perKilometerRate } = req.body;

  try {
    // Validate input
    if (!carType || !perKilometerRate) {
      return res
        .status(400)
        .json({ message: "Car type and rate are required" });
    }

    // Check if the car type is valid
    if (!["small", "medium", "large"].includes(carType)) {
      return res.status(400).json({ message: "Invalid car type" });
    }

    // Find and update the rate for the given car type
    const updatedRate = await Rate.findOneAndUpdate(
      { carType },
      { perKilometerRate },
      { new: true, runValidators: true }
    );

    // If the car type does not exist, return a 404 error
    if (!updatedRate) {
      return res.status(404).json({ message: "Rate not found" });
    }

    // Return the updated rate
    res.status(200).json(updatedRate);
  } catch (error) {
    console.error("Error updating rate:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const changePrice = async (req, res) => {
  try {
    const { price, id } = req.body;

    // Validate the input
    if (!price || !id) {
      return res.status(400).json({ message: "Price and ID are required" });
    }

    // Find the cab order by ID
    const cabOrder = await CabOrder.findById(id);

    if (!cabOrder) {
      return res.status(404).json({ message: "Cab order not found" });
    }

    // Update the fare
    cabOrder.fare = price;
    await cabOrder.save();

    res.status(200).json({ message: "Price changed successfully", cabOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
