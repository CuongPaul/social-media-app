import Post from "../models/Post";
import React from "../models/React";
import Comment from "../models/Comment";
import { commentDataFilter } from "../utils/filter-data";
import { sendNotification } from "../utils/send-notification";

const reactComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.commentId)
            .populate("react")
            .populate("user");
        if (!comment) {
            return res.status(404).json({ message: "Comment doesn't exist" });
        }

        const post = await Post.findById(comment.post);
        if (!post) {
            return res.status(404).json({ message: "Post doesn't exist" });
        }

        const key = req.query.key;
        const indexUserId = comment.react[key].indexOf(req.user_id);

        indexUserId === -1
            ? comment.react[key].push(req.user_id)
            : comment.react[key].splice(indexUserId, 1);

        await comment.save();

        await sendNotification({
            req,
            key: "react-comment",
            content: `${comment.user.name} ${key} your comment`,
        });

        res.status(200).json({ message: "Successfully" });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const createComment = async (req, res) => {
    const { text, image } = req.body;

    if ((!text || !text.trim().length) && (!image || !image.trim().length)) {
        return res.status(422).json({ message: "Post image or write something" });
    }

    try {
        const post = await Post.findById(req.params.postId);

        if (!post) {
            return res.status(404).json({ message: "Post doesn't exist" });
        }

        const emptyReact = new React({ wow: [], sad: [], like: [], love: [], haha: [], angry: [] });
        const saveEmptyReact = await emptyReact.save();

        const newComment = new Comment({
            post: post.id,
            user: req.user_id,
            content: { text, image },
            react: saveEmptyReact.id,
        });
        const saveComment = await newComment.save();

        const commentData = commentDataFilter(saveComment);

        await sendNotification({ req, key: "comment-post", data: commentData });

        res.status(201).json({ message: "Successfully" });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const deleteComment = async (req, res) => {
    const commentId = req.params.commentId;

    try {
        const comment = await Comment.findById(commentId);

        const post = await Post.findById(comment.post);
        if (!post) {
            return res.status(404).json({ message: "Post doesn't exist" });
        }

        await Comment.deleteOne({ id: commentId });

        res.status(200).json({ message: "Delete comment successfully" });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const updateComment = async (req, res) => {
    const { text, image } = req.body;

    if ((!text || !text.trim().length) && (!image || !image.trim().length)) {
        return res.status(422).json({ message: "Post image or write something" });
    }

    try {
        const comment = await Comment.findById(req.params.commentId);

        const post = await Post.findById(comment.post);
        if (!post) {
            return res.status(404).json({ error: "Post doesn't exist" });
        }

        comment.text = text;
        comment.image = image;
        await comment.save();

        res.status(200).json({ message: "Update comment successfully" });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const getCommentsByPost = async (req, res) => {
    const limit = 5;
    const page = parseInt(req.query.page) || 0;

    try {
        const comments = await Comment.find({ post: req.params.postId })
            .sort()
            .limit(limit)
            .skip(page * limit)
            .populate("user");

        const commentsData = comments.map((comment) => commentDataFilter(comment));

        const numberOfCommentsPerPost = await Comment.countDocuments({ post: req.params.postId });

        const paginationData = {
            currentPageNumber: page,
            numberOfCommentsPerPost,
            numberOfPage: Math.ceil(numberOfCommentsPerPost / limit),
        };

        res.status(200).json({
            message: "Successfully",
            data: { comments: commentsData, pagination: paginationData },
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

export { reactComment, createComment, deleteComment, updateComment, getCommentsByPost };
