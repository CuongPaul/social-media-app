import User from "../../models/User";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import ValidateEmail from "../../utils/ValidateEmail";

export default async (req, res) => {
    const { name, email, password } = req.body;
    let error = {};
    if (!name || name.trim().length === 0) {
        error.name = "name field must be required";
    }
    if (!ValidateEmail(email)) {
        error.email = "email address should be valid ";
    }
    if (!email || email.trim().length === 0) {
        error.email = "email field must be required";
    }
    if (!password || password.trim().length === 0) {
        error.password = "password must be required";
    }

    if (Object.keys(error).length) {
        return res.status(422).json({ error });
    }

    try {
        const user = await User.findOne({ email });
        if (user) res.status(400).json({ error: "email already exists" });

        const hashPassword = await bcrypt.hash(password, 8);

        const registerUser = new User({
            name,
            email,
            password: hashPassword,
        });

        const saveUser = await registerUser.save();

        const token = jwt.sign({ userId: saveUser.id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRE,
        });

        saveUser.active = true;
        await saveUser.save();

        res.status(201).json({
            message: `Account created for ${email}`,
            data: {
                token,
            },
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Something went wrong" });
    }
};
