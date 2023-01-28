import User from "../models/User";
import isValidEmail from "../utils/validate-email";
import { userDataFilter } from "../utils/filter-data";

const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).populate("friends");

        if (!user) {
            return res.status(404).json({ error: "User is not exist" });
        }

        res.status(200).json({ message: "Get user is successfully", data: userDataFilter(user) });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const searchUsers = async (req, res) => {
    try {
        const users = await User.find({ name: { $regex: req.query.name, $options: "i" } }).populate(
            "friends"
        );

        const usersData = users.map((user) => userDataFilter(user));

        res.status(200).json({ message: "Search user is successfully", data: usersData });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const updateProfile = async (req, res) => {
    const { name, email, hometown, education } = req.body;

    if (!name || name.trim().length === 0) {
        return res.status(422).json({ message: "Name is require" });
    }
    if (!email || email.trim().length === 0) {
        return res.status(422).json({ message: "Email is require" });
    }
    if (!isValidEmail(email)) {
        return res.status(422).json({ message: "Email is not valid" });
    }

    try {
        await User.findByIdAndUpdate(req.user_id, {
            name,
            email,
            hometown,
            education,
        });

        res.status(200).json({ message: "Update profile is successfully" });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user_id).populate("friends");

        if (!user) {
            return res.status(404).json({ error: "User is not exist" });
        }

        res.status(200).json({
            message: "Get current is successfully",
            data: userDataFilter(user),
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const updateCoverImage = async (req, res) => {
    try {
        const { cover_image } = req.body;

        await User.findByIdAndUpdate(req.user_id, { cover_image });

        res.status(200).json({ message: "Update cover image is successfully" });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const getRecommendUsers = async (req, res) => {
    try {
        const user = await User.findById(req.user_id).populate("friends");

        const userIdRelatedtToFriends = user.friends.map((friend) => friend.friends);

        const recommendUserId = new Set([
            ...userIdRelatedtToFriends.reduce((acc, cur) => acc.concat(cur), []),
        ]);

        const recommendUsers = await User.find({ id: { $in: recommendUserId } });

        const usersData = userDataFilter(recommendUsers);

        res.status(200).json({ message: "Get recommend user is successfully", users: usersData });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const updateAvatarImage = async (req, res) => {
    try {
        const { avatar_image } = req.body;

        await User.findByIdAndUpdate(req.user_id, { avatar_image });

        res.status(200).json({ message: "Update avatar is successfully" });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

export {
    getUserById,
    searchUsers,
    updateProfile,
    getCurrentUser,
    updateCoverImage,
    getRecommendUsers,
    updateAvatarImage,
};
