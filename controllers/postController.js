import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import User from '../models/User.js';
import Post from '../models/Post_model.js';

const createPost = async (req, res) => {
    try {
        const { userId, description, picturePath } = req.body;
        const user = await User.findById(userId);

        const newPost = new Post({
            userId,
            firstName: user.firstName,
            lastName: user.lastName,
            location: user.location,
            description,
            userPicturePath: user.picturePath,
            picturePath,
            likes: {},
            comments: []
        });
        await newPost.save();

        const post = await Post.find();
        res.status(201).json(post);

    } catch (error) {
        res.status(409).json({ message: error.message })
    }
}

const getFeedPosts = async (req, res) => {
    try {
        const post = await Post.find();
        res.status(201).json(post);
        // res.status(200).json(user);

    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}
const getUserPosts = async (req, res) => {
    try {
        const { userId } = req.body;
        const post = await Post.find({ userId });
        res.status(201).json(post);

    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}
const likePosts = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;
        const post = await Post.findById({ id });
        const isLiked = post.likes.get(userId);

        if (isLiked) {
            post.likes.delete(userId);
        } else {
            post.likes.set(userId, true);
        }

        const updatedPost = await Post.findByIdAndUpdate(id,
            { likes: post.likes },
            { new: true }
        )
        
        res.status(200).json(updatedPost);

    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}


export { createPost, getFeedPosts, getUserPosts, likePosts };