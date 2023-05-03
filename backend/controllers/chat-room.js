import { User, ChatRoom, Notification } from "../models";

const changeAdminController = async (req, res) => {
    const userId = req.user_id;
    const { member } = req.body;
    const { chatRoomId } = req.params;

    try {
        const chatRoom = await ChatRoom.findById(chatRoomId);

        const { name, admin, members } = chatRoom;

        if (!chatRoom) {
            return res.status(400).json({ message: "Group doesn't exist" });
        }
        if (admin != userId) {
            return res.status(400).json({ message: "You don't have permission" });
        }
        if (!members.includes(member)) {
            return res.status(400).json({ message: "This user doesn't exist in group" });
        }

        await chatRoom.update({ admin: member });

        for (const memberId of members) {
            if (memberId != userId) {
                let content = `The admin of ${name} group has been updated`;
                if (memberId == member) {
                    content = `You are admin of ${name} group now`;
                }

                await new Notification({
                    content,
                    user: memberId,
                    chat_room: chatRoomId,
                    type: "CHATROOM-CHANGE_ADMIN",
                }).save();
            }
        }

        return res.status(200).json({ message: "Admin of group is changed" });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const joinChatRoomController = async (req, res) => {
    const userId = req.user_id;
    const { chatRoomId } = req.params;

    try {
        const chatRoom = await ChatRoom.findOne({ _id: chatRoomId, is_public: true });

        if (!chatRoom) {
            return res.status(400).json({ message: "Group doesn't exist" });
        }
        if (chatRoom.members.includes(userId)) {
            return res.status(400).json({ message: "You are already in group" });
        }

        await chatRoom.update({ $push: { members: userId } });

        return res.status(200).json({ message: `You have joined the group ${chatRoom.name}` });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const leaveChatRoomController = async (req, res) => {
    const userId = req.user_id;
    const { chatRoomId } = req.params;

    try {
        const chatRoom = await ChatRoom.findById(chatRoomId);

        if (!chatRoom) {
            return res.status(400).json({ message: "Group doesn't exist" });
        }
        if (userId == chatRoom.admin) {
            return res.status(400).json({ message: "Can't leave group when you're admin" });
        }

        await chatRoom.update({ $pull: { members: userId } });

        return res.status(200).json({ message: `You have left the group ${chatRoom.name}` });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const createChatRoomController = async (req, res) => {
    const userId = req.user_id;
    const { name, members, is_public, avatar_image } = req.body;

    try {
        const users = await User.find({ _id: { $in: members } });

        const membersValid = users.reduce((acc, cur) => {
            if (!cur.block_users.includes(userId) && cur.friends.includes(userId)) {
                return acc.concat(cur._id);
            } else {
                return acc;
            }
        }, []);

        await new ChatRoom({
            name,
            is_public,
            avatar_image,
            admin: userId,
            members: [...new Set(membersValid.concat(userId))],
        }).save();

        res.status(201).json({ message: "Group created successfully" });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const deleteChatRoomController = async (req, res) => {
    const userId = req.user_id;
    const { chatRoomId } = req.params;

    try {
        const chatRoom = await ChatRoom.findById(chatRoomId);

        const { name, admin, members } = chatRoom;

        if (!chatRoom) {
            return res.status(400).json({ message: "Group doesn't exist" });
        }
        if (admin != userId) {
            return res.status(400).json({ message: "You don't have permission" });
        }

        await chatRoom.remove();

        await Notification.deleteMany({ chat_room: chatRoomId });

        for (const memberId of members) {
            if (memberId != userId) {
                await new Notification({
                    user: memberId,
                    type: "CHATROOM-DELETE",
                    content: `${name} group has been deleted`,
                }).save();
            }
        }

        return res.status(200).json({ message: "Delete group successfully" });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const searchChatRoomsController = async (req, res) => {
    const pageSize = 5;
    const { name } = req.query;
    const page = parseInt(req.query.page) || 1;

    try {
        const query = { is_public: true, name: { $regex: name, $options: "i" } };

        const chatRooms = await ChatRoom.find(query, { _id: 1, name: 1, avatar_image: 1 })
            .limit(pageSize)
            .sort({ createdAt: -1 })
            .skip((page - 1) * pageSize);

        const count = await ChatRoom.countDocuments(query);

        return res.status(200).json({ message: "success", data: { count, rows: chatRooms } });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const getChatRoomsByUserController = async (req, res) => {
    const pageSize = 5;
    const userId = req.user_id;
    const page = parseInt(req.query.page) || 1;

    try {
        const query = { members: userId };

        const chatRooms = await ChatRoom.find(query, { _id: 1, name: 1, avatar_image: 1 })
            .limit(pageSize)
            .sort({ createdAt: -1 })
            .skip((page - 1) * pageSize);

        const count = await ChatRoom.countDocuments(query);

        return res.status(200).json({ message: "success", data: { count, rows: chatRooms } });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const updateNameChatRoomController = async (req, res) => {
    const { name } = req.body;
    const userId = req.user_id;
    const { chatRoomId } = req.params;

    try {
        const chatRoom = await ChatRoom.findById(chatRoomId);

        const { admin, members, name: chatRoomName } = chatRoom;

        if (!chatRoom) {
            return res.status(400).json({ message: "Group doesn't exist" });
        }
        if (admin != userId) {
            return res.status(400).json({ message: "You don't have permission" });
        }

        await chatRoom.update({ name });

        for (const memberId of members) {
            if (memberId != userId) {
                await new Notification({
                    user: memberId,
                    type: "CHATROOM-UPDATE_NAME",
                    content: `The name of ${chatRoomName} group has been changed to ${name}`,
                }).save();
            }
        }

        return res.status(200).json({ message: "Update group name successfully" });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const updateAvatarChatRoomController = async (req, res) => {
    const userId = req.user_id;
    const { avatar_image } = req.body;
    const { chatRoomId } = req.params;

    try {
        const chatRoom = await ChatRoom.findById(chatRoomId);

        if (!chatRoom) {
            return res.status(400).json({ message: "Group doesn't exist" });
        }
        if (chatRoom.admin != userId) {
            return res.status(400).json({ message: "You don't have permission" });
        }

        await chatRoom.update({ avatar_image });

        return res.status(200).json({ message: "Update group avatar successfully" });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const updateMemberChatRoomController = async (req, res) => {
    const userId = req.user_id;
    const { members } = req.body;
    const { chatRoomId } = req.params;

    try {
        const chatRoom = await ChatRoom.findById(chatRoomId);

        const { admin } = chatRoom;

        if (!chatRoom) {
            return res.status(400).json({ message: "Group doesn't exist" });
        }
        if (admin != userId) {
            return res.status(400).json({ message: "You don't have permission" });
        }

        const users = await User.find({ _id: { $in: members } });
        const newMembers = users.reduce((acc, cur) => {
            if (!cur.block_users.includes(userId)) {
                return acc.concat(cur._id);
            } else {
                return acc;
            }
        }, []);

        await chatRoom.update({ $push: { members: newMembers } });

        return res.status(200).json({ message: `Update members successfully` });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const updatePrivacyChatRoomController = async (req, res) => {
    const userId = req.user_id;
    const { is_public } = req.body;
    const { chatRoomId } = req.params;

    try {
        const chatRoom = await ChatRoom.findById(chatRoomId);

        if (!chatRoom) {
            return res.status(400).json({ message: "Group doesn't exist" });
        }
        if (chatRoom.admin != userId) {
            return res.status(400).json({ message: "You don't have permission" });
        }

        await chatRoom.update({ is_public });

        return res.status(200).json({
            message: `Group privacy has been changed to ${is_public ? "public" : "private"}`,
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const createChatRoomForTwoPeopleController = async (req, res) => {
    const userId = req.user_id;
    const { reciver } = req.body;

    try {
        const user = await User.findById(reciver);

        if (!user) {
            return res.status(400).json({ message: "User doesn't exist" });
        }
        if (user.block_users.includes(userId)) {
            return res.status(400).json({ message: "Can't send message to this user" });
        }

        await new ChatRoom({
            admin: null,
            is_public: false,
            members: [reciver, userId],
        }).save();

        res.status(201).json({ message: "success" });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

export {
    changeAdminController,
    joinChatRoomController,
    leaveChatRoomController,
    createChatRoomController,
    deleteChatRoomController,
    searchChatRoomsController,
    getChatRoomsByUserController,
    updateNameChatRoomController,
    updateAvatarChatRoomController,
    updateMemberChatRoomController,
    updatePrivacyChatRoomController,
    createChatRoomForTwoPeopleController,
};
