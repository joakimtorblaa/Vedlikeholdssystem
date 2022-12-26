import express from "express";
import { getTask, getTasks, getLocationTasks } from "../controllers/task.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* GET */
router.get("/", verifyToken, getTasks);
router.get("/:id", verifyToken, getTask);
router.get("/locationId/:id", verifyToken, getLocationTasks);
export default router;