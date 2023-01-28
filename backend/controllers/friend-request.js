import User from "../models/User";
import FriendRequest from "../models/FriendRequest";
import { sendNotification } from "../utils/send-notification";
import { friendRequestDataFilter } from "../utils/filter-data";

const unfriend = async (req, res) => {
    const useId = req.user_id;
    const friendId = req.params.friendId;

    try {
        const user = await User.findById(useId);
        const friend = await User.findById(friendId);

        if (!friend) {
            return res.status(400).json({ message: "Friend is not exist" });
        }

        const indexUserId = friend.friends.indeindexOf(useId);
        const indexFriendId = user.friends.indeindexOf(friendId);

        if (indexUserId !== -1) {
            friend.friends.splice(indexUserId, 1);
        }
        if (indexFriendId !== -1) {
            user.friends.splice(indexFriendId, 1);
        }

        await user.save();
        await friend.save();

        res.status(201).json({ message: "Unfriend is successfully" });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const sendFriendRequest = async (req, res) => {
    const useId = req.user_id;
    const friendId = req.params.friendId;

    try {
        const user = await User.findById(useId);
        const friend = await User.findById(friendId);

        if (!friend) {
            return res.status(400).json({ message: "Friend is not exist" });
        }

        const newFriendRequest = new FriendRequest({
            sender: useId,
            receiver: friendId,
        });
        await newFriendRequest.save();

        res.status(201).json({ message: "Send friend is successfully" });

        await sendNotification({
            req,
            key: "send-friend-request",
            content: `${user.name} has send you friend request`,
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const declineOrCancelRequest = async (req, res) => {
    const friendRequestId = req.params.friendRequestId;

    try {
        const friendRequest = await FriendRequest.findById(friendRequestId);

        if (!friendRequest) {
            return res.status(400).json({ message: "Request is not sended yet" });
        }

        await FriendRequest.deleteOne({ id: friendRequest.id });

        res.status(200).json({ message: "Delete friend request is successfully" });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const acceptFriendRequest = async (req, res) => {
    try {
        const friendRequest = await FriendRequest.findById(req.params.friendRequestId);

        if (!friendRequest) {
            return res.status(400).json({ message: "Request is not sended yet" });
        }

        friendRequest.is_accepted = true;
        await friendRequest.save();

        res.status(200).json({ message: "Accept friend request is successfully" });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const getSendedFriendRequests = async (req, res) => {
    try {
        const friendRequests = await FriendRequest.find({
            is_accepted: false,
            sender: req.user_id,
        });

        if (!friendRequests.length) {
            return res.status(400).json({ message: "You don't send any friend request" });
        }

        const friendRequestsData = friendRequests.map((friendRequest) =>
            friendRequestDataFilter(friendRequest)
        );

        res.status(200).json({
            data: friendRequestsData,
            message: "Get friend request sended is successfully",
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const getReceivedFriendRequests = async (req, res) => {
    try {
        const friendRequests = await FriendRequest.find({
            is_accepted: false,
            receiver: req.user_id,
        });

        if (!friendRequests.length) {
            return res.status(400).json({ message: "You don't have any friend request" });
        }

        const friendRequestsData = friendRequests.map((friendRequest) =>
            friendRequestDataFilter(friendRequest)
        );

        res.status(200).json({
            data: friendRequestsData,
            message: "Get friend request received is successfully",
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

export {
    unfriend,
    sendFriendRequest,
    acceptFriendRequest,
    declineOrCancelRequest,
    getSendedFriendRequests,
    getReceivedFriendRequests,
};
