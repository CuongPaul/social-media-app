import Post from "../models/Post";
import { postFilter } from "../utils/filter-data";
import { sendNotification } from "../helper/socket";

const createPost = async (req, res) => {
    const { body, images, content, privacy } = req.body;

    if (!images && !content && content.trim().length === 0) {
        return res.status(422).json({ message: "Post image or write something" });
    }

    try {
        const newPost = new Post({
            images,
            privacy,
            content,
            user: req.user_id,
            body: {
                date: body?.date,
                with: body?.with,
                feelings: body?.feelings,
                location: body?.location,
            },
        });

        const savePost = await newPost.save();

        const postData = postFilter(savePost);

        res.status(201).json({ message: "Create post is successfully", post: postData });

        await sendNotification({
            req,
            key: "new-post",
            data: postData,
            notif_body: `${savePost.user.name} has created new post`,
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const likeDislikePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId)
            .populate("user")
            .populate({ path: "body.with", select: "_id name" });
        if (!post) {
            return res.status(404).json({ error: "post not found" });
        }

        let postData;

        const index = post.likes.indexOf(req.user_id);
        if (index !== -1) {
            post.likes.splice(index, 1);
            await post.save();
            postData = postFilter(post);
            res.status(200).json({ message: "removed likes", post: postData });
            await sendNotification({ req, key: "post-like-change", data: postData });
            return;
        }

        post.likes.push(req.user_id);
        await post.save();
        postData = postFilter(post);
        res.status(200).json({ message: "add like", post: postData });
        await sendNotification({ req, key: "post-like-change", data: postData });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Something went wrong" });
    }
};

const deletePost = async (req, res) => {
    try {
        await Post.findByIdAndDelete(req.params.postId)
            .populate("user")
            .populate({ path: "body.with" });

        res.status(200).json({ message: "success" });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Something went wrong" });
    }
};

const editPost = async (req, res) => {
    try {
        const { privacy, content } = req.body;

        await Post.findByIdAndUpdate(req.params.postId, { privacy, content })
            .populate("user")
            .populate({ path: "body.with" });

        res.status(200).json({ message: "success" });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Something went wrong" });
    }
};

const fetchPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId)
            .populate("user")
            .populate({ path: "body.with" });

        let postData = postFilter(post);

        res.status(200).json({ post: postData });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Something went wrong" });
    }
};

const getPosts = async (req, res) => {
    const limit = 3;
    const page = parseInt(req.query.page || 0);

    try {
        const posts = await Post.find()
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(page * limit)
            .populate("user")
            .populate({ path: "body.with" });

        const postsData = posts.map((post) => postFilter(post));

        const postAmount = await Post.estimatedDocumentCount().exec();

        const paginationData = {
            postAmount,
            currentPage: page,
            pageAmount: Math.ceil(postAmount / limit),
        };

        res.status(200).json({ posts: postsData, pagination: paginationData });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

export { createPost, likeDislikePost, deletePost, editPost, fetchPostById, getPosts };
