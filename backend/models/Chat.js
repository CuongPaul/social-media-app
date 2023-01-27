import mongoose from "mongoose";

const { model, Schema } = mongoose;

const userIdRefType = { ref: "User", required: true, type: Schema.Types.ObjectId };

const chatSchema = new Schema(
    {
        sender: userIdRefType,
        receiver: userIdRefType,
        body: {
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

const chatModel = model("Chat", chatSchema);

export default chatModel;
