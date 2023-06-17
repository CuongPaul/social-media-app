import mongoose from "mongoose";

const { model, Schema } = mongoose;

const ObjectIdType = Schema.Types.ObjectId;
const StringType = { trim: true, type: String };

const messageSchema = new Schema(
    {
        image: StringType,
        text: StringType,
        react: { ref: "react", required: true, type: ObjectIdType },
        sender: { ref: "user", required: true, type: ObjectIdType },
        chat_room: { required: true, ref: "chat-room", type: ObjectIdType },
    },
    { timestamps: true, versionKey: false }
);

const Message = model("message", messageSchema);

export default Message;
