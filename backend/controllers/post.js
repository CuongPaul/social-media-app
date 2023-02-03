import Post from "../models/Post";
import React from "../models/React";
import { postDataFilter } from "../utils/filter-data";
import { sendNotification } from "../utils/send-notification";

const reactPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId)
            .populate("react")
            .populate("user");

        if (!post) {
            return res.status(404).json({ message: "Post doesn't exist" });
        }

        const key = req.query.key;
        const indexUserId = post.react[key].indexOf(req.user_id);

        indexUserId === -1
            ? post.react[key].push(req.user_id)
            : post.react[key].splice(indexUserId, 1);

        await post.save();

        await sendNotification({
            req,
            key: "react-post",
            content: `${post.user.name} ${key} your post`,
        });

        res.status(200).json({ message: "Successfully" });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const createPost = async (req, res) => {
    const { body, text, images, privacy } = req.body;

    if ((!images || !images.length) && (!text || !text.trim().length)) {
        return res
            .status(422)
            .json({ message: "Post image or write something" });
    }

    try {
        const emptyReact = new React({
            wow: [],
            sad: [],
            like: [],
            love: [],
            haha: [],
            angry: [],
        });
        const saveEmptyReact = await emptyReact.save();

        const newPost = new Post({
            body,
            text,
            images,
            privacy,
            user: req.user_id,
            react: saveEmptyReact.id,
        });
        const savePost = await newPost.save();

        await sendNotification({
            req,
            key: "new-post",
            content: `${savePost.user.name} has created new post`,
        });

        res.status(201).json({ message: "Successfully" });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);

        if (!post) {
            return res.status(404).json({ message: "Post is not exists" });
        }

        await Message.deleteOne({ id: post.id });

        res.status(200).json({ message: "Successfully" });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const updatePost = async (req, res) => {
    const { body, text, images, privacy } = req.body;

    if ((!images || !images.length) && (!text || !text.trim().length)) {
        return res
            .status(422)
            .json({ message: "Post image or write something" });
    }

    try {
        const post = await Post.findById(req.params.postId);

        if (!post) {
            return res.status(404).json({ message: "Post is not exists" });
        }

        post.body = body;
        post.content = text;
        post.images = images;
        post.privacy = privacy;
        post.save();

        res.status(200).json({ message: "Successfully" });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const getAllPosts = async (req, res) => {
    const limit = 5;
    const page = parseInt(req.query.page) || 0;

    try {
        const posts = await Post.find()
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(page * limit)
            .populate("user")
            .populate("react");

        if (!posts.length) {
            return res
                .status(404)
                .json({ message: "You don't have any posts" });
        }

        const postsData = posts.map((post) => postDataFilter(post));

        const numberOfPost = await Post.estimatedDocumentCount();

        const paginationData = {
            numberOfPost,
            currentPageNumber: page,
            pageAmount: Math.ceil(numberOfPost / limit),
        };

        res.status(200).json({
            message: "Successfully",
            data: { posts: postsData, pagination: paginationData },
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const getPostsByUser = async (req, res) => {
    const limit = 5;
    const page = parseInt(req.query.page) || 0;

    try {
        const posts = await Post.find({ user: req.params.userId })
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(page * limit)
            .populate("user")
            .populate("react");

        if (!posts.length) {
            return res
                .status(404)
                .json({ message: "You don't have any posts" });
        }

        const postsData = posts.map((post) => postDataFilter(post));

        const numberOfPost = await Post.estimatedDocumentCount();

        const paginationData = {
            numberOfPost,
            currentPageNumber: page,
            pageAmount: Math.ceil(numberOfPost / limit),
        };

        res.status(200).json({
            message: "Successfully",
            data: { posts: postsData, pagination: paginationData },
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

export {
    reactPost,
    createPost,
    deletePost,
    updatePost,
    getAllPosts,
    getPostsByUser,
};
