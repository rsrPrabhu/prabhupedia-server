import express from "express";
import { verifyToken } from "../middleware/auth.js";
import * as UserController from  '../controllers/userController.js'

const router = express.Router();

/* Read */
router.get("/:id" , verifyToken , UserController.getUser);
router.get("/:id/friends" , verifyToken , UserController.getUserFriends);

/* Update */
router.patch("/:id/:friendId" , verifyToken , UserController.addRemoveFriend);


export default router;