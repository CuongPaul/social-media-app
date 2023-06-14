import redisClient from "../helpers/redis";
import { User, FriendRequest } from "../models";

const unfriendController = async (req, res) => {
    const userId = req.user_id;
    const friendId = req.params.friendId;

    try {
        const user = await User.findById(userId);
        const friend = await User.findById(friendId);

        if (!friend) {
            return res.status(400).json({ message: "Friend doesn't exist" });
        }

        await user.updateOne({ $pull: { friends: friendId } });
        await friend.updateOne({ $pull: { friends: userId } });

        return res.status(200).json({ message: "Unfriended successfully" });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const blockUserController = async (req, res) => {
    const userId = req.user_id;
    const userIdBlocked = req.params.userId;

    try {
        if (userId == userIdBlocked) {
            return res.status(400).json({ message: "Can't block yourself" });
        }

        const user = await User.findById(userId);

        const userBlocked = await User.findById(userIdBlocked);
        if (!userBlocked) {
            return res.status(400).json({ message: "User doesn't exist" });
        }

        await user.updateOne({ $push: { block_users: userIdBlocked } });

        return res.status(200).json({ message: `You blocked ${userBlocked.name}` });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const getUserByIdController = async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.findById(userId, { password: 0, chat_rooms: 0 }).populate(
            "friends",
            { _id: 1, name: 1, friends: 1, avatar_image: 1 }
        );

        if (!user) {
            return res.status(400).json({ message: "User doesn't exist" });
        }

        return res.status(200).json({ data: user, message: "success" });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const searchUsersController = async (req, res) => {
    const pageSize = 10;
    const userId = req.user_id;
    const { name } = req.query;
    const page = parseInt(req.query.page) || 1;

    try {
        const query = {
            _id: { $ne: userId },
            block_users: { $nin: [userId] },
            name: { $regex: name, $options: "i" },
        };

        const users = await User.find(query, { _id: 1, name: 1, avatar_image: 1 })
            .limit(pageSize)
            .skip((page - 1) * pageSize);

        const count = await User.countDocuments(query);

        return res.status(200).json({ message: "success", data: { count, rows: users } });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const unblockUserController = async (req, res) => {
    const userId = req.user_id;
    const userIdUnblocked = req.params.userId;

    try {
        const user = await User.findById(userId);

        const userBlocked = await User.findById(userIdUnblocked);
        if (!userBlocked) {
            return res.status(400).json({ message: "User doesn't exist" });
        }

        await user.updateOne({ $pull: { block_users: userIdUnblocked } });

        return res.status(200).json({ message: `You unblocked ${userBlocked.name}` });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const updateProfileController = async (req, res) => {
    const userId = req.user_id;
    const { name, gender, hometown, education } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ message: "User doesn't exist" });
        }

        await user.updateOne({ name, gender, hometown, education });

        return res.status(200).json({ message: "Update profile successfully" });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const searchFriendsController = async (req, res) => {
    const pageSize = 10;
    const userId = req.user_id;
    const { name } = req.query;
    const page = parseInt(req.query.page) || 1;

    try {
        const query = {
            friends: userId,
            _id: { $ne: userId },
            block_users: { $nin: [userId] },
            name: { $regex: name, $options: "i" },
        };

        const users = await User.find(query, {
            _id: 1,
            name: 1,
            avatar_image: 1,
        })
            .limit(pageSize)
            .skip((page - 1) * pageSize);

        const count = await User.countDocuments(query);

        return res.status(200).json({ message: "success", data: { count, rows: users } });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const updatePasswordController = async (req, res) => {
    const userId = req.user_id;
    const { new_password, current_password } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ message: "User doesn't exist" });
        }

        const isMatchPassword = await bcrypt.compare(current_password, user.password);
        if (!isMatchPassword) {
            return res.status(400).json({ message: "Incorrect current password" });
        }

        const hashPassword = await bcrypt.hash(new_password, 8);

        await user.updateOne({ password: hashPassword });

        return res.status(200).json({ message: "Password has been updated" });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const getCurrentUserController = async (req, res) => {
    const userId = req.user_id;

    try {
        const user = await User.findById(userId, { password: 0, chat_rooms: 0 }).populate(
            "friends",
            { _id: 1, name: 1, avatar_image: 1 }
        );

        if (!user) {
            return res.status(400).json({ message: "User doesn't exist" });
        }

        return res.status(200).json({ data: user, message: "success" });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const getOnlineFriendsController = async (req, res) => {
    const userId = req.user_id;

    try {
        const user = await User.findById(userId).populate("friends");

        const friendsOnline = [];
        for (const item of user.friends) {
            const sockets = await redisClient.LRANGE(`socket-io:${item._id}`, 0, -1);

            if (sockets.length) {
                const { _id, name, avatar_image } = item;
                friendsOnline.push({ _id, name, sockets, avatar_image });
            }
        }

        return res.status(200).json({
            message: "success",
            data: { rows: friendsOnline, count: friendsOnline.length },
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const updateCoverImageController = async (req, res) => {
    const userId = req.user_id;
    const { cover_image } = req.body;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({ message: "User doesn't exist" });
        }

        await user.updateOne({ cover_image });

        return res.status(200).json({ message: "success" });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const getRecommendUsersController = async (req, res) => {
    const pageSize = 10;
    const userId = req.user_id;
    const page = parseInt(req.query.page) || 1;

    try {
        const user = await User.findById(userId).populate("friends");

        const recommendUserIds = [
            ...new Set(
                user.friends
                    .reduce((acc, cur) => acc.concat(cur.friends), [])
                    .map((item) => String(item))
            ),
        ];

        const userIndex = recommendUserIds.findIndex((item) => item == userId);
        if (userIndex != -1) {
            recommendUserIds.splice(userIndex, 1);
        }

        const friendRequests = await FriendRequest.find({
            is_accepted: false,
            $or: [{ sender: userId }, { receiver: userId }],
        });
        for (const request of friendRequests) {
            const indexOfSender = recommendUserIds.findIndex((item) => item == request.sender);
            if (indexOfSender !== -1) {
                recommendUserIds.splice(indexOfSender, 1);
            }

            const indexOfReceiver = recommendUserIds.findIndex((item) => item == request.receiver);
            if (indexOfReceiver !== -1) {
                recommendUserIds.splice(indexOfReceiver, 1);
            }
        }

        const query = {
            _id: {
                $in: recommendUserIds.filter(
                    (item) => !user.friends.some((element) => String(item) == String(element._id))
                ),
            },
        };
        const recommendUsers = await User.find(query, {
            _id: 1,
            name: 1,
            friends: 1,
            avatar_image: 1,
        })
            .limit(pageSize)
            .skip((page - 1) * pageSize);
        const count = await User.countDocuments(query);

        return res.status(200).json({ message: "success", data: { count, rows: recommendUsers } });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const updateAvatarImageController = async (req, res) => {
    const userId = req.user_id;
    const { avatar_image } = req.body;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({ message: "User doesn't exist" });
        }

        await user.updateOne({ avatar_image });

        return res.status(200).json({ message: "success" });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

export {
    unfriendController,
    blockUserController,
    getUserByIdController,
    searchUsersController,
    unblockUserController,
    updateProfileController,
    searchFriendsController,
    updatePasswordController,
    getCurrentUserController,
    getOnlineFriendsController,
    updateCoverImageController,
    getRecommendUsersController,
    updateAvatarImageController,
};
