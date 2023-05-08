import { Post, User, React, Comment, Notification } from "../models";

const reactPostController = async (req, res) => {
    const userId = req.user_id;
    const { postId } = req.params;
    const reactKey = req.query.key;

    try {
        const post = await Post.findById(postId).populate("user");
        if (!post) {
            return res.status(404).json({ message: "Post doesn't exist" });
        }

        if (post.user.block_users.includes(userId)) {
            return res.status(400).json({ message: "Can't react this post" });
        }
        if (post.privacy == "ONLY_ME") {
            return res.status(400).json({ message: "Can't react this post" });
        }
        if (post.privacy == "FRIEND" && !post.user.friends.includes(userId)) {
            return res.status(400).json({ message: "Can't react this post" });
        }

        const react = await React.findById(post.react);
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

const createPostController = async (req, res) => {
    const userId = req.user_id;
    const { body, text, images, privacy } = req.body;

    try {
        const emptyReact = await new React().save();

        if (body?.tag_friends?.length) {
            const users = await User.find({ _id: { $in: body.tag_friends } });

            const newTagFriends = users.reduce((acc, cur) => {
                if (!cur.block_users.includes(userId) && cur.friends.includes(userId)) {
                    return acc.concat(cur._id);
                } else {
                    return acc;
                }
            }, []);

            body.tag_friends = newTagFriends;
        }

        const post = await new Post({
            body,
            text,
            images,
            privacy,
            user: userId,
            react: emptyReact._id,
        }).save();

        const user = await User.findById(userId);
        if (post && body?.tag_friends?.length && privacy != "ONLY_ME") {
            for (const friendId of body.tag_friends) {
                const friend = await User.findById(friendId);

                if (!friend.block_users.includes(userId)) {
                    await new Notification({
                        user: friendId,
                        post: post._id,
                        type: "POST-TAG_FRIEND",
                        content: `${user.name} has tag you in new post`,
                    }).save();
                }
            }
        }

        return res.status(200).json({ message: "success" });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const deletePostController = async (req, res) => {
    const userId = req.user_id;
    const { postId } = req.params;

    try {
        const post = await Post.findOne({ user: userId, _id: postId });

        if (!post) {
            return res.status(404).json({ message: "Post does not exist" });
        }

        await post.remove();

        await React.findByIdAndDelete(post.react);
        await Comment.deleteMany({ post: postId });
        await Notification.deleteMany({ post: postId });

        return res.status(200).json({ message: "success" });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const updatePostController = async (req, res) => {
    const userId = req.user_id;
    const { postId } = req.params;
    const { body, text, images, privacy } = req.body;

    try {
        const post = await Post.findOne({ user: userId, _id: postId }).populate("user");

        if (!post) {
            return res.status(404).json({ message: "Post does not exist" });
        }

        if (body?.tag_friends.length) {
            const users = await User.find({ _id: { $in: body.tag_friends } });
            const newTagFriends = users.reduce((acc, cur) => {
                if (!cur.block_users.includes(userId) && cur.friends.includes(userId)) {
                    return acc.concat(cur._id);
                } else {
                    return acc;
                }
            }, []);
            body.tag_friends = newTagFriends;

            const newFriendsTaged = newTagFriends.filter(
                (item) => !post.body.tag_friends.includes(item)
            );
            if (newFriendsTaged.length && privacy != "ONLY_ME") {
                for (const friendId of newFriendsTaged) {
                    const friend = await User.findById(friendId);

                    if (!friend.block_users.includes(userId)) {
                        await new Notification({
                            user: friendId,
                            post: post._id,
                            type: "POST-TAG_FRIEND",
                            content: `${post.user.name} has tag you in new post`,
                        }).save();
                    }
                }
            }
        }

        await post.update({ body, text, images, privacy });

        return res.status(200).json({ message: "Update post successfully" });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const getAllPostsController = async (req, res) => {
    const pageSize = 5;
    const page = parseInt(req.query.page) || 1;

    try {
        const query = { privacy: "PUBLIC" };

        const posts = await Post.find(query)
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
            })
            .populate("body.tag_friends", { _id: 1, name: 1, avatar_image: 1 });

        const count = await Post.countDocuments(query);

        return res.status(200).json({ message: "success", data: { count, rows: posts } });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const getPostsByUserController = async (req, res) => {
    const pageSize = 5;
    const userId = req.user_id;
    const ownerId = req.params.userId;
    const page = parseInt(req.query.page) || 1;

    try {
        const ownerPost = await User.findById(ownerId);

        const query = { user: ownerId, privacy: "PUBLIC" };
        if (ownerPost.friends.includes(userId)) {
            query.privacy = { $in: ["FRIEND", "PUBLIC"] };
        }
        if (ownerId == userId) {
            query.privacy = { $in: ["FRIEND", "PUBLIC", "ONLY_ME"] };
        }

        const posts = await Post.find(query)
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
            })
            .populate("body.tag_friends", { _id: 1, name: 1, avatar_image: 1 });

        const count = await Post.countDocuments(query);

        return res.status(200).json({ message: "success", data: { count, rows: posts } });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

export {
    reactPostController,
    createPostController,
    deletePostController,
    updatePostController,
    getAllPostsController,
    getPostsByUserController,
};
