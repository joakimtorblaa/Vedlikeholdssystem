import express from "express";
import { getTask, getTasks, getLocationTasks, updateTask, addTaskComment, disableTask, getTaskComments, uploadFileTask, getTaskFiles, deleteTaskFile } from "../controllers/task.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* GET */
router.get("/", verifyToken, getTasks);
router.get("/:id", verifyToken, getTask);
router.get("/locationId/:id", verifyToken, getLocationTasks);
router.get("/:id/comments", verifyToken, getTaskComments);
router.get("/:id/taskFiles", verifyToken, getTaskFiles);

/* PATCH */
router.patch("/:id/:status/:fullname", verifyToken, updateTask);
router.patch("/:id/comments/:content/:postedBy", verifyToken, addTaskComment);
router.patch("/:id/:fileIndex", verifyToken, deleteTaskFile);
router.patch("/:id/disabled", verifyToken, disableTask);
export default router;