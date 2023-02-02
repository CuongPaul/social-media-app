import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../models/User";
import isValidEmail from "../utils/validate-email";

const signin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !email.trim().length) {
        return res.status(422).json({ message: "Email is required" });
    }
    if (!password || !password.trim().length) {
        return res.status(422).json({ message: "Password is required" });
    }
    if (!isValidEmail(email)) {
        return res.status(422).json({ message: "Email is not valid" });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "Email doesn't exist" });
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

    if (!name || !name.trim().length) {
        return res.status(422).json({ message: "Name is required" });
    }
    if (!email || !email.trim().length) {
        return res.status(422).json({ message: "Email is required" });
    }
    if (!password || !password.trim().length) {
        return res.status(422).json({ message: "Password is required" });
    }
    if (!isValidEmail(email)) {
        return res.status(422).json({ message: "Email is not valid" });
    }

    try {
        const user = await User.findOne({ email });

        if (user) {
            return res.status(404).json({ message: "Email already exists" });
        }

        const hashPassword = await bcrypt.hash(password, 8);

        const newUser = new User({
            name,
            email,
            password: hashPassword,
        });
        await newUser.save();

        res.status(201).json({ message: "Account successfully created" });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const signout = async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.user_id, { socket_id: [] });

        res.status(201).json({ message: "You are logged out" });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const updatePassword = async (req, res) => {
    const { new_password, current_password } = req.body;

    if (!new_password || !new_password.trim().length) {
        return res.status(422).json({ message: "New password is required" });
    }
    if (!current_password || !current_password.trim().length) {
        return res.status(422).json({ message: "Current password is required" });
    }

    try {
        const user = await User.findById(req.user_id);

        if (!user) {
            return res.status(404).json({ message: "User doesn't exist" });
        }

        const isMatchPassword = await bcrypt.compare(current_password, user.password);

        if (!isMatchPassword) {
            return res.status(404).json({ error: "Incorrect current password" });
        }

        const hashPassword = await bcrypt.hash(new_password, 8);

        user.password = hashPassword;
        await user.save();

        res.status(200).json({ message: "Password has been updated" });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

export { signin, signup, signout, updatePassword };
