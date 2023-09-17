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
// import { getCall } from "./controllers/authController.js";
import * as authController from "./controllers/authController.js";
import * as postController from "./controllers/postController.js";
import authRoutes from './routes/auth_route.js';
import userRoutes from './routes/user_route.js';
import postRoutes from './routes/post_route.js';
import { verifyToken } from "./middleware/auth.js";

import User from './models/User.js';
import Post from "./models/Post_model.js";
import { users, posts } from './data/mockData.js';

/*  CONFIGURATIONS */
const __filename = fileURLToPath(import.meta.url);
const __dirName = path.dirname(__filename);

dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirName, 'public/assets')));

/* File Storage */
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/assets');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});
const upload = multer({ storage });

/* Routes with files */
app.post('/auth/register', upload.single("picture"), authController.register);
app.post('/post', verifyToken, upload.single("picture"), postController.createPost);

/* Routes */
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/post", postRoutes);

/* Mongoose setup  */
const PORT = process.env.PORT || 3001;
// const MO_URL = 'mongodb://127.0.0.1:27017/sociopedia' || process.env.MO_URL;
const MO_URL = 'mongodb+srv://prabhupedia:dummypassword@cluster0.f6te6s3.mongodb.net/?retryWrites=true&w=majority' ;
mongoose.connect(MO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log(process.env.PORT, process.env.MO_URL);
    app.listen(PORT, () => console.log(`Prabhupedia connected in Port : ${PORT}`));

    /* Add data on time */
    // User.insertMany(users);
    // Post.insertMany(posts);
}).catch((error) => {
    console.log(`${error} - ${MO_URL} did not connect`);
})

// mongoose
//     .connect(MO_URL).then(res =>{
//         app.listen(PORT, () => console.log(`Server Port  : ${PORT}`));
//     })
//     .catch (error => console.log('Err in DB connection :' + JSON.stringify(error, undefined, 2)));

// mongoose.connect('mongodb://localhost:27017/CrudDB');
// app.listen(PORT, () => console.log(`Server Port  : ${PORT}`));