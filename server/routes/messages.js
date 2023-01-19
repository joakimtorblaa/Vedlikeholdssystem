import express from "express";
import { getAllUnread, getChatMessages } from "../controllers/chat.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/:id", verifyToken, getChatMessages);
router.get("/allUnread/:id", verifyToken, getAllUnread);

export default router;