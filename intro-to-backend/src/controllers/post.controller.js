import { Post } from "../models/post.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

// CREATE POST
export const CreatePost = async (req, res, next) => {
  try {
    const { name, description, age } = req.body;

    if (!name || !description || !age) {
      return next(new ApiError(400, "All fields are required"));
    }

    const create = await Post.create({
      name,
      description,
      age,
      user: req.user.id
    });

    res.status(201).json(new ApiResponse(201, create, "Post created successfully"));
  } catch (error) {
    next(error);
  }
};

// GET ALL POSTS
export const GetPost = async (req, res, next) => {
  try {
    const posts = await Post.find().populate("user", "username email");

    if (!posts || posts.length === 0) {
      return next(new ApiError(404, "No posts found"));
    }

    res.status(200).json(new ApiResponse(200, posts, "Posts fetched successfully"));
  } catch (error) {
    next(error);
  }
};

// GET LOGGED-IN USER'S POSTS
export const GetLoginUserPost = async (req, res, next) => {
  try {
    const posts = await Post.find({ user: req.user.id }).populate("user", "username email");

    if (!posts || posts.length === 0) {
      return next(new ApiError(404, "No posts found for this user"));
    }

    res.status(200).json(new ApiResponse(200, posts, "User posts fetched successfully"));
  } catch (error) {
    next(error);
  }
};

// UPDATE POST
export const UpdatePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);

    if (!post) {
      return next(new ApiError(404, "Post not found"));
    }

    if (post.user.toString() !== req.user.id.toString()) {
      return next(new ApiError(403, "Not authorized to update this post"));
    }

    const updatedPost = await Post.findByIdAndUpdate(id, req.body, { returnDocument: "after" });

    res.status(200).json(new ApiResponse(200, updatedPost, "Post updated successfully"));
  } catch (error) {
    next(error);
  }
};

// DELETE POST
export const DeletePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);

    if (!post) {
      return next(new ApiError(404, "Post not found"));
    }

    if (post.user.toString() !== req.user.id.toString()) {
      return next(new ApiError(403, "Not authorized to delete this post"));
    }

    const deletedPost = await Post.findByIdAndDelete(id);

    res.status(200).json(new ApiResponse(200, deletedPost, "Post deleted successfully"));
  } catch (error) {
    next(error);
  }
};
