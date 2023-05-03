import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { User } from "../models";

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

        return res.status(200).json({ data: { token }, message: "Logged in successfully" });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const signupController = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ error: "Email already exists" });
        }

        const hashPassword = await bcrypt.hash(password, 8);

        await new User({ name, email, password: hashPassword }).save();

        return res.status(200).json({ message: "Account successfully created" });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

export { signinController, signupController };
