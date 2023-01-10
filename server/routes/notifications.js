import express from "express";
import { getUserNotifications, setAllOpenedNotifications, setOpenedNotification } from "../controllers/notifications.js";

import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/:id", verifyToken, getUserNotifications);

/* PATCH */
router.patch("/opened/:id", verifyToken, setOpenedNotification);
router.patch("/reciever/:id", verifyToken, setAllOpenedNotifications);

export default router;