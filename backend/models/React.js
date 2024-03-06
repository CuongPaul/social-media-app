import mongoose from "mongoose";

const { model, Schema } = mongoose;

const UserIdRefType = { ref: "user", type: Schema.Types.ObjectId };

const reactSchema = new Schema(
  {
    sad: [UserIdRefType],
    wow: [UserIdRefType],
    like: [UserIdRefType],
    love: [UserIdRefType],
    haha: [UserIdRefType],
    angry: [UserIdRefType],
  },
  { timestamps: true, versionKey: false }
);

const React = model("react", reactSchema);

export default React;
