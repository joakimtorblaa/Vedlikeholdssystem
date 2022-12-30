import express from "express";
import { getTask, getTasks, getLocationTasks, updateTask } from "../controllers/task.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* GET */
router.get("/", verifyToken, getTasks);
router.get("/:id", verifyToken, getTask);
router.get("/locationId/:id", verifyToken, getLocationTasks);

/* PATCH */
router.patch("/:id/:status/:fullname", verifyToken, updateTask);
export default router;