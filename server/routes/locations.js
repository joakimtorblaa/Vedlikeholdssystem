import express from "express";
import { 
    getLocation, 
    getLocations, 
    getLocationFiles, 
    deleteFileLocation
} from "../controllers/locations.js";

import { verifyToken } from "../middleware/auth.js";


const router = express.Router();

/* READ */
router.get("/:id", verifyToken, getLocation);
router.get("/", verifyToken, getLocations);
router.get("/:id/locationFiles", verifyToken, getLocationFiles);
router.patch("/:id/:fileIndex", verifyToken, deleteFileLocation);

export default router;