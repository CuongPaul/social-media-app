import Message from "../models/Message";
import ChatRoom from "../models/ChatRoom";
import { messageDataFilter } from "../utils/filter-data";

const sendMessage = async (req, res) => {
    const roomId = req.params.roomId;
    const { text, image } = req.body;

    if ((!text || !text.trim().length) && (!image || !image.trim().length)) {
        return res.status(422).json({ error: "Don`t send empty message" });
    }

    try {
        const chatRoom = await ChatRoom.findById(roomId);

        if (!chatRoom) {
            return res.status(404).json({ error: "Group doesn't exist" });
        }

        const newMessage = new Message({
            room: roomId,
            sender: req.user_id,
            content: { text, image },
        });
        const saveMessage = await newMessage.save();

        const messageData = messageDataFilter(saveMessage);

        req.io.to(roomId).emit("new-message", { data: messageData });

        res.status(201).json({ message: "Successfully" });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const getMessages = async (req, res) => {
    try {
        const messages = await Message.find({ room: req.params.roomId }).populate("sender");

        const messageData = messages.map((message) => messageDataFilter(message));

        res.status(200).json({ message: "Successfully", data: messageData });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const reactMessage = async (req, res) => {
    try {
        const message = await Message.findById(req.params.messageId)
            .populate("react")
            .populate("user");

        if (!message) {
            return res.status(404).json({ message: "Message doesn't exist" });
        }

        const key = req.query.key;
        const indexUserId = message.react[key].indexOf(req.user_id);

        indexUserId === -1
            ? message.react[key].push(req.user_id)
            : message.react[key].splice(indexUserId, 1);

        await message.save();

        res.status(200).json({ message: "Successfully" });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const deleteMessage = async (req, res) => {
    try {
        const message = await Message.findById(req.params.meassageId);

        if (!message) {
            return res.status(400).json({ message: "Message is not exists" });
        }

        await Message.deleteOne({ id: message.id });

        res.status(200).json({ message: "Successfully" });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const updateMessages = async (req, res) => {
    const { text, image } = req.body;

    if ((!text || !text.trim().length) && (!image || !image.trim().length)) {
        return res.status(422).json({ error: "Don`t send empty message" });
    }

    try {
        const message = await Message.findById(req.params.meassageId);

        if (!message) {
            return res.status(400).json({ message: "Message is not exists" });
        }

        message.text = text;
        message.image = image;
        await message.save();

        res.status(200).json({ message: "Successfully" });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

export { sendMessage, getMessages, reactMessage, deleteMessage, updateMessages };
