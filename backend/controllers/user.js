import { User } from "../models";

const unfriendController = async (req, res) => {
    const useId = req.user_id;
    const friendId = req.params.friendId;

    try {
        const user = await User.findById(useId);
        const friend = await User.findById(friendId);

        if (!friend) {
            return res.status(400).json({ message: "Friend doesn't exist" });
        }

        const indexUserId = friend.friends.indexOf(useId);
        const indexFriendId = user.friends.indexOf(friendId);

        if (indexUserId !== -1) {
            friend.friends.splice(indexUserId, 1);
            await friend.save();
        }
        if (indexFriendId !== -1) {
            user.friends.splice(indexFriendId, 1);
            await user.save();
        }

        return res.status(201).json({ message: "Unfriended successfully" });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const getUserByIdController = async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.findOne({ is_active: true, _id: userId }, { password: 0 });

        if (!user) {
            return res.status(400).json({ error: "User doesn't exist" });
        }

        return res.status(200).json({ data: user, message: "success" });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const searchUsersController = async (req, res) => {
    const pageSize = 5;
    const { name } = req.query;
    const page = parseInt(req.query.page);

    try {
        const query = { is_active: true, name: { $regex: name, $options: "i" } };

        const users = await User.find(query, {
            _id: 1,
            name: 1,
            avatar_image: 1,
        })
            .limit(pageSize)
            .skip((page - 1) * pageSize);

        if (!users.length) {
            return res.status(400).json({ message: "Users not found" });
        }

        const count = await User.countDocuments(query);

        return res.status(200).json({ message: "success", data: { count, rows: users } });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const deleteAccountController = async (req, res) => {
    const useId = req.user_id;

    try {
        const user = await User.findById(useId);

        if (!user) {
            return res.status(400).json({ message: "User doesn't exist" });
        }

        await user.remove();

        return res.status(200).json({ message: "success" });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const updateProfileController = async (req, res) => {
    const useId = req.user_id;
    const { name, hometown, education } = req.body;

    try {
        const user = await User.findById(useId);
        if (!user) {
            return res.status(400).json({ message: "User doesn't exist" });
        }

        await user.update({ name, hometown, education });

        return res.status(200).json({ message: "Update profile successfully" });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const updatePasswordController = async (req, res) => {
    const useId = req.user_id;
    const { new_password, current_password } = req.body;

    try {
        const user = await User.findById(useId);
        if (!user) {
            return res.status(400).json({ message: "User doesn't exist" });
        }

        const isMatchPassword = await bcrypt.compare(current_password, user.password);
        if (!isMatchPassword) {
            return res.status(400).json({ error: "Incorrect current password" });
        }

        const hashPassword = await bcrypt.hash(new_password, 8);

        await user.update({ password: hashPassword });

        return res.status(200).json({ message: "Password has been updated" });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const getCurrentUserController = async (req, res) => {
    const useId = req.user_id;

    try {
        const user = await User.findById(useId, { password: 0 });

        if (!user) {
            return res.status(400).json({ message: "User doesn't exist" });
        }

        return res.status(200).json({ data: user, message: "success" });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const updateCoverImageController = async (req, res) => {
    const useId = req.user_id;
    const { cover_image } = req.body;

    try {
        const user = await User.findById(useId);

        if (!user) {
            return res.status(400).json({ message: "User doesn't exist" });
        }

        await user.update({ cover_image });

        return res.status(200).json({ message: "success" });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const getRecommendUsersController = async (req, res) => {
    const pageSize = 5;
    const userId = req.user_id;
    const page = parseInt(req.query.page);

    try {
        const user = await User.findOne({ _id: userId, is_active: true }).populate("friends");

        const recommendUserIds = [
            ...new Set(user.friends.reduce((acc, cur) => acc.concat(cur.friends), [])),
        ];

        const userIndex = recommendUserIds.indexOf(userId);
        if (userIndex !== -1) {
            recommendUserIds.splice(userIndex, 1);
        }

        const query = { _id: { $in: recommendUserIds } };
        const recommendUsers = await User.find(query, { _id: 1, name: 1, avatar_image: 1 })
            .limit(pageSize)
            .skip((page - 1) * pageSize);
        const count = await User.countDocuments(query);

        return res.status(200).json({ message: "success", data: { count, rows: recommendUsers } });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const updateAvatarImageController = async (req, res) => {
    const useId = req.user_id;
    const { avatar_image } = req.body;

    try {
        const user = await User.findById(useId);

        if (!user) {
            return res.status(400).json({ message: "User doesn't exist" });
        }

        await user.update({ avatar_image });

        return res.status(200).json({ message: "success" });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

export {
    unfriendController,
    getUserByIdController,
    searchUsersController,
    deleteAccountController,
    updateProfileController,
    updatePasswordController,
    getCurrentUserController,
    updateCoverImageController,
    getRecommendUsersController,
    updateAvatarImageController,
};
