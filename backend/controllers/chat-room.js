import ChatRoom from "../models/ChatRoom";
import { chatRoomDataFilter } from "../utils/filter-data";

const joinChatRoom = async (req, res) => {
    try {
        const chatRoom = await ChatRoom.findById(req.params.chatRoomId);

        if (!chatRoom) {
            return res.status(404).json({ message: "Group doesn't exist" });
        }

        chatRoom.members.push(req.user_id);
        await chatRoom.save();

        res.status(200).json({ message: `You have joined the group ${chatRoom.name}` });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const leaveChatRoom = async (req, res) => {
    try {
        const chatRoom = await ChatRoom.findById(req.params.chatRoomId);

        if (!chatRoom) {
            return res.status(404).json({ message: "Group doesn't exist" });
        }

        const indexOfMemberId = chatRoom.members.indexOf(req.user_id);

        if (indexOfMemberId !== -1) {
            chatRoom.members.splice(indexOfMemberId, 1);
        }
        await chatRoom.save();

        res.status(200).json({ message: `You have left the group "${chatRoom.name}` });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const createChatRoom = async (req, res) => {
    const { name, members } = req.body;

    if (!name || !name.trim().length) {
        return res.status(422).json({ message: "Name is required" });
    }
    if (members.length < 3) {
        return res.status(422).json({ message: "Minimum 3 member" });
    }

    try {
        const newChatRoom = new ChatRoom({ name, members, admin: req.user_id });
        await newChatRoom.save();

        res.status(200).json({ message: "Group created successfully" });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const deleteChatRoom = async (req, res) => {
    const chatRoomId = req.params.chatRoomId;

    try {
        const chatRoom = await ChatRoom.findById(chatRoomId);

        if (!chatRoom) {
            return res.status(404).json({ message: "Group doesn't exist" });
        }
        if (chatRoom.admin !== req.user_id) {
            return res.status(404).json({ message: "You don't have permission" });
        }

        await ChatRoom.deleteOne({ id: chatRoomId });

        res.status(200).json({ message: "Delete group successfully" });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const searchChatRooms = async (req, res) => {
    try {
        const chatRooms = await ChatRoom.find({
            is_public: true,
            name: { $regex: req.query.name, $options: "i" },
        });

        if (!chatRooms.length) {
            return res.status(404).json({ message: "Group not found" });
        }

        const chatRoomsData = chatRooms.map((chatRoom) => chatRoomDataFilter(chatRoom));

        res.status(200).json({ message: "Successfully", data: chatRoomsData });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const updateNameChatRoom = async (req, res) => {
    const { name } = req.body;

    if (!name || !name.trim().length) {
        return res.status(422).json({ message: "Name is required" });
    }

    try {
        const chatRoom = await ChatRoom.findById(req.params.chatRoomId);

        if (!chatRoom) {
            return res.status(404).json({ message: "Group doesn't exist" });
        }
        if (chatRoom.admin !== req.user_id) {
            return res.status(404).json({ message: "You don't have permission" });
        }

        chatRoom.name = name;
        await chatRoom.save();

        res.status(200).json({ message: "Update group name successfully" });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const updateAvatarChatRoom = async (req, res) => {
    const { avatar_image } = req.body;

    if (!avatar_image || !avatar_image.trim().length) {
        return res.status(422).json({ message: "Image is required" });
    }

    try {
        const chatRoom = await ChatRoom.findById(req.params.chatRoomId);

        if (!chatRoom) {
            return res.status(404).json({ message: "Group doesn't exist" });
        }
        if (chatRoom.admin !== req.user_id) {
            return res.status(404).json({ message: "You don't have permission" });
        }

        chatRoom.avatar_image = avatar_image;
        await chatRoom.save();

        res.status(200).json({ message: "Update group avatar successfully" });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const addMembersToChatRoom = async (req, res) => {
    const { members } = req.body;

    if (members.length === 0) {
        return res.status(422).json({ message: "Choose friends to add to the group" });
    }

    try {
        const chatRoom = await ChatRoom.findById(req.params.chatRoomId);

        if (!chatRoom) {
            return res.status(404).json({ message: "Group doesn't exist" });
        }
        if (chatRoom.admin !== req.user_id) {
            return res.status(404).json({ message: "You don't have permission" });
        }

        chatRoom.members.push(...members);
        await chatRoom.save();

        res.status(200).json({ message: "Successfully added member" });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const removeMemberChatRoom = async (req, res) => {
    try {
        const chatRoom = await ChatRoom.findById(req.params.chatRoomId);

        if (!chatRoom) {
            return res.status(404).json({ message: "Group doesn't exist" });
        }
        if (chatRoom.admin !== req.user_id) {
            return res.status(404).json({ message: "You don't have permission" });
        }

        const indexOfMemberId = chatRoom.members.indexOf(req.query.memberId);

        if (indexOfMemberId !== -1) {
            chatRoom.members.splice(indexOfMemberId, 1);
        }
        await chatRoom.save();

        res.status(200).json({ message: "Delete member successfully" });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const updatePrivacyChatRoom = async (req, res) => {
    try {
        const chatRoom = await ChatRoom.findById(req.params.chatRoomId);

        if (!chatRoom) {
            return res.status(404).json({ message: "Group doesn't exist" });
        }
        if (chatRoom.admin !== req.user_id) {
            return res.status(404).json({ message: "You don't have permission" });
        }

        chatRoom.is_public = !chatRoom.is_public;
        await chatRoom.save();

        res.status(200).json({ message: "Group privacy update successfulessfully" });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const getChatRoomsByCurrentUser = async (req, res) => {
    try {
        const chatRooms = await ChatRoom.find({ members: { $elemMatch: req.user_id } });

        if (!chatRooms.length) {
            return res.status(404).json({ message: "You're not in any chats" });
        }

        const chatRoomsData = chatRooms.map((chatRoom) => chatRoomDataFilter(chatRoom));

        res.status(200).json({ message: "Successfully", data: chatRoomsData });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

export {
    joinChatRoom,
    leaveChatRoom,
    createChatRoom,
    deleteChatRoom,
    searchChatRooms,
    updateNameChatRoom,
    updateAvatarChatRoom,
    addMembersToChatRoom,
    removeMemberChatRoom,
    updatePrivacyChatRoom,
    getChatRoomsByCurrentUser,
};
