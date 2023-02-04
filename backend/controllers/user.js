import User from "../models/User";
import isValidEmail from "../utils/validate-email";
import { userDataFilter } from "../utils/filter-data";

const unfriend = async (req, res) => {
    const useId = req.user_id;
    const friendId = req.params.friendId;

    try {
        const user = await User.findById(useId);
        const friend = await User.findById(friendId);

        if (!friend) {
            return res.status(404).json({ message: "Friend doesn't exist" });
        }

        const indexUserId = friend.friends.indeindexOf(useId);
        const indexFriendId = user.friends.indeindexOf(friendId);

        if (indexUserId !== -1) {
            friend.friends.splice(indexUserId, 1);
            await friend.save();
        }
        if (indexFriendId !== -1) {
            user.friends.splice(indexFriendId, 1);
            await user.save();
        }

        res.status(201).json({ message: "Unfriended successfully" });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).populate("friends");

        if (!user) {
            return res.status(404).json({ error: "User doesn't exist" });
        }

        res.status(200).json({
            message: "Successfully",
            data: userDataFilter(user),
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const searchUsers = async (req, res) => {
    try {
        const users = await User.find({
            name: { $regex: req.query.name, $options: "i" },
        }).populate("friends");

        if (!users.length) {
            return res.status(404).json({ message: "User not found" });
        }

        const usersData = users.map((user) => userDataFilter(user));

        res.status(200).json({ message: "Successfully", data: usersData });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const updateProfile = async (req, res) => {
    const { name, email, hometown, education } = req.body;

    if (!name || !name.trim().length) {
        return res.status(422).json({ message: "Name is required" });
    }
    if (!email || !email.trim().length) {
        return res.status(422).json({ message: "Email is required" });
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

        res.status(200).json({ message: "Update profile successfully" });
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

const updateCoverImage = async (req, res) => {
    const { cover_image } = req.body;

    try {
        await User.findByIdAndUpdate(req.user_id, { cover_image });

        res.status(200).json({ message: "Successfully" });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const getRecommendUsers = async (req, res) => {
    try {
        const user = await User.findById(req.user_id).populate("friends");

        const userIdRelatedtToFriends = user.friends.map(
            (friend) => friend.friends
        );

        const recommendUserId = new Set([
            ...userIdRelatedtToFriends.reduce(
                (acc, cur) => acc.concat(cur),
                []
            ),
        ]);

        const recommendUsers = await User.find({
            id: { $in: recommendUserId },
        });

        const recommendUsersData = recommendUsers.map((recommendUser) =>
            userDataFilter(recommendUser)
        );

        res.status(200).json({
            message: "Successfully",
            data: recommendUsersData,
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const updateAvatarImage = async (req, res) => {
    const { avatar_image } = req.body;

    try {
        await User.findByIdAndUpdate(req.user_id, { avatar_image });

        res.status(200).json({ message: "Successfully" });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

export {
    unfriend,
    getUserById,
    searchUsers,
    updateProfile,
    updatePassword,
    updateCoverImage,
    getRecommendUsers,
    updateAvatarImage,
};
