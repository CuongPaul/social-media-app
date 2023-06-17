import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { User } from "../models";
import redisClient from "../helpers/redis";

const signinController = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email }, { chat_rooms: 0 }).lean().populate("friends", {
            _id: 1,
            name: 1,
            avatar_image: 1,
        });
        if (!user) {
            return res.status(400).json({ message: "Email doesn't exist" });
        }

        const { password: userPassword, ...userData } = user;

        const isMatchPassword = await bcrypt.compare(password, userPassword);
        if (!isMatchPassword) {
            return res.status(400).json({ message: "Incorrect password" });
        }

        const token = jwt.sign({ user_id: user._id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRE,
        });

        const friendsOnline = [];
        for (const item of user.friends) {
            const sockets = await redisClient.LRANGE(`socket-io:${item._id}`, 0, -1);

            if (sockets.length) {
                const { _id, name, avatar_image } = item;
                friendsOnline.push({ _id, name, sockets, avatar_image });
            }
        }

        return res.status(200).json({
            message: "Signin successfully",
            data: { token, user: userData, friends_online: friendsOnline },
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const signupController = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const hashPassword = await bcrypt.hash(password, 8);

        const newUser = await new User({ name, email, password: hashPassword }).save();

        const token = jwt.sign({ user_id: newUser._id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRE,
        });

        const { password: passwordSaved, ...userData } = newUser._doc;

        return res
            .status(200)
            .json({ data: { token, user: userData }, message: "Account successfully created" });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const signoutController = async (req, res) => {
    const userId = req.user_id;
    const expireTime = req.exp_token;
    const token = req.headers.authorization;
    const { socket_id, friends_online } = req.body;

    try {
        const ttl = expireTime - (Date.now() / 1000).toFixed();
        if (ttl > 0) {
            await redisClient.SETEX(`black-list-token:${token}`, ttl, userId);
        }

        await redisClient.LREM(`socket-io:${userId}`, 0, socket_id);
        if (friends_online.length) {
            const sockets = await redisClient.LRANGE(`socket-io:${userId}`, 0, -1);

            if (!sockets.length) {
                for (const friend of friends_online) {
                    for (const item of friend.sockets) {
                        req.io.sockets.to(item).emit("user-offline", userId);
                    }
                }
            }
        }

        return res.status(200).json({ message: "Signout successfully" });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

export { signinController, signupController, signoutController };
