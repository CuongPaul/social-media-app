import Post from "../models/Post";
import Comment from "../models/Comment";
import { commentDataFilter } from "../utils/filter-data";
import { sendNotification } from "../utils/send-notification";

const reactComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.commentId).populate("user");

        if (!comment) {
            return res.status(400).json({ message: "Comment is not exist" });
        }

        const key = req.query.key;
        const indexUserId = comment.react[key].indexOf(req.user_id);

        indexUserId === -1
            ? comment.react[key].push(req.user_id)
            : comment.react[key].splice(indexUserId, 1);

        await comment.save();

        commentData = commentDataFilter(comment);

        await sendNotification({
            req,
            key: "react-comment",
            content: `${comment.user.name} reacted comment`,
        });

        res.status(200).json({ message: "React comment is changed", data: commentData });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Something went wrong" });
    }
};

const createComment = async (req, res) => {
    const { text, image } = req.body;

    if ((!text || !text.trim().length === 0) && (!image || !image.trim().length === 0)) {
        return res.status(422).json({ message: "Comment image or write something" });
    }

    try {
        const post = await Post.findById(req.params.postId);

        if (!post) {
            return res.status(400).json({ message: "Post is not exist" });
        }

        const newComment = new Comment({
            post: post.id,
            user: req.user_id,
            content: { text, image },
        });
        const saveComment = await newComment.save();

        const commentData = commentDataFilter(saveComment);

        res.status(201).json({ message: "Create comment is successfully", data: commentData });

        await sendNotification({ req, key: "post-comment", data: commentData });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const deleteComment = async (req, res) => {
    const commentId = req.params.commentId;

    try {
        const comment = await Comment.find(commentId);

        if (!comment) {
            return res.status(400).json({ message: "Comment is not exist" });
        }

        await Comment.deleteOne({ id: commentId });

        res.status(200).json({ message: "Delete comment is successfully" });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const updateComment = async (req, res) => {
    const { text, image } = req.body;

    if ((!text || !text.trim().length === 0) && (!image || !image.trim().length === 0)) {
        return res.status(422).json({ message: "Comment image or write something" });
    }

    try {
        const comment = await Comment.findById(req.params.commentId);
        if (!comment) {
            return res.status(404).json({ error: "Comment is not exists" });
        }

        const post = await Post.findById(comment.post);
        if (!post) {
            return res.status(404).json({ error: "Post is not exists" });
        }

        comment.text = text;
        comment.image = image;
        await comment.save();

        res.status(200).json({ message: "Update comment is successfully" });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const getCommentsByPost = async (req, res) => {
    const limit = 5;
    const page = parseInt(req.query.page || 0);

    try {
        const comments = await Comment.find({ post: req.params.postId })
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(page * limit)
            .populate("user");

        const commentsData = comments.map((comment) => commentDataFilter(comment));
        const commentAmount = await Comment.countDocuments({ post: req.params.postId });

        const paginationData = {
            commentAmount,
            currentPage: page,
            pageAmount: Math.ceil(commentAmount / limit),
        };

        res.status(200).json({
            message: "Get chat is successfully",
            data: { comments: commentsData, pagination: paginationData },
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

export { reactComment, createComment, deleteComment, updateComment, getCommentsByPost };
