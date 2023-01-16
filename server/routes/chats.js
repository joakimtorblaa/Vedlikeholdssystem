import express from "express";
import { getChatUsers, getUserChats } from "../controllers/chat.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/:id/users", verifyToken, getChatUsers);
router.get("/:id", verifyToken, getUserChats);

export default router;