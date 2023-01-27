import User from "../models/User";
import { userFilter } from "../utils/filter-data";
import Notification from "../models/Notification";

const updateProfilePic = async (req, res) => {
    const { profile_url } = req.body;
    try {
        const user = await User.findById(req.user_id);
        user.profile_pic = profile_url;
        await user.save();

        const getUser = await User.findById(req.user_id).populate("friends");
        const userData = userFilter(getUser);

        const friends = getUser.friends.map((friend) => {
            return {
                ...userFilter(friend),
            };
        });

        userData.friends = friends;
        res.status(200).json({ message: "profile image updated", user: userData });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Something went wrong" });
    }
};

const updateCoverPic = async (req, res) => {
    const { cover_url } = req.body;
    try {
        const user = await User.findById(req.user_id);
        user.cover_image = cover_url;
        await user.save();

        const getUser = await User.findById(req.user_id).populate("friends");
        const userData = userFilter(getUser);

        const friends = getUser.friends.map((friend) => {
            return {
                ...userFilter(friend),
            };
        });

        userData.friends = friends;
        res.status(200).json({ message: "profile image updated", user: userData });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Something went wrong" });
    }
};

const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user_id);

        if (req.params.input === "name") {
            user.name = req.body.name;
        }
        if (req.params.input === "email") {
            user.email = req.body.email;
        }

        if (req.params.input === "bio") {
            user.bio = req.body.bio;
        }
        if (req.params.input === "location") {
            user.location = req.body.location;
        }
        if (req.params.input === "education") {
            user.education = req.body.education;
        }

        await user.save();
        res.status(200).json({ message: "Updated Successfully" });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Something went wrong" });
    }
};

const clearNotification = async (req, res) => {
    try {
        await Notification.deleteMany({ user: req.user_id });
        res.status(200).json({ message: "Notification Cleared Successfully" });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Something went wrong" });
    }
};

const fetchUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.user_id).populate("friends");
        const userData = userFilter(user);

        res.status(200).json({ user: userData });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Something went wrong" });
    }
};

const fetchRecommandedUsers = async (req, res) => {
    try {
        const users = await User.find().where("_id").ne(req.user_id).populate("friends");

        const usersData = users.map((user) => {
            return userFilter(user);
        });
        res.status(200).json({ users: usersData });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Something went wrong" });
    }
};

const me = async (req, res) => {
    try {
        const userId = req.user_id;

        const user = await User.findById(userId).populate("friends");

        if (!user) {
            return res.status(404).json({ error: "User is not found" });
        }

        const userData = userFilter(user);
        userData.friends = user.friends.map((friend) => ({ ...userFilter(friend) }));

        const notifications = await Notification.find({ user: userId }).sort({ createdAt: -1 });
        const notifData = notifications.map((notif) => ({
            id: notif.id,
            body: notif.body,
            createdAt: notif.createdAt,
        }));

        res.status(200).json({ user: userData, notifications: notifData });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const searchUsers = async (req, res) => {
    try {
        const users = await User.find({
            name: { $regex: req.query.name, $options: "i" },
        }).populate("friends");

        const usersData = users.map((user) => userFilter(user));

        res.status(200).json({ users: usersData });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Something went wrong" });
    }
};

export {
    updateProfilePic,
    updateCoverPic,
    updateProfile,
    clearNotification,
    fetchRecommandedUsers,
    fetchUserById,
    me,
    searchUsers,
};
