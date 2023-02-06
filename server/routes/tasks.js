import express from "express";
import { getTask, getTasks, getLocationTasks, updateTask, addTaskComment, disableTask, getTaskComments, uploadFileTask, getTaskFiles, deleteTaskFile, addTaskCollaborator, getTaskHistory, removeTaskCollaborator, patchDescTask, patchTypeTask, patchDateTask } from "../controllers/task.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* GET */
router.get("/", verifyToken, getTasks);
router.get("/:id", verifyToken, getTask);
router.get("/locationId/:id", verifyToken, getLocationTasks);
router.get("/:id/comments", verifyToken, getTaskComments);
router.get("/:id/taskFiles", verifyToken, getTaskFiles);
router.get("/:id/history", verifyToken, getTaskHistory);

/* PATCH */
router.patch("/:id/status/:status/:fullname", verifyToken, updateTask);
router.patch("/:id/patchDesc/:title/:description", verifyToken, patchDescTask);
router.patch("/:id/patchType/:type", verifyToken, patchTypeTask);
router.patch("/:id/patchDate/:startDate/:deadline", verifyToken, patchDateTask);
router.patch("/:id/comments/:content/:postedBy", verifyToken, addTaskComment);
router.patch("/:id/:fileIndex", verifyToken, deleteTaskFile);
router.patch("/:id/disabled", verifyToken, disableTask);
router.patch("/:id/collaborators/:collaborators/new", verifyToken, addTaskCollaborator);
router.patch("/:id/collaborators/:collaborators/remove", verifyToken, removeTaskCollaborator)
export default router;