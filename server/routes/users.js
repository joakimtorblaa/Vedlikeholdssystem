import express from "express";
import {
    getUser,
    getUsers,
    getUserTeam,
    getUserType,
    addRemoveTeam,
} from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/", verifyToken, getUsers);
router.get("/:id", verifyToken, getUser);
router.get("/:id/userType", verifyToken, getUserType);
router.get("/:id/team", verifyToken, getUserTeam);
/* UPDATE */
router.patch("/:userId1/:userid2", verifyToken, addRemoveTeam);

export default router;