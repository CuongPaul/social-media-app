import mongoose from "mongoose";

const { model, Schema } = mongoose;

const objectIdType = Schema.Types.ObjectId;

const messageSchema = new Schema(
    {
        react: {
            ref: "React",
            type: objectIdType,
        },
        room: {
            required: true,
            ref: "ChatRoom",
            type: objectIdType,
        },
        sender: {
            ref: "User",
            required: true,
            type: objectIdType,
        },
        content: {
            required: true,
            type: {
                text: {
                    trim: true,
                    type: String,
                },
                image: {
                    trim: true,
                    type: String,
                },
            },
        },
    },
    { timestamps: true }
);

const messageModel = model("Message", messageSchema);

export default messageModel;
