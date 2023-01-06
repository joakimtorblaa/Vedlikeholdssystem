import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import locationRoutes from "./routes/locations.js";
import taskRoutes from "./routes/tasks.js";
import notificationRoutes from "./routes/notifications.js";
import { register } from "./controllers/auth.js";
import { newLocation, uploadFileLocation } from "./controllers/locations.js";
import { newTask, uploadFileTask } from "./controllers/task.js";
import { newNotification } from "./controllers/notifications.js";
import { setFileFolderLocation, setFileFolderTask } from "./middleware/filefolder.js";
import * as fs from 'fs';

/* CONFIGURATION */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();

const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin"}));
app.use(morgan("common"));
app.use(bodyParser.json({limit: "30mb", extended: true}));
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, 'public/assets')));

/* FILE STORAGE */
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let path = 'public/assets/' + req.imagesFolder + '/';
        
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path)
        }
        file.path = path;
        cb(null, path);
        
    },
    filename: function (req, file, cb) {
        cb(null,   Date.now()+ '-' + file.originalname);
    }
});

const upload = multer({ storage });

const locationMiddleware = (req, res, next) => {
    let path = 'public/assets/locations/location_header/'
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path)
    }
    req.imagesFolder = 'locations/location_header';
    next();
}

const userMiddleware = (req, res, next) => {
    let path = 'public/assets/users/'
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path)
    }
    req.imagesFolder = 'users';
    next();
}

/* POST */
app.post("/tasks/new", upload.none(), newTask);
app.post("/notifications", upload.none(), newNotification);

/* ROUTES WITH FILES */
app.post("/auth/register", userMiddleware, upload.single("picture"), register);
app.post("/locations/newLocation", locationMiddleware, upload.single("picture"), newLocation);
app.patch("/locations/:id/newFile", setFileFolderLocation, upload.single("file"), uploadFileLocation);
app.patch("/tasks/:id/newFile/:fullname", setFileFolderTask, upload.single('file'), uploadFileTask);

/* ROUTES */
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/locations", locationRoutes);
app.use("/tasks", taskRoutes);
app.use("/notifications", notificationRoutes);

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 6001;
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    app.listen(PORT, "192.168.50.10", () => console.log(`Server Port: ${PORT}`));
}).catch((error) => console.log(`${error} did not connect`));