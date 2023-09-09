import express from "express";
import { verifyToken } from "../middleware/auth.js";
import * as postController from '../controllers/postController.js';

const router = express.Router();

/* Read */
router.get("/", verifyToken, postController.getFeedPosts);
router.get("/:userId/posts", verifyToken, postController.getUserPosts);

/* Update */
router.patch("/:id/like", verifyToken, postController.likePosts);

export default router;


