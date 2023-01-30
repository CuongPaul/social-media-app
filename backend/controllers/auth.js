import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../models/User";
import isValidEmail from "../utils/validate-email";
import { userDataFilter } from "../utils/filter-data";

const signin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || email.trim().length === 0) {
        return res.status(422).json({ message: "Email is require" });
    }
    if (!password || password.trim().length === 0) {
        return res.status(422).json({ message: "Password is require" });
    }
    if (!isValidEmail(email)) {
        return res.status(422).json({ message: "Email is not valid" });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Email is not exist" });
        }

        const isMatchPassword = await bcrypt.compare(password, user.password);

        if (!isMatchPassword) {
            return res.status(400).json({ message: "Password is incorrect" });
        }

        const token = jwt.sign({ user_id: user.id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRE,
        });

        return res.status(201).json({
            data: { token },
            message: "Login is successfully",
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const signup = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || name.trim().length === 0) {
        return res.status(422).json({ message: "Name is require" });
    }
    if (!email || email.trim().length === 0) {
        return res.status(422).json({ message: "Email is require" });
    }
    if (!password || password.trim().length === 0) {
        return res.status(422).json({ message: "Password is require" });
    }
    if (!isValidEmail(email)) {
        return res.status(422).json({ message: "Email is not valid" });
    }

    try {
        const user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ message: "Email is already exists" });
        }

        const hashPassword = await bcrypt.hash(password, 8);

        const newUser = new User({
            name,
            email,
            password: hashPassword,
        });
        const saveUser = await newUser.save();

        const token = jwt.sign({ user_id: saveUser.id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRE,
        });

        res.status(201).json({
            data: { token },
            message: `Account is created for ${email}`,
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const signout = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.user_id, { socket_id: [] });

        if (!user) {
            res.status(400).json({ message: "User is not found" });
        }

        const userData = userDataFilter(user);

        res.status(201).json({ message: "Logout is successfully", user: userData });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const updatePassword = async (req, res) => {
    const { new_password, current_password } = req.body;

    if (!new_password || new_password.trim().length === 0) {
        return res.status(422).json({ message: "New password is require" });
    }
    if (!current_password || current_password.trim().length === 0) {
        return res.status(422).json({ message: "Current password is require" });
    }

    try {
        const user = await User.findById(req.user_id);

        if (!user) {
            return res.status(400).json({ message: "User is not exist" });
        }

        const isMatchPassword = await bcrypt.compare(current_password, user.password);
        if (!isMatchPassword) {
            return res.status(400).json({ error: "Incorrect current password" });
        }

        const hashPassword = await bcrypt.hash(new_password, 8);
        user.password = hashPassword;
        await user.save();

        res.status(200).json({ message: "Update password is successfully" });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

export { signin, signup, signout, updatePassword };
