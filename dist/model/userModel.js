"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
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
    orders: [
        {
            type: mongoose_1.Types.ObjectId,
            ref: "orders",
        },
    ],
    profile: [
        {
            type: mongoose_1.Types.ObjectId,
            ref: "profiles",
        },
    ],
}, { timestamps: true });
const UserModel = (0, mongoose_1.model)("users", UserSchema);
exports.default = UserModel;
