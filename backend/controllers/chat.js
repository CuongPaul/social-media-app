import Chat from "../models/Chat";
import User from "../models/User";

import { userFilter } from "../utils/filter-data";

const sendMessageToFriend = async (req, res) => {
    const { text, image } = req.body;

    if (!text || !image) {
        return res.status(422).json({ error: "Don`t send empty message" });
    }

    try {
        const receiver = await User.findById(req.params.friendId);

        if (!receiver) {
            return res.status(404).json({ error: "Friend is not found" });
        }

        const newChat = new Chat({
            sender: req.user_id,
            body: { text, image: image },
            receiver: req.params.friendId,
        });

        const saveChat = await newChat.save();

        const chatdata = {
            id: saveChat.id,
            body: saveChat.body,
            createdAt: saveChat.createdAt,
            sender: userFilter(saveChat.sender),
            receiver: userFilter(saveChat.receiver),
        };

        res.status(201).json({ data: chatdata });

        if (saveChat.receiver.socket_id) {
            req.io.to(saveChat.receiver.socket_id).emit("new-message", { data: chatdata });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const getFriendMessages = async (req, res) => {
    try {
        const chat = await Chat.find({
            $or: [
                { sender: req.user_id, receiver: req.params.friendId },
                { receiver: req.user_id, sender: req.params.friendId },
            ],
        })
            .populate("sender")
            .populate("receiver");

        const chatData = chat.map((chat) => {
            return {
                id: chat.id,
                body: chat.body,
                createdAt: chat.createdAt,
                sender: userFilter(chat.sender),
                receiver: userFilter(chat.receiver),
            };
        });

        res.status(200).json({ data: chatData });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

export { sendMessageToFriend, getFriendMessages };
