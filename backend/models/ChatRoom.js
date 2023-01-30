import mongoose from "mongoose";

const { model, Schema } = mongoose;

const objectIdType = Schema.Types.ObjectId;

const chatRoomSchema = new Schema(
    {
        name: {
            trim: true,
            type: String,
        },
        avatar_image: {
            trim: true,
            default: "",
            type: String,
        },
        is_public: {
            default: true,
            type: Boolean,
        },
        admin: {
            ref: "User",
            type: objectIdType,
        },
        members: [
            {
                ref: "User",
                required: true,
                type: objectIdType,
            },
        ],
    },
    { timestamps: true }
);

const chatRoomModel = model("ChatRoom", chatRoomSchema);

export default chatRoomModel;
