import mongoose, { Document, Schema, model } from "mongoose";
import { Iuser } from "../interface/interface";

interface user extends Iuser, Document {}

interface AllUsers extends Iuser, Document {}

const UserSchema = new Schema<AllUsers>(
  {
    email: {
      type: String,
      unique: true,
      required: [true, "Your email is required"],
    },
    password: {
      type: String,
      required: [true, "Your password is required"],
    },
    name: {
      type: String,
      required: [true, "Your Name is required"],
    },
    verified: {
      type: Boolean,
      default: false,
    },
    profile : [
      {
        type: mongoose.Types.ObjectId,
        ref: "profiles",
      },
    ]
  },
  { timestamps: true }
);

const UserModel = model<user>("User", UserSchema);

export default UserModel;
