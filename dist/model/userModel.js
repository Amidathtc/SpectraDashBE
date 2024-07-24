"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSchema = void 0;
const mongoose_1 = require("mongoose");
// interface AllUsers extends Iuser, Document {}
exports.UserSchema = new mongoose_1.Schema({
    email: {
        type: String,
        unique: true,
        required: [true, "Your email is required"],
    },
    password: {
        type: String,
        required: [true, "Your password is required"],
    },
    firstName: {
        type: String,
        required: [true, "Your First Name is required"],
    },
    lastName: {
        type: String,
        required: [true, "Your Last Name is required"],
    },
    avatar: {
        type: String,
    },
    verified: {
        type: Boolean,
        default: false,
    },
    orders: [
        {
            type: mongoose_1.Types.ObjectId,
            ref: "orders",
        },
    ],
    profile: [
        {
            type: mongoose_1.Types.ObjectId,
            ref: "userprofiles",
        },
    ],
    paymentHistory: [
        {
            type: mongoose_1.Types.ObjectId,
            ref: "payments", // Reference to the payments collection
        },
    ],
}, { timestamps: true });
const UserModel = (0, mongoose_1.model)("users", exports.UserSchema);
exports.default = UserModel;
