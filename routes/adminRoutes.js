import express from "express";
import {
  allDrivers,
  allotDriver,
  AmbulanceOrdersData,
  cabOrdersData,
  changePrice,
  dashboardData,
  driverAvailableForOrders,
  updateRate,
} from "../controllers/admin.js";

const router = express.Router();

router.route("/").get(dashboardData);
router.route("/cab-orders").get(cabOrdersData);
//remove the api below
router.route("/drivers-available").get(driverAvailableForOrders);
//

router.route("/drivers-cab-available").get(driverAvailableForOrders);
router.route("/ambulance-orders").get(AmbulanceOrdersData);
router.route("/drivers").get(allDrivers);
router.route("/drivers-allot").post(allotDriver);

// router.route("/update-rates").patch(updateRate);
router.route("/update-price").patch(changePrice);

router.route("/update-rates").patch(updateRate);

export default router;
