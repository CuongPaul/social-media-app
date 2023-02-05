import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../models/User";
import isValidEmail from "../utils/validate-email";
import { userDataFilter } from "../utils/filter-data";

const signin = async (req, res) => {
    const { email, password } = req.body;

    const errMessages = {};
    if (!email || !email.trim().length) {
        errMessages.email = "Email is required";
    }
    if (!password || !password.trim().length) {
        errMessages.password = "Password is required";
    }
    if (!isValidEmail(email)) {
        errMessages.email = "Email is not valid";
    }
    if (errMessages.email || errMessages.password) {
        return res.status(422).json({ error: errMessages });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Email doesn't exist" });
        }

        const isMatchPassword = await bcrypt.compare(password, user.password);

        if (!isMatchPassword) {
            return res.status(404).json({ message: "Password is incorrect" });
        }

        const token = jwt.sign({ user_id: user.id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRE,
        });

        return res.status(201).json({
            data: { token },
            message: "Logged in successfully",
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const signup = async (req, res) => {
    const { name, email, password } = req.body;

    const errMessages = {};
    if (!name || !name.trim().length) {
        errMessages.name = "Name is required";
    }
    if (!email || !email.trim().length) {
        errMessages.email = "Email is required";
    }
    if (!password || !password.trim().length) {
        errMessages.password = "Password is required";
    }
    if (!isValidEmail(email)) {
        errMessages.email = "Email is not valid";
    }
    if (errMessages.name || errMessages.email || errMessages.password) {
        return res.status(422).json({ error: errMessages });
    }

    try {
        const user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ error: "Email already exists" });
        }

        const hashPassword = await bcrypt.hash(password, 8);

        const newUser = new User({ name, email, password: hashPassword });
        await newUser.save();

        res.status(201).json({ message: "Account successfully created" });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const signout = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.user_id, { socket_id: [] });

        res.status(201).json({ message: "You are logged out", data: userDataFilter(user) });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

export { signin, signup, signout };
