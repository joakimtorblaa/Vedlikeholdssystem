import express from "express";
import { getUserNotifications, setOpenedNotification } from "../controllers/notifications.js";

import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/:id", verifyToken, getUserNotifications);

/* PATCH */
router.patch("/opened/:id", verifyToken, setOpenedNotification);

export default router;