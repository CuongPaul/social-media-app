import Post from "../models/Post";
import { postDataFilter } from "../utils/filter-data";
import { sendNotification } from "../utils/send-notification";

const createPost = async (req, res) => {
    const { body, text, images, privacy } = req.body;

    if ((!images || !images.length) && !text && text.trim().length === 0) {
        return res.status(422).json({ message: "Post image or write something" });
    }

    try {
        const newPost = new Post({
            body,
            text,
            images,
            privacy,
            user: req.user_id,
        });
        const savePost = await newPost.save();

        res.status(201).json({ message: "Create post is successfully" });

        await sendNotification({
            req,
            key: "new-post",
            content: `${savePost.user.name} has created new post`,
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const reactPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId).populate("react").populate("user");

        if (!post) {
            return res.status(400).json({ message: "Post is not exist" });
        }

        const key = req.query.key;
        const indexUserId = post.react[key].indexOf(req.user_id);

        indexUserId === -1
            ? post.react[key].push(req.user_id)
            : post.react[key].splice(indexUserId, 1);

        await post.save();

        postData = postDataFilter(post);

        await sendNotification({
            req,
            key: "react-post",
            content: `${post.user.name} reacted post`,
        });

        res.status(200).json({ message: "React post is changed", data: postData });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);

        if (!post) {
            return res.status(400).json({ message: "Post is not exists" });
        }

        await Message.deleteOne({ id: post.id });

        res.status(200).json({ message: "Delete post is successfully" });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const editPost = async (req, res) => {
    const { body, text, images, privacy } = req.body;

    if ((!images || !images.length) && !text && text.trim().length === 0) {
        return res.status(422).json({ message: "Post image or write something" });
    }

    try {
        const post = await Post.findById(req.params.postId);

        if (!post) {
            return res.status(400).json({ message: "Post is not exists" });
        }

        post.body = body;
        post.content = text;
        post.images = images;
        post.privacy = privacy;
        post.save();

        res.status(200).json({ message: "Edit post is successfully" });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const getPostsByUser = async (req, res) => {
    try {
        const posts = await Post.find({ user: req.params.userId });

        if (!posts) {
            return res.status(400).json({ message: "Post is not exists" });
        }

        const postsData = posts.map((post) => postDataFilter(post));

        res.status(200).json({ message: "Get post by user is successfully", data: postsData });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const getAllPost = async (req, res) => {
    const limit = 5;
    const page = parseInt(req.query.page || 0);

    try {
        const posts = await Post.find()
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(page * limit)
            .populate("user")
            .populate("react");

        const postsData = posts.map((post) => postDataFilter(post));

        const postAmount = await Post.estimatedDocumentCount().exec();

        const paginationData = {
            postAmount,
            currentPage: page,
            pageAmount: Math.ceil(postAmount / limit),
        };

        res.status(200).json({
            message: "Get all post is successfully",
            data: { posts: postsData, pagination: paginationData },
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

export { editPost, reactPost, createPost, deletePost, getAllPost, getPostsByUser };
