import redisClient from "../helpers/redis";
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

        const { name, admin, members, is_public, avatar_image } = chatRoom;

        const isTwoPeopleChatRoom =
            !is_public && name == "" && admin == null && avatar_image == "" && members.length == 2;

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

                const notification = await new Notification({
                    content,
                    user: memberId,
                    chat_room: chatRoomId,
                    type: "CHATROOM-CHANGE_ADMIN",
                }).save();

                const sockets = await redisClient.LRANGE(`socket-io:${memberId}`, 0, -1);
                if (sockets.length) {
                    sockets.forEach((socketId) => {
                        req.io.sockets.to(socketId).emit("change-admin-chatroom", {
                            new_admin,
                            notification,
                            chat_room_id: chatRoomId,
                        });
                    });
                }
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

        const user = await User.findById(userId, { _id: 1, name: 1, avatar_image: 1 });
        await user.updateOne({ $push: { chat_rooms: { _id: chatRoom._id } } });

        const responseData = {
            _id: chatRoom._id,
            unseen_message: 0,
            name: chatRoom.name,
            admin: chatRoom.admin,
            avatar_image: chatRoom.avatar_image,
            members: [...chatRoom.members, user],
        };

        return res.status(200).json({
            data: responseData,
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

        const chatRoom = await new ChatRoom({
            name,
            is_public,
            avatar_image,
            admin: userId,
            members: [userId, ...membersId],
        })
            .save()
            .then((res) =>
                res.populate("members", { _id: 1, name: 1, avatar_image: 1 }).execPopulate()
            );

        const chatRoomData = {
            admin: userId,
            _id: chatRoom._id,
            unseen_message: 0,
            name: chatRoom.name,
            members: chatRoom.members,
            is_public: chatRoom.is_public,
            avatar_image: chatRoom.avatar_image,
        };

        for (const memberId of membersId) {
            if (memberId != userId) {
                const notification = await new Notification({
                    user: memberId,
                    chat_room: chatRoom._id,
                    type: "CHATROOM-CREATE",
                    content: `You have been added to the group ${name}`,
                }).save();

                const sockets = await redisClient.LRANGE(`socket-io:${memberId}`, 0, -1);
                if (sockets.length) {
                    sockets.forEach((socketId) => {
                        req.io.sockets
                            .to(socketId)
                            .emit("new-chatroom", { notification, chat_room: chatRoomData });
                    });
                }
            }

            await User.findByIdAndUpdate(memberId, {
                $push: { chat_rooms: { _id: chatRoom._id } },
            });
        }

        return res.status(200).json({
            data: chatRoomData,
            message: `Group ${name} is created with ${membersId.length} members`,
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
                const notification = await new Notification({
                    user: memberId,
                    type: "CHATROOM-DELETE",
                    content: `Group ${name} has been deleted`,
                }).save();

                const sockets = await redisClient.LRANGE(`socket-io:${memberId}`, 0, -1);
                if (sockets.length) {
                    sockets.forEach((socketId) => {
                        req.io.sockets
                            .to(socketId)
                            .emit("delete-chatroom", { notification, chat_room_id: chatRoomId });
                    });
                }
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
            const { name, admin, members, is_public, avatar_image } = item;

            const isTwoPeopleChatRoom =
                !is_public &&
                name == "" &&
                admin == null &&
                avatar_image == "" &&
                members.length == 2;

            const result = { _id, name, members, avatar_image };

            if (isTwoPeopleChatRoom) {
                const reciver = members.find((member) => member != userId);

                return { ...result, name: reciver.name, avatar_image: reciver.avatar_image };
            }

            return result;
        });

        return res.status(200).json({ message: "success", data: { count, rows: chatRoomsData } });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const getChatRoomsByUserController = async (req, res) => {
    const pageSize = 20;
    const userId = req.user_id;
    const page = parseInt(req.query.page) || 1;

    try {
        const query = { members: userId };

        const user = await User.findById(userId);
        const chatRooms = await ChatRoom.find(query, { createdAt: 0, updatedAt: 0 })
            .lean()
            .limit(pageSize)
            .sort({ createdAt: -1 })
            .skip((page - 1) * pageSize)
            .populate("members", { _id: 1, name: 1, block_users: 1, avatar_image: 1 });

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
                const sender = chatRoom.members.find((member) => userId == member._id);
                const reciver = chatRoom.members.find((member) => userId != member._id);

                if (reciver.block_users.some((item) => String(item) == String(userId))) {
                    chatRoom.type_block = "is_blocked";
                }
                if (sender.block_users.some((item) => String(item) == String(reciver._id))) {
                    chatRoom.type_block = "block_reciver";
                }

                chatRoom.name = reciver.name;
                chatRoom.avatar_image = reciver.avatar_image;
            }
            result.push({
                ...chatRoom,
                unseen_message,
                members: chatRoom.members.map((item) => ({
                    _id: item._id,
                    name: item.name,
                    avatar_image: item.avatar_image,
                })),
            });
        }

        const count = await ChatRoom.countDocuments(query);

        result.sort((a, b) => b.unseen_message - a.unseen_message);

        return res.status(200).json({ message: "success", data: { count, rows: result } });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const updateInfoChatRoomController = async (req, res) => {
    const userId = req.user_id;
    const { chatRoomId } = req.params;
    const { name, is_public, avatar_image } = req.body;

    try {
        const chatRoom = await ChatRoom.findById(chatRoomId).populate("members", {
            _id: 1,
            name: 1,
            avatar_image: 1,
        });
        if (!chatRoom) {
            return res.status(400).json({ message: "Group doesn't exist" });
        }

        const {
            admin,
            members,
            name: chatRoomName,
            is_public: chatRoomPrivacy,
            avatar_image: chatRoomAvatarImage,
        } = chatRoom;

        const isTwoPeopleChatRoom =
            name == "" &&
            admin == null &&
            !chatRoomPrivacy &&
            members.length == 2 &&
            chatRoomAvatarImage == "";

        if (admin != userId && !isTwoPeopleChatRoom) {
            return res.status(403).json({ message: "You don't have permission" });
        }
        if (!chatRoom.members.some((item) => userId == item._id)) {
            return res.status(403).json({ message: "You aren't in group" });
        }

        await chatRoom.updateOne({ name, is_public, avatar_image });

        const chatRoomData = {
            name,
            is_public,
            avatar_image,
            _id: chatRoom._id,
            unseen_message: 0,
            admin: chatRoom.admin,
            members: chatRoom.members,
        };

        if (name != chatRoomName) {
            for (const memberId of members.map((item) => item._id)) {
                if (memberId != userId) {
                    const notification = await new Notification({
                        user: memberId,
                        type: "CHATROOM-UPDATE_NAME",
                        content: `The name of ${chatRoomName} group has been changed to ${name}`,
                    }).save();

                    const sockets = await redisClient.LRANGE(`socket-io:${memberId}`, 0, -1);
                    if (sockets.length) {
                        sockets.forEach((socketId) => {
                            req.io.sockets
                                .to(socketId)
                                .emit("update-chatroom", { notification, chat_room: chatRoomData });
                        });
                    }
                }
            }
        }

        return res.status(200).json({
            data: chatRoomData,
            message: `The name of ${chatRoomName} group has been changed to ${name}`,
        });
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

        await chatRoom.updateOne({ $push: { members: membersId } });

        const { nModified } = await User.updateMany(
            { _id: { $in: membersId } },
            { $push: { chat_rooms: { _id: chatRoom._id } } }
        );

        const usersData = users
            .filter((item) => membersId.includes(item._id))
            .map((element) => ({
                _id: element._id,
                name: element.name,
                avatar_image: element.avatar_image,
            }));

        return res.status(200).json({
            data: usersData,
            message: `${nModified} members have been added to the group`,
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
        })
            .save()
            .then((res) =>
                res
                    .populate("members", { _id: 1, name: 1, friends: 1, avatar_image: 1 })
                    .execPopulate()
            );

        await sender.updateOne({ $push: { chat_rooms: { _id: chatRoom._id } } });
        await reciver.updateOne({ $push: { chat_rooms: { _id: chatRoom._id } } });

        const responseData = {
            _id: chatRoom._id,
            unseen_message: 0,
            name: reciver.name,
            members: chatRoom.members,
            avatar_image: reciver.avatar_image,
        };

        const notification = await new Notification({
            user: reciver._id,
            chat_room: chatRoom._id,
            type: "CHATROOM-CREATE",
            content: `${reciver.name} have been connected to you in messenger`,
        }).save();

        const sockets = await redisClient.LRANGE(`socket-io:${reciver._id}`, 0, -1);
        if (sockets.length) {
            sockets.forEach((socketId) => {
                req.io.sockets
                    .to(socketId)
                    .emit("new-chatroom", { notification, chat_room: responseData });
            });
        }

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
    updateInfoChatRoomController,
    addMembersToChatRoomController,
    removeMembersFromChatRoomController,
    createChatRoomForTwoPeopleController,
};
