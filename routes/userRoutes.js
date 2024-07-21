import { Router } from "express";
import {
  getActiveRequests,
  getAllRequest,
  login,
  registerUser,
  userTest,
} from "../controllers/user.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(login);
router.route("/usertest").get(userTest);
router.route("/getactiverequests").get(getActiveRequests);
router.route("/getallrequests").get(getAllRequest);
export default router;
