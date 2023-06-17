import mongoose from "mongoose";

const { model, Schema } = mongoose;

const UserIdType = { ref: "user", type: Schema.Types.ObjectId };

const friendRequestSchema = new Schema(
    {
        sender: UserIdType,
        receiver: UserIdType,
        is_accepted: { type: Boolean, default: false },
    },
    { timestamps: true, versionKey: false }
);

const FriendRequest = model("friend-request", friendRequestSchema);

export default FriendRequest;
