import { ref, deleteObject } from "firebase/storage";

import storage from "../helpers/firebase";
import redisClient from "../helpers/redis";
import { Post, User, React, Notification } from "../models";

const getPostController = async (req, res) => {
    const userId = req.user_id;
    const { postId } = req.params;

    try {
        const post = await Post.findById(postId)
            .populate("user", { _id: 1, name: 1, friends: 1, avatar_image: 1 })
            .populate({
                path: "react",
                select: "wow sad like love haha angry",
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

        if (post.privacy == "ONLY_ME" && post.user != userId) {
            return res.status(404).json({ message: "Post doesn't exist" });
        }
        if (post.privacy == "FRIEND" && !post.user.friends.includes(userId)) {
            return res.status(404).json({ message: "Post doesn't exist" });
        }

        return res.status(200).json({ message: "success", data: post });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

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

        let reactId = post.react;
        if (!reactId) {
            const emptyReact = await new React().save();

            reactId = emptyReact._id;
            await post.updateOne({ react: emptyReact._id });
        }

        const react = await React.findById(reactId);
        const userIndex = react[reactKey].indexOf(userId);

        if (userIndex == -1) {
            react[reactKey].push(userId);
        } else {
            react[reactKey].splice(userIndex, 1);
        }

        await react.save();

        return res.status(200).json({ message: "success" });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const removeTagController = async (req, res) => {
    const userId = req.user_id;
    const { postId } = req.params;

    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post doesn't exist" });
        }

        const {
            body: { tag_friends },
        } = post;

        if (!tag_friends.includes(userId)) {
            return res.status(400).json({ message: "You haven't been tagged in the post" });
        }

        post.body.tag_friends = tag_friends.filter((friend) => friend != userId);

        await post.save();

        return res.status(200).json({ message: "You've removed the tag from post" });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const createPostController = async (req, res) => {
    const userId = req.user_id;
    const { body, text, images, privacy } = req.body;

    const bodyInvalid = typeof body == "string" ? JSON.parse(body) : body;

    try {
        if (bodyInvalid?.tag_friends?.length) {
            const users = await User.find({ _id: { $in: bodyInvalid.tag_friends } });

            const tagFriends = users.reduce((acc, cur) => {
                if (!cur.block_users.includes(userId) && cur.friends.includes(userId)) {
                    return acc.concat(cur._id);
                } else {
                    return acc;
                }
            }, []);

            bodyInvalid.tag_friends = [...new Set(tagFriends)];
        }

        const post = await new Post({
            text,
            images,
            privacy,
            react: null,
            user: userId,
            body: bodyInvalid,
        })
            .save()
            .then((res) =>
                res
                    .populate("user", { _id: 1, name: 1, avatar_image: 1 })
                    .populate("body.tag_friends", { _id: 1, name: 1, avatar_image: 1 })
                    .execPopulate()
            );

        const user = await User.findById(userId);
        if (post && bodyInvalid?.tag_friends?.length && privacy != "ONLY_ME") {
            for (const friendId of bodyInvalid.tag_friends) {
                const notification = await new Notification({
                    user: friendId,
                    post: post._id,
                    type: "POST-TAG_FRIEND",
                    content: `${user.name} has tag you in new post`,
                }).save();

                const sockets = await redisClient.LRANGE(`socket-io:${friendId}`, 0, -1);
                if (sockets.length) {
                    sockets.forEach((socketId) => {
                        req.io.sockets.to(socketId).emit("new-notification", notification);
                    });
                }
            }
        }

        return res.status(200).json({ data: post, message: "success" });
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

        if (post.images.length) {
            for (const image of post.images) {
                const pathName = decodeURIComponent(image.split("/o/")[1].split("?alt=")[0]);
                const imageRef = ref(storage, pathName);

                await deleteObject(imageRef);
            }
        }

        await post.remove();

        return res.status(200).json({ message: "Post is deleted" });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const updatePostController = async (req, res) => {
    const userId = req.user_id;
    const { postId } = req.params;
    let { old_images } = req.body;
    const { body, text, images, privacy } = req.body;

    const bodyInvalid = typeof body == "string" ? JSON.parse(body) : body;
    if (old_images) {
        old_images = typeof old_images == "string" ? JSON.parse(old_images) : old_images;
    }

    try {
        const post = await Post.findOne({ user: userId, _id: postId });
        if (!post) {
            return res.status(404).json({ message: "Post does not exist" });
        }

        if (bodyInvalid?.tag_friends.length) {
            const users = await User.find({ _id: { $in: bodyInvalid.tag_friends } });

            const tagFriends = users.reduce((acc, cur) => {
                if (!cur.block_users.includes(userId) && cur.friends.includes(userId)) {
                    return acc.concat(cur._id);
                } else {
                    return acc;
                }
            }, []);
            const tagFriendsInvalid = [...new Set(tagFriends)];

            bodyInvalid.tag_friends = tagFriendsInvalid;

            const newFriendsTaged = tagFriendsInvalid.filter(
                (item) => !post.body.tag_friends.includes(item)
            );

            if (newFriendsTaged.length && privacy != "ONLY_ME") {
                for (const friendId of newFriendsTaged) {
                    const notification = await new Notification({
                        user: friendId,
                        post: post._id,
                        type: "POST-TAG_FRIEND",
                        content: `${post.user.name} has tag you in new post`,
                    }).save();

                    const sockets = await redisClient.LRANGE(`socket-io:${friendId}`, 0, -1);
                    if (sockets.length) {
                        sockets.forEach((socketId) => {
                            req.io.sockets.to(socketId).emit("new-notification", notification);
                        });
                    }
                }
            }
        }

        const imageDeleted = post.images.filter((item) => !old_images.includes(item));
        for (const image of imageDeleted) {
            const pathName = decodeURIComponent(image.split("/o/")[1].split("?alt=")[0]);
            const imageRef = ref(storage, pathName);

            await deleteObject(imageRef);
        }

        post.text = text;
        post.privacy = privacy;
        post.body = bodyInvalid;
        post.images = [...images, ...old_images];

        const postUpdated = await post.save().then((res) =>
            res
                .populate("user", { _id: 1, name: 1, avatar_image: 1 })
                .populate({
                    path: "react",
                    select: "wow sad like love haha angry",
                    populate: [
                        { path: "wow", select: "_id name avatar_image" },
                        { path: "sad", select: "_id name avatar_image" },
                        { path: "like", select: "_id name avatar_image" },
                        { path: "love", select: "_id name avatar_image" },
                        { path: "haha", select: "_id name avatar_image" },
                        { path: "angry", select: "_id name avatar_image" },
                    ],
                })
                .populate("body.tag_friends", { _id: 1, name: 1, avatar_image: 1 })
                .execPopulate()
        );

        return res.status(200).json({ data: postUpdated, message: "Update post successfully" });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const getAllPostsController = async (req, res) => {
    const pageSize = 10;
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
                select: "wow sad like love haha angry",
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
    const pageSize = 10;
    const userId = req.user_id;
    const ownerId = req.params.userId;
    const page = parseInt(req.query.page) || 1;

    try {
        const postsTagOwner = await Post.find({
            "body.tag_friends": { $elemMatch: { $eq: ownerId } },
        }).populate("user", { friends: 1 });

        const postsIdTagOwner = [];
        postsTagOwner.forEach((post) => {
            if (
                post.privacy == "FRIEND" &&
                (userId == post.user._id || post.user.friends.includes(userId))
            ) {
                postsIdTagOwner.push(post._id);
            }
            if (post.privacy == "PUBLIC") {
                postsIdTagOwner.push(post._id);
            }
        });

        const owner = await User.findById(ownerId);

        const query = {
            $or: [{ _id: { $in: postsIdTagOwner } }, { user: ownerId, privacy: "PUBLIC" }],
        };
        if (owner.friends.includes(userId)) {
            query["$or"][1].privacy = { $in: ["FRIEND", "PUBLIC"] };
        }
        if (ownerId == userId) {
            query["$or"][1].privacy = { $in: ["FRIEND", "PUBLIC", "ONLY_ME"] };
        }

        const posts = await Post.find(query)
            .limit(pageSize)
            .sort({ createdAt: -1 })
            .skip((page - 1) * pageSize)
            .populate("user", { _id: 1, name: 1, avatar_image: 1 })
            .populate({
                path: "react",
                select: "wow sad like love haha angry",
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
    getPostController,
    reactPostController,
    removeTagController,
    createPostController,
    deletePostController,
    updatePostController,
    getAllPostsController,
    getPostsByUserController,
};
