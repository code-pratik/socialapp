import express, { Router } from "express";
import {
  getUserPosts,
  getFeedPosts,
  likePost,
  addComment,
  addCommentLike,
  deletePost,
} from "../controller/post.js";
import { verifyToken } from "../middleware/auth.js";

const routes = express.Router();

routes.get("/", verifyToken, getFeedPosts);
routes.get("/:userId/posts", verifyToken, getUserPosts);

routes.patch("/:id/like", verifyToken, likePost);
routes.patch("/:id/comment", verifyToken, addComment);
routes.patch("/:id/commentLike", verifyToken, addCommentLike);
routes.delete("/:id/deletePost", verifyToken, deletePost);

export default routes;
