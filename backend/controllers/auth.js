import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../models/User";
import isValidEmail from "../utils/validate-email";

const login = async (req, res) => {
    const { email, password } = req.body;

    const errorMessage = { email: "", password: "" };

    if (!email || email.trim().length === 0) {
        errorMessage.email = "Email is require";
    }
    if (!password || password.trim().length === 0) {
        errorMessage.password = "Password is require";
    }
    if (!isValidEmail(email)) {
        errorMessage.email = "Email is not valid";
    }

    if (errorMessage.email || errorMessage.password) {
        return res.status(422).json({ message: errorMessage });
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

const logout = async (req, res) => {
    try {
        const user = await User.findById(req.user_id);

        if (user) {
            const accountData = {
                id: user.id,
                name: user.name,
                email: user.email,
                avatar_image: user.avatar_image,
            };

            res.status(201).json({ message: "Logout is successfully", account: accountData });
        } else {
            res.status(404).json({ message: "User is not found" });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const signup = async (req, res) => {
    const { name, email, password } = req.body;

    const errorMessage = { email: "", password: "" };

    if (!name || name.trim().length === 0) {
        error.name = "Name is require";
    }
    if (!email || email.trim().length === 0) {
        errorMessage.email = "Email is require";
    }
    if (!password || password.trim().length === 0) {
        errorMessage.password = "Password is require";
    }
    if (!isValidEmail(email)) {
        errorMessage.email = "Email is not valid";
    }

    if (errorMessage.email || errorMessage.password) {
        return res.status(422).json({ message: errorMessage });
    }

    try {
        const user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ message: "Email is already exists" });
        }

        const hashPassword = await bcrypt.hash(password, 8);

        const newUser = new User({ name, email, password: hashPassword });

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

const updatePassword = async (req, res) => {
    const { new_password, current_password } = req.body;

    try {
        const user = await User.findById(req.user_id);

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

export { login, logout, signup, updatePassword };
