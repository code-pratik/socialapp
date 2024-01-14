import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import multer from "multer";
import mongoose from "mongoose";
import helmet, { crossOriginResourcePolicy } from "helmet";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import cors from "cors";
import { register } from "./controller/auth.js";
import authroutes from "./routes/authroutes.js";
import userroutes from "./routes/userroutes.js";
import postroutes from "./routes/postroutes.js";
import { verifyToken } from "./middleware/auth.js";
import { createPost } from "./controller/post.js";
import { posts, users } from "./data/index.js";
import User from "./models/User.js";
import Post from "./models/post.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();

const app = express();
app.use(express.json());
app.use(helmet());
app.use(crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

//file storage

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/assets");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

export const upload = multer({ storage });
app.post("/auth/register", upload.single("picture"), register);
app.post("/posts", verifyToken, upload.single("picture"), createPost);
app.use("/auth", authroutes);
app.use("/users", userroutes);
app.use("/posts", postroutes);

// mongoose setup

const PORT = process.env.PORT || 6001;
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log("server started");
      // User.insertMany(users);
      // Post.insertMany(posts);
    });
  })
  .catch((err) => {
    console.log(err);
  });
