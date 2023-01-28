import ChatRoom from "../models/ChatRoom";
import { chatRoomDataFilter } from "../utils/filter-data";

const joinChatRoom = async (req, res) => {
    try {
        const chatRoom = await ChatRoom.findById(req.params.chatRoomId);

        if (!chatRoom) {
            return res.status(400).json({ message: "Room is not exist" });
        }

        chatRoom.members.push(req.user_id);
        await chatRoom.save();

        res.status(200).json({ message: "Join room is successfully" });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const leaveChatRoom = async (req, res) => {
    try {
        const chatRoom = await ChatRoom.findById(req.params.chatRoomId);

        if (!chatRoom) {
            return res.status(400).json({ message: "Room is not exist" });
        }

        const indexOfMemberId = chatRoom.members.indexOf(req.user_id);
        chatRoom.members.splice(indexOfMemberId, 1);
        await chatRoom.save();

        res.status(200).json({ message: "Leave room is successfully" });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const createChatRoom = async (req, res) => {
    const { name, members, avatar_image } = req.body;

    if (!name || name.trim().length === 0) {
        return res.status(422).json({ message: "Name is require" });
    }
    if (members.length < 3) {
        return res.status(422).json({ message: "Minimum 3 members" });
    }

    try {
        const newChatRoom = new ChatRoom({
            name,
            members,
            avatar_image,
        });
        const saveChatRoom = await newChatRoom.save();

        res.status(200).json({
            message: "Create room is successfully",
            data: chatRoomDataFilter(saveChatRoom),
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const deleteChatRoom = async (req, res) => {
    const chatRoomId = req.params.chatRoomId;

    try {
        const chatRoom = await ChatRoom.find(chatRoomId);

        if (!chatRoom) {
            return res.status(400).json({ message: "Room is not exist" });
        }
        if (chatRoom.admin !== req.user_id) {
            return res.status(400).json({ message: "You don't have permission" });
        }

        await ChatRoom.deleteOne({ id: chatRoomId });

        res.status(200).json({ message: "Delete room is successfully" });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const searchChatRoom = async (req, res) => {
    try {
        const chatRooms = await ChatRoom.find({
            name: { $regex: req.query.name, $options: "i" },
            public: true,
        });

        if (!chatRooms.length) {
            return res.status(400).json({ message: "Not found" });
        }

        const chatRoomsData = chatRooms.map((chatRoom) => chatRoomDataFilter(chatRoom));

        res.status(200).json({ message: "Search room is successfully", data: { chatRoomsData } });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const getChatRoomsByUser = async (req, res) => {
    try {
        const chatRooms = await ChatRoom.find({ members: { $elemMatch: req.user_id } });

        if (!chatRooms.length) {
            return res.status(400).json({ message: "You don't have any chat" });
        }

        const chatRoomData = chatRooms.map((chatRoom) => chatRoomDataFilter(chatRoom));

        res.status(200).json({ message: "Get chat is successfully", data: chatRoomData });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const updateNameChatRoom = async (req, res) => {
    const { name } = req.body;

    if (!name || name.trim().length === 0) {
        return res.status(422).json({ message: "Name is require" });
    }

    try {
        const chatRoom = await ChatRoom.findById(req.params.chatRoomId);

        if (!chatRoom) {
            return res.status(400).json({ message: "Room is not exist" });
        }
        if (chatRoom.admin !== req.user_id) {
            return res.status(400).json({ message: "You don't have permission" });
        }

        chatRoom.name = name;
        await chatRoom.save();

        res.status(200).json({ message: "Update chat name is successfully" });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const updateAvatarChatRoom = async (req, res) => {
    const { avatar_image } = req.body;

    if (!avatar_image || avatar_image.trim().length === 0) {
        return res.status(422).json({ message: "Image is require" });
    }

    try {
        const chatRoom = await ChatRoom.findById(req.params.chatRoomId);

        if (!chatRoom) {
            return res.status(400).json({ message: "Room is not exist" });
        }
        if (chatRoom.admin !== req.user_id) {
            return res.status(400).json({ message: "You don't have permission" });
        }

        chatRoom.avatar_image = avatar_image;
        await chatRoom.save();

        res.status(200).json({ message: "Update avatar image is successfully" });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const addMembersToChatRoom = async (req, res) => {
    const { members } = req.body;

    if (members.length === 0) {
        return res.status(422).json({ message: "Select friend to add into room" });
    }

    try {
        const chatRoom = await ChatRoom.findById(req.params.chatRoomId);

        if (!chatRoom) {
            return res.status(400).json({ message: "Room is not exist" });
        }
        if (chatRoom.admin !== req.user_id) {
            return res.status(400).json({ message: "You don't have permission" });
        }

        chatRoom.members.push(members);
        await chatRoom.save();

        res.status(200).json({ message: "Add members is successfully" });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const removeMemberChatRoom = async (req, res) => {
    try {
        const chatRoom = await ChatRoom.findById(req.params.chatRoomId);

        if (!chatRoom) {
            return res.status(400).json({ message: "Room is not exist" });
        }
        if (chatRoom.admin !== req.user_id) {
            return res.status(400).json({ message: "You don't have permission" });
        }

        const indexOfMemberId = chatRoom.members.indexOf(req.query.memberId);

        chatRoom.members.splice(indexOfMemberId, 1);
        await chatRoom.save();

        res.status(200).json({ message: "Add members is successfully" });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

export {
    joinChatRoom,
    leaveChatRoom,
    createChatRoom,
    deleteChatRoom,
    searchChatRoom,
    getChatRoomsByUser,
    updateNameChatRoom,
    addMembersToChatRoom,
    updateAvatarChatRoom,
    removeMemberChatRoom,
};
