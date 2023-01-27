import Post from "../models/Post";
import Comment from "../models/Comment";
import { sendNotification } from "../helper/socket";
import { commentFilter } from "../utils/filter-data";

const editComment = async (req, res) => {
    const { text, image } = req.body;

    if (!image && !text && text.trim().length === 0) {
        return res.status(422).json({ message: "Post image or write something" });
    }

    try {
        const post = await Post.findById(req.params.postId);

        if (!post) {
            return res.status(404).json({ error: "Post is not found" });
        }

        await Comment.findByIdAndUpdate(req.params.commentId, { body: { text, image } }).populate(
            "user"
        );

        res.status(200).json({ message: "success" });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const createComment = async (req, res) => {
    const { text, image } = req.body;

    if (!image && !text && text.trim().length === 0) {
        return res.status(422).json({ message: "Post image or write something" });
    }

    try {
        const post = await Post.findById(req.params.postId);

        if (!post) {
            return res.status(404).json({ error: "Post is not found" });
        }

        const newComment = new Comment({
            user: req.user_id,
            body: { text, image },
            post: req.params.postId,
        });

        const saveComment = await newComment.save();

        const commentData = commentFilter(saveComment);

        res.status(201).json({
            comment: commentData,
            message: "Create comment is successfully",
        });

        await sendNotification({ req, key: "post-comment", data: commentData });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const deleteComment = async (req, res) => {
    try {
        await Comment.findByIdAndDelete(req.params.commentId).populate("user");

        res.status(200).json({ message: "success" });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const fetchComments = async (req, res) => {
    const limit = 5;
    const page = parseInt(req.query.page || 0);

    try {
        const comments = await Comment.find({ post: req.params.postId })
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(page * limit)
            .populate("user", "_id name avatar_image");

        const commensData = comments.map((comment) => commentFilter(comment));
        const commentAmount = await Comment.countDocuments({ post: req.params.postId });

        const paginationData = {
            commentAmount,
            currentPage: page,
            pageAmount: Math.ceil(commentAmount / limit),
        };

        res.status(200).json({ comments: commensData, pagination: paginationData });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const likeDislikeComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.commentId).populate("user");

        if (!comment) {
            return res.status(404).json({ error: "comment not found" });
        }

        let commentData;

        const index = comment.likes.indexOf(req.user_id);
        if (index !== -1) {
            comment.likes.splice(index, 1);
            await comment.save();

            commentData = commentFilter(comment);

            res.status(200).json({ message: "removed likes", comment: commentData });

            await sendNotification({
                req,
                key: "comment-like-change",
                data: commentData,
            });
            return;
        }

        comment.likes.push(req.user_id);
        await comment.save();
        commentData = commentFilter(comment);
        res.status(200).json({ message: "add like", comment: commentData });
        await sendNotification({
            req,
            key: "comment-like-change",
            data: commentData,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Something went wrong" });
    }
};

export { editComment, createComment, deleteComment, fetchComments, likeDislikeComment };
