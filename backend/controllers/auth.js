import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { User } from "../models";
import redisClient from "../config/redis";

const signinController = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Email doesn't exist" });
        }

        const isMatchPassword = await bcrypt.compare(password, user.password);
        if (!isMatchPassword) {
            return res.status(400).json({ message: "Incorrect password" });
        }

        const token = jwt.sign({ user_id: user._id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRE,
        });

        return res.status(200).json({ data: { token }, message: "Signin successfully" });
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

        return res.status(200).json({ data: { token }, message: "Account successfully created" });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const signoutController = async (req, res) => {
    const userId = req.user_id;
    const expireTime = req.exp_token;
    const token = req.headers.authorization;

    try {
        const ttl = expireTime - (Date.now() / 1000).toFixed();

        if (ttl > 0) {
            await redisClient.SETEX(`black-list-token:${token}`, ttl, userId);
        }

        return res.status(200).json({ message: "Signout successfully" });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

export { signinController, signupController, signoutController };
