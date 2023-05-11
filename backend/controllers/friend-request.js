import { User, Notification, FriendRequest } from "../models";

const sendFriendRequestController = async (req, res) => {
    const userId = req.user_id;
    const { receiver_id } = req.body;

    try {
        if (userId == receiver_id) {
            return res.status(400).json({ message: "Can't send friend request to yourself" });
        }

        const receiver = await User.findById(receiver_id);
        if (!receiver) {
            return res.status(400).json({ message: "User doesn't exist" });
        }
        if (receiver.block_users.includes(userId)) {
            return res.status(400).json({ message: "Can't send friend request to this user" });
        }
        if (receiver.friends.includes(userId)) {
            return res
                .status(400)
                .json({ message: `You and ${receiver.name} are already friends` });
        }

        const friendRequest = await FriendRequest.findOne({
            sender: userId,
            receiver: receiver_id,
        });

        if (!friendRequest) {
            const newFriendRequest = await new FriendRequest({
                sender: userId,
                receiver: receiver_id,
            }).save();

            const user = await User.findById(userId);

            await new Notification({
                user: receiver_id,
                type: "FRIEND_REQUEST-SEND",
                friend_request: newFriendRequest._id,
                content: `${user.name} has send you friend request`,
            }).save();
        }

        return res.status(200).json({ message: "Friend request sent successfully" });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const acceptFriendRequestController = async (req, res) => {
    const userId = req.user_id;
    const { friendRequestId } = req.params;

    try {
        const friendRequest = await FriendRequest.findById(friendRequestId)
            .populate("sender")
            .populate("receiver");

        const {
            sender: { _id: senderId, name: senderName },
            receiver: { _id: receiverId, name: receiverName },
        } = friendRequest;

        if (userId != receiverId) {
            return res.status(400).json({ message: "Request hasn't been sent for you" });
        }
        if (!friendRequest) {
            return res.status(400).json({ message: "Request hasn't been sent" });
        }
        if (!friendRequest.is_accepted) {
            await friendRequest.update({ is_accepted: true });

            await User.findByIdAndUpdate(senderId, { $push: { friends: receiverId } });
            await User.findByIdAndUpdate(receiverId, { $push: { friends: senderId } });

            await new Notification({
                user: senderId,
                type: "FRIEND_REQUEST-ACCEPT",
                content: `${receiverName} has accept friend request`,
            }).save();
        }

        return res.status(200).json({ message: `You and ${senderName} are already friend` });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const declineOrCancelRequestController = async (req, res) => {
    const userId = req.user_id;
    const { friendRequestId } = req.params;

    try {
        const friendRequest = await FriendRequest.findOne({
            is_accepted: false,
            _id: friendRequestId,
            $or: [{ sender: userId }, { receiver: userId }],
        });

        if (!friendRequest) {
            return res.status(400).json({ message: "Request hasn't been sent" });
        }

        await friendRequest.remove();
        await Notification.findOneAndDelete({ friend_request: friendRequestId });

        return res.status(200).json({
            message: `Friend request has been ${
                friendRequest.sender == userId ? "cancelled" : "declined"
            }`,
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const getSendedFriendRequestsController = async (req, res) => {
    const pageSize = 5;
    const userId = req.user_id;
    const page = parseInt(req.query.page) || 1;

    try {
        const query = { sender: userId, is_accepted: false };

        const friendRequests = await FriendRequest.find(query)
            .limit(pageSize)
            .sort({ createdAt: -1 })
            .skip((page - 1) * pageSize)
            .populate("receiver", {
                _id: 1,
                name: 1,
                email: 1,
                avatar_image: 1,
            });

        const count = await FriendRequest.countDocuments(query);

        return res.status(200).json({ message: "success", data: { count, rows: friendRequests } });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const getReceivedFriendRequestsController = async (req, res) => {
    const pageSize = 5;
    const userId = req.user_id;
    const page = parseInt(req.query.page) || 1;

    try {
        const query = { receiver: userId, is_accepted: false };

        const friendRequests = await FriendRequest.find(query, { updatedAt: 0 })
            .limit(pageSize)
            .sort({ createdAt: -1 })
            .skip((page - 1) * pageSize)
            .populate("sender", {
                _id: 1,
                name: 1,
                email: 1,
                avatar_image: 1,
            });

        const count = await FriendRequest.countDocuments(query);

        return res.status(200).json({ message: "success", data: { count, rows: friendRequests } });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

export {
    sendFriendRequestController,
    acceptFriendRequestController,
    declineOrCancelRequestController,
    getSendedFriendRequestsController,
    getReceivedFriendRequestsController,
};
