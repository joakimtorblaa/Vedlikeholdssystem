import express from "express";
import { getChatMessages } from "../controllers/chat.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/:id", verifyToken, getChatMessages);

export default router;