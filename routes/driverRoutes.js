import { Router } from "express";
import { createDriver, deleteDriverById, getAllDrivers } from "../controllers/drivers.js";

const router = Router();

router.route('/register').post(createDriver)
router.route('/getAll').get(getAllDrivers);
router.route('/drivers/:id').delete(deleteDriverById);

export default router;
