import { Post, React, Comment } from "../models";

const reactCommentController = async (req, res) => {
    const userId = req.user_id;
    const reactKey = req.query.key;
    const { commentId } = req.params;

    try {
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(400).json({ message: "Comment doesn't exist" });
        }

        const react = await React.findById(comment.react);
        const indexUser = react[reactKey].indexOf(userId);

        if (indexUser == -1) {
            react[reactKey].push(userId);
        } else {
            react[reactKey].splice(indexUser, 1);
        }

        await react.save();

        return res.status(200).json({ message: "success" });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const createCommentController = async (req, res) => {
    const userId = req.user_id;
    const { text, image, post_id } = req.body;

    try {
        const post = await Post.findById(post_id);
        if (!post) {
            return res.status(400).json({ message: "Post doesn't exist" });
        }

        const saveEmptyReact = await new React().save();

        await new Comment({
            text,
            image,
            user: userId,
            post: post_id,
            react: saveEmptyReact._id,
        }).save();

        return res.status(200).json({ message: "success" });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const deleteCommentController = async (req, res) => {
    const userId = req.user_id;
    const { commentId } = req.params;

    try {
        const comment = await Comment.findOne({ user: userId, _id: commentId });

        if (!comment) {
            return res.status(400).json({ error: "You don't allow delete this comment" });
        }

        await comment.remove();
        await React.findByIdAndDelete(comment.react);

        return res.status(200).json({ message: "Delete comment successfully" });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const updateCommentController = async (req, res) => {
    const userId = req.user_id;
    const { commentId } = req.params;
    const { text, image } = req.body;

    try {
        const comment = await Comment.findOne({ user: userId, _id: commentId });
        if (!comment) {
            return res.status(400).json({ error: "You don't allow edit this comment" });
        }

        const post = await Post.findById(comment.post);
        if (!post) {
            return res.status(400).json({ error: "This post is deleted" });
        }

        await comment.update({ text, image });

        return res.status(200).json({ message: "Update comment successfully" });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const getCommentsByPostController = async (req, res) => {
    const pageSize = 5;
    const { post_id } = req.query;
    const page = parseInt(req.query.page) || 1;

    try {
        const query = { post: post_id };

        const comments = await Comment.find(query)
            .limit(pageSize)
            .sort({ createdAt: -1 })
            .skip((page - 1) * pageSize)
            .populate("user", { _id: 1, name: 1, avatar_image: 1 })
            .populate({
                path: "react",
                select: "_id wow sad like love haha angry",
                populate: [
                    { path: "wow", select: "_id name avatar_image" },
                    { path: "sad", select: "_id name avatar_image" },
                    { path: "like", select: "_id name avatar_image" },
                    { path: "love", select: "_id name avatar_image" },
                    { path: "haha", select: "_id name avatar_image" },
                    { path: "angry", select: "_id name avatar_image" },
                ],
            });

        const count = await Comment.countDocuments(query);

        res.status(200).json({ message: "success", data: { count, rows: comments } });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

export {
    reactCommentController,
    createCommentController,
    deleteCommentController,
    updateCommentController,
    getCommentsByPostController,
};
