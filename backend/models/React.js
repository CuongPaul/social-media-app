import mongoose from "mongoose";

const { model, Schema } = mongoose;

const userIdRefType = { ref: "User", type: Schema.Types.ObjectId };

const reactSchema = new Schema(
    {
        wow: [userIdRefType],
        sad: [userIdRefType],
        like: [userIdRefType],
        love: [userIdRefType],
        haha: [userIdRefType],
        angry: [userIdRefType],
    },
    { timestamps: true }
);

const reactModel = model("React", reactSchema);

export default reactModel;
