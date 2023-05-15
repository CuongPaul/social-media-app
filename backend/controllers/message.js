import { User, React, Message, ChatRoom } from "../models";

const getMessagesController = async (req, res) => {
    const pageSize = 5;
    const userId = req.user_id;
    const page = parseInt(req.query.page) || 1;
    const chatRoomId = req.params.chatRoomId;

    try {
        const user = await User.findById(userId);
        const chatRoom = await ChatRoom.findOne({ members: userId, _id: chatRoomId });
        if (!chatRoom) {
            throw new Error("You aren't in this group");
        }

        const query = { chat_room: chatRoomId };

        const messages = await Message.find(query, { chat_room: 0, updatedAt: 0 })
            .sort()
            .limit(pageSize)
            .skip((page - 1) * pageSize)
            .populate("sender", { _id: 1, name: 1, avatar_image: 1 })
            .populate({
                path: "react",
                select: "_id wow sad like love haha angry",
                populate: [
                    { path: "wow", select: "_id name avatar_image" },
                    { path: "sad", select: "_id name avatar_image" },
                    { path: "like", select: "_id name avatar_image" },
                    { path: "love", select: "_id name avatar_image" },
                    { path: "haha", select: "_id name avatar_image" },
                    { path: "angry", select: "_id name avatar_image" },
                ],
            });

        const count = await Message.countDocuments(query);

        const index = user.chat_rooms.findIndex((item) => String(item._id) == String(chatRoom._id));
        if (index != -1 && user.chat_rooms[index].furthest_unseen_message) {
            user.chat_rooms[index].furthest_unseen_message = null;
        }
        await user.save();

        res.status(200).json({ message: "success", data: { count, rows: messages } });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const reactMessageController = async (req, res) => {
    const userId = req.user_id;
    const messageId = req.params.messageId;
    const { chat_room_id, key: reactKey } = req.query;

    try {
        const chatRoom = await ChatRoom.findOne({ members: userId, _id: chat_room_id });
        if (!chatRoom) {
            throw new Error("You aren't in this group");
        }

        const message = await Message.findById(messageId);
        if (!message) {
            return res.status(400).json({ message: "Message doesn't exist" });
        }

        const react = await React.findById(message.react);
        const indexUser = react[reactKey].indexOf(userId);

        if (indexUser == -1) {
            react[reactKey].push(userId);
        } else {
            react[reactKey].splice(indexUser, 1);
        }

        await react.save();

        res.status(200).json({ message: "success" });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const createMessageController = async (req, res) => {
    const userId = req.user_id;
    const { text, image, chat_room_id } = req.body;

    try {
        const chatRoom = await ChatRoom.findOne({ _id: chat_room_id, members: userId });
        if (!chatRoom) {
            return res.status(400).json({ message: "Group doesn't exist" });
        }

        const emptyReact = await new React().save();

        const newMessage = await new Message({
            text,
            image,
            sender: userId,
            react: emptyReact.id,
            chat_room: chat_room_id,
        }).save();

        const members = await User.find({ _id: { $in: chatRoom.members } });
        for (const member of members) {
            if (member._id != userId) {
                const index = member.chat_rooms.findIndex(
                    (item) => String(item._id) === String(chatRoom._id)
                );
                if (index != -1) {
                    if (
                        member.chat_rooms[index] &&
                        !member.chat_rooms[index].furthest_unseen_message
                    ) {
                        member.chat_rooms[index].furthest_unseen_message = newMessage._id;
                        await member.save();
                    }
                }
            }
        }

        req.io.to(chat_room_id).emit("new-message", { data: newMessage });

        res.status(200).json({ message: "success" });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const deleteMessageController = async (req, res) => {
    const userId = req.user_id;
    const meassageId = req.params.meassageId;
    const chat_room_id = req.query.chat_room_id;

    try {
        const message = await Message.findOne({
            sender: userId,
            _id: meassageId,
            chat_room: chat_room_id,
        });

        if (!message) {
            return res.status(400).json({ message: "Message is not exists" });
        }

        await message.remove();

        res.status(200).json({ message: "success" });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const updateMessagesController = async (req, res) => {
    const userId = req.user_id;
    const { meassageId } = req.params;
    const { text, image, chat_room_id } = req.body;

    try {
        const message = await Message.findOne({
            sender: userId,
            _id: meassageId,
            chat_room: chat_room_id,
        });

        if (!message) {
            return res.status(400).json({ message: "You don't allow edit this message" });
        }

        await message.update({ text, image });

        res.status(200).json({ message: "success" });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

export {
    createMessageController,
    getMessagesController,
    reactMessageController,
    deleteMessageController,
    updateMessagesController,
};
