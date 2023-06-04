import { User, ChatRoom, Message, Notification } from "../models";

const changeAdminController = async (req, res) => {
    const userId = req.user_id;
    const { new_admin } = req.body;
    const { chatRoomId } = req.params;

    try {
        const chatRoom = await ChatRoom.findById(chatRoomId);
        if (!chatRoom) {
            return res.status(400).json({ message: "Group doesn't exist" });
        }

        const { name, admin, members, avatar_image, is_public } = chatRoom;

        const isTwoPeopleChatRoom =
            !is_public && name == "" && admin == null && members.length == 2 && avatar_image == "";

        if (admin != userId || isTwoPeopleChatRoom) {
            return res.status(403).json({ message: "You don't have permission" });
        }
        if (!members.includes(new_admin)) {
            return res.status(400).json({ message: "This user doesn't exist in group" });
        }

        await chatRoom.updateOne({ admin: new_admin });

        for (const memberId of members) {
            if (memberId != userId) {
                let content = `The admin of ${name} group has been updated`;

                if (memberId == new_admin) {
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
        const chatRoom = await ChatRoom.findOne({ _id: chatRoomId, is_public: true }).populate(
            "members",
            { _id: 1, name: 1, avatar_image: 1 }
        );

        if (!chatRoom) {
            return res.status(400).json({ message: "Group doesn't exist" });
        }
        if (chatRoom.members.includes(userId)) {
            return res.status(400).json({ message: "You are already in group" });
        }

        await chatRoom.updateOne({ $push: { members: userId } });
        await User.findByIdAndUpdate(userId, { $push: { chat_rooms: { _id: chatRoom._id } } });

        return res.status(200).json({
            data: {
                _id: chatRoom._id,
                unseen_message: 0,
                name: chatRoom.name,
                members: chatRoom.members,
                avatar_image: chatRoom.avatar_image,
            },
            message: `You have joined the group ${chatRoom.name}`,
        });
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

        await chatRoom.updateOne({ $pull: { members: userId } });
        await User.findByIdAndUpdate(userId, { $pull: { chat_rooms: { _id: chatRoomId } } });

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

        const membersId = users.reduce(
            (acc, cur) => (cur.block_users.includes(userId) ? acc : acc.concat(cur._id)),
            []
        );
        const membersValid = [...new Set(membersId.concat(userId))];

        const chatRoom = await new ChatRoom({
            name,
            is_public,
            avatar_image,
            admin: userId,
            members: membersValid,
        })
            .save()
            .then((res) =>
                res.populate("members", { _id: 1, name: 1, avatar_image: 1 }).execPopulate()
            );

        for (const memberId of membersValid) {
            if (memberId != userId) {
                await new Notification({
                    user: memberId,
                    chat_room: chatRoom._id,
                    type: "CHATROOM-CREATE",
                    content: `You have been added to the group ${name}`,
                }).save();
            }

            await User.findByIdAndUpdate(memberId, {
                $push: { chat_rooms: { _id: chatRoom._id } },
            });
        }

        res.status(200).json({
            data: {
                _id: chatRoom._id,
                unseen_message: 0,
                name: chatRoom.name,
                members: chatRoom.members,
                avatar_image: chatRoom.avatar_image,
            },
            message: `Group ${name} is created with ${membersValid.length} members`,
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const deleteChatRoomController = async (req, res) => {
    const userId = req.user_id;
    const { chatRoomId } = req.params;

    try {
        const chatRoom = await ChatRoom.findById(chatRoomId);
        if (!chatRoom) {
            return res.status(400).json({ message: "Group doesn't exist" });
        }

        const { name, admin, members } = chatRoom;

        if (admin != userId) {
            return res.status(403).json({ message: "You don't have permission" });
        }

        await chatRoom.remove();

        for (const memberId of members) {
            if (memberId != userId) {
                await new Notification({
                    user: memberId,
                    type: "CHATROOM-DELETE",
                    content: `Group ${name} has been deleted`,
                }).save();
            }

            await User.findByIdAndUpdate(memberId, {
                $pull: { chat_rooms: { _id: chatRoom._id } },
            });
        }

        return res.status(200).json({ message: `Group ${name} has been deleted` });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const searchChatRoomsController = async (req, res) => {
    const pageSize = 10;
    const { name } = req.query;
    const userId = req.user_id;
    const page = parseInt(req.query.page) || 1;

    try {
        const query = {
            $or: [
                { name: { $regex: name, $options: "i" }, is_public: true },
                { name: { $regex: name, $options: "i" }, is_public: false, members: userId },
            ],
        };

        const chatRooms = await ChatRoom.find(query, {
            _id: 1,
            name: 1,
            members: 1,
            avatar_image: 1,
        })
            .limit(pageSize)
            .sort({ createdAt: -1 })
            .skip((page - 1) * pageSize);

        const count = await ChatRoom.countDocuments(query);

        const chatRoomsData = chatRooms.map((item) => {
            if (
                !item.name &&
                !item.admin &&
                !item.is_public &&
                !item.avatar_image &&
                item.members.length == 2
            ) {
                const reciver = item.members.find((member) => member != userId);

                return {
                    _id: item._id,
                    name: reciver.name,
                    members: item.members,
                    avatar_image: reciver.avatar_image,
                };
            }

            return {
                _id: item._id,
                name: item.name,
                members: item.members,
                avatar_image: item.avatar_image,
            };
        });

        return res.status(200).json({ message: "success", data: { count, rows: chatRoomsData } });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const getChatRoomsByUserController = async (req, res) => {
    const pageSize = 10;
    const userId = req.user_id;
    const page = parseInt(req.query.page) || 1;

    try {
        const query = { members: userId };

        const user = await User.findById(userId);
        const chatRooms = await ChatRoom.find(query, {
            _id: 1,
            name: 1,
            admin: 1,
            members: 1,
            avatar_image: 1,
        })
            .lean()
            .limit(pageSize)
            .sort({ createdAt: -1 })
            .skip((page - 1) * pageSize)
            .populate("members", { _id: 1, name: 1, avatar_image: 1 });

        const result = [];
        for (const chatRoom of chatRooms) {
            const index = user.chat_rooms.findIndex(
                (item) => String(item._id) == String(chatRoom._id)
            );

            let unseen_message = 0;
            if (index != -1) {
                const { furthest_unseen_message } = user.chat_rooms[index];
                if (furthest_unseen_message) {
                    const furthestUnseenMessage = await Message.findById(furthest_unseen_message);

                    const unseenMessages = await Message.find({
                        chat_room: chatRoom._id,
                        createdAt: { $gte: furthestUnseenMessage.createdAt },
                    });

                    unseen_message = unseenMessages.length;
                }
            }

            // With chatroom for 2 people, it doesn't exist name and avatar => Get name and avatar of remaining person
            if (
                !chatRoom.name &&
                !chatRoom.admin &&
                !chatRoom.is_public &&
                !chatRoom.avatar_image &&
                chatRoom.members.length == 2
            ) {
                const friend = chatRoom.members.find((member) => member._id != userId);

                chatRoom.name = friend.name;
                chatRoom.avatar_image = friend.avatar_image;
            }
            result.push({ ...chatRoom, unseen_message });
        }

        const count = await ChatRoom.countDocuments(query);

        return res.status(200).json({ message: "success", data: { count, rows: result } });
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
        if (!chatRoom) {
            return res.status(400).json({ message: "Group doesn't exist" });
        }

        const { admin, members, avatar_image, is_public, name: chatRoomName } = chatRoom;

        const isTwoPeopleChatRoom =
            !is_public &&
            admin == null &&
            avatar_image == "" &&
            chatRoomName == "" &&
            members.length == 2;

        if (admin != userId && !isTwoPeopleChatRoom) {
            return res.status(403).json({ message: "You don't have permission" });
        }
        if (!chatRoom.members.includes(userId)) {
            return res.status(403).json({ message: "You aren't in group" });
        }

        await chatRoom.updateOne({ name });

        for (const memberId of members) {
            if (memberId != userId) {
                await new Notification({
                    user: memberId,
                    type: "CHATROOM-UPDATE_NAME",
                    content: `The name of ${chatRoomName} group has been changed to ${name}`,
                }).save();
            }
        }

        return res
            .status(200)
            .json({ message: `The name of ${chatRoomName} group has been changed to ${name}` });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const addMembersToChatRoomController = async (req, res) => {
    const userId = req.user_id;
    const { members } = req.body;
    const { chatRoomId } = req.params;

    try {
        const chatRoom = await ChatRoom.findById(chatRoomId);
        if (!chatRoom) {
            return res.status(400).json({ message: "Group doesn't exist" });
        }

        const { name, admin, is_public, avatar_image, members: chatRoomMembers } = chatRoom;

        const isTwoPeopleChatRoom =
            !is_public &&
            name == "" &&
            admin == null &&
            avatar_image == "" &&
            chatRoomMembers.length == 2;
        if (admin != userId || isTwoPeopleChatRoom) {
            return res.status(403).json({ message: "You don't have permission" });
        }

        const users = await User.find({ _id: { $in: members } });

        const membersId = users.reduce(
            (acc, cur) => (cur.block_users.includes(userId) ? acc : acc.concat(cur._id)),
            []
        );
        const membersValid = [...new Set(membersId)];

        await chatRoom.updateOne({ $push: { members: membersValid } });

        const { nModified } = await User.updateMany(
            { _id: { $in: membersValid } },
            { $push: { chat_rooms: { _id: chatRoom._id } } }
        );

        return res
            .status(200)
            .json({ message: `${nModified} members have been added to the group` });
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

        const { name, admin, members, is_public, avatar_image: avatarImageChatRoom } = chatRoom;

        const isTwoPeopleChatRoom =
            !is_public &&
            name == "" &&
            admin == null &&
            members.length == 2 &&
            avatarImageChatRoom == "";

        if (admin != userId || isTwoPeopleChatRoom) {
            return res.status(403).json({ message: "You don't have permission" });
        }

        await chatRoom.updateOne({ avatar_image });

        return res.status(200).json({ message: "Update group avatar successfully" });
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

        const { name, admin, members, avatar_image, is_public: privacyChatRoom } = chatRoom;

        const isTwoPeopleChatRoom =
            name == "" &&
            admin == null &&
            !privacyChatRoom &&
            avatar_image == "" &&
            members.length == 2;

        if (admin != userId || isTwoPeopleChatRoom) {
            return res.status(403).json({ message: "You don't have permission" });
        }

        await chatRoom.updateOne({ is_public });

        return res.status(200).json({
            message: `Group privacy has been changed to ${is_public ? "public" : "private"}`,
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const removeMembersFromChatRoomController = async (req, res) => {
    const userId = req.user_id;
    const { members } = req.body;
    const { chatRoomId } = req.params;

    try {
        const chatRoom = await ChatRoom.findById(chatRoomId);
        if (!chatRoom) {
            return res.status(400).json({ message: "Group doesn't exist" });
        }

        const { name, admin, is_public, avatar_image, members: chatRoomMembers } = chatRoom;

        const isTwoPeopleChatRoom =
            !is_public &&
            name == "" &&
            admin == null &&
            avatar_image == "" &&
            chatRoomMembers.length == 2;

        if (admin != userId || isTwoPeopleChatRoom) {
            return res.status(403).json({ message: "You don't have permission" });
        }

        const membersRemoved = await User.find({ _id: { $in: members } });
        const membersRemovedValid = [...new Set(membersRemoved.map((item) => item._id))];

        await chatRoom.updateOne({
            $pull: { members: { $in: membersRemovedValid } },
        });

        await User.updateMany(
            { _id: { $in: membersRemovedValid } },
            { $pull: { chat_rooms: { _id: chatRoom._id } } }
        );

        return res.status(200).json({
            message: `${membersRemovedValid.length} members have been remove from the group`,
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const createChatRoomForTwoPeopleController = async (req, res) => {
    const userId = req.user_id;
    const reciverId = req.body.reciver;

    try {
        const sender = await User.findById(userId);
        const reciver = await User.findById(reciverId);

        if (!reciver) {
            return res.status(400).json({ message: "User doesn't exist" });
        }
        if (reciver.block_users.includes(userId)) {
            return res.status(400).json({ message: "Can't send message to this user" });
        }

        const chatRoom = await new ChatRoom({
            is_public: false,
            members: [userId, reciverId],
        }).save();

        await sender.updateOne({ $push: { chat_rooms: { _id: chatRoom._id } } });
        await reciver.updateOne({ $push: { chat_rooms: { _id: chatRoom._id } } });

        const responseData = {
            _id: chatRoom._id,
            unseen_message: 0,
            name: reciver.name,
            members: chatRoom.members,
            avatar_image: reciver.avatar_image,
        };

        res.status(200).json({ message: "success", data: responseData });
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
    addMembersToChatRoomController,
    updateAvatarChatRoomController,
    updatePrivacyChatRoomController,
    removeMembersFromChatRoomController,
    createChatRoomForTwoPeopleController,
};
