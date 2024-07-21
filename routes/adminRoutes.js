import express from "express";
import {
  allDrivers,
  allotDriver,
  cabOrdersData,
  dashboardData,
  driverAvailableForOrders,
} from "../controllers/admin.js";

const router = express.Router();

router.route("/").get(dashboardData);
router.route("/cab-orders").get(cabOrdersData);
//remove the api below
router.route("/drivers-available").get(driverAvailableForOrders);
//
router.route("/drivers-cab-available").get(driverAvailableForOrders);

router.route("/drivers").get(allDrivers);
router.route("/drivers-allot").post(allotDriver);


export default router;
