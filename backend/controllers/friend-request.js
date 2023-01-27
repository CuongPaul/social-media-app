import User from "../models/User";
import { userFilter } from "../utils/filter-data";
import FriendRequest from "../models/FriendRequest";
import { sendNotification } from "../helper/socket";

const sendFriendRequest = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        if (req.user_id == req.params.userId) {
            return res.status(400).json({ error: "You cannot send friend request to yourself" });
        }

        if (user.friends.includes(req.user_id)) {
            return res.status(400).json({ error: "Already Friends" });
        }

        const friendRequest = await FriendRequest.findOne({
            sender: req.user_id,
            receiver: req.params.userId,
        });

        if (friendRequest) {
            return res.status(400).json({ error: "Friend Request already send" });
        }

        const newFriendRequest = new FriendRequest({
            sender: req.user_id,
            receiver: req.params.userId,
        });

        const save = await newFriendRequest.save();

        const friend = await FriendRequest.findById(save.id).populate("receiver");

        const chunkData = {
            id: friend.id,
            user: userFilter(friend.receiver),
        };

        res.status(200).json({ message: "Friend Request Sended", friend: chunkData });

        const sender = await FriendRequest.findById(save.id).populate("sender");
        let notification = await sendNotification({
            user: req.params.userId,
            body: `${sender.sender.name} has send you friend request`,
        });
        const senderData = {
            id: sender.id,
            user: userFilter(sender.sender),
        };

        if (user.socketId) {
            req.io.to(user.socketId).emit("friend-request-status", { sender: senderData });
            req.io.to(user.socketId).emit("notification", { data: notification });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Something went wrong" });
    }
};

const sendUnfriendRequest = async (req, res) => {
    try {
        const { userRequest, friendRequest } = req.body;

        await User.findByIdAndUpdate(userRequest.id, { friends: userRequest.friends });
        await User.findByIdAndUpdate(friendRequest.id, { friends: friendRequest.friends });

        res.status(200).json({ message: "success" });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Something went wrong" });
    }
};

const acceptFriendRequest = async (req, res) => {
    try {
        const friendsRequest = await FriendRequest.findById(req.params.requestId);
        if (!friendsRequest) {
            return res.status(404).json({ error: "Request already accepted or not sended yet" });
        }

        const sender = await User.findById(friendsRequest.sender);
        if (sender.friends.includes(friendsRequest.receiver)) {
            return res.status(400).json({ error: "already in your friend lists" });
        }
        sender.friends.push(req.user_id);
        await sender.save();

        const currentUser = await User.findById(req.user_id);
        if (currentUser.friends.includes(friendsRequest.sender)) {
            return res.status(400).json({ error: "already  friend " });
        }
        currentUser.friends.push(friendsRequest.sender);
        await currentUser.save();

        const chunkData = userFilter(sender);

        await FriendRequest.deleteOne({ _id: req.params.requestId });
        res.status(200).json({ message: "Friend Request Accepted", user: chunkData });

        let notification = await sendNotification({
            user: sender.id,
            body: `${currentUser.name} has accepted your friend request`,
        });
        if (sender.socketId) {
            let currentUserData = userFilter(currentUser);
            req.io.to(sender.socketId).emit("friend-request-accept-status", {
                user: currentUserData,
                request_id: req.params.requestId,
            });
            req.io.to(sender.socketId).emit("notification", { data: notification });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Something went wrong" });
    }
};

const cancelSendedFriendRequest = async (req, res) => {
    try {
        const friendsRequest = await FriendRequest.findById(req.params.requestId).populate(
            "receiver"
        );
        if (!friendsRequest) {
            return res.status(404).json({ error: "Request already cenceled or not sended yet" });
        }
        await FriendRequest.deleteOne({ _id: req.params.requestId });

        res.status(200).json({ message: "Friend Request Canceled" });
        if (friendsRequest.receiver.socketId) {
            req.io.to(friendsRequest.receiver.socketId).emit("sended-friend-request-cancel", {
                requestId: req.params.requestId,
            });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Something went wrong" });
    }
};

const declineFriendRequest = async (req, res) => {
    try {
        const friendsRequest = await FriendRequest.findById(req.params.requestId).populate(
            "sender"
        );
        if (!friendsRequest) {
            return res.status(404).json({ error: "Request already declined or not sended yet" });
        }
        await FriendRequest.deleteOne({ _id: req.params.requestId });

        res.status(200).json({ message: "Friend Request Declined" });
        if (friendsRequest.sender.socketId) {
            req.io.to(friendsRequest.sender.socketId).emit("received-friend-request-decline", {
                requestId: req.params.requestId,
            });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Something went wrong" });
    }
};

const fetchIncommingFriendRequest = async (req, res) => {
    try {
        const friends = await FriendRequest.find({
            $and: [{ isAccepted: false }, { receiver: req.user_id }],
        }).populate("sender", "_id name profile_pic active");

        const friendsData = friends.map((friend) => {
            return {
                id: friend.id,
                user: userFilter(friend.sender),
            };
        });

        res.status(200).json({ friends: friendsData });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Something went wrong" });
    }
};

const fetchSendedFriendRequest = async (req, res) => {
    try {
        const friends = await FriendRequest.find({
            $and: [{ isAccepted: false }, { sender: req.user_id }],
        }).populate("receiver");
        const friendsData = friends.map((friend) => {
            return {
                id: friend.id,
                user: userFilter(friend.receiver),
            };
        });

        res.status(200).json({ friends: friendsData });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Something went wrong" });
    }
};

export {
    sendFriendRequest,
    sendUnfriendRequest,
    acceptFriendRequest,
    cancelSendedFriendRequest,
    declineFriendRequest,
    fetchIncommingFriendRequest,
    fetchSendedFriendRequest,
};
