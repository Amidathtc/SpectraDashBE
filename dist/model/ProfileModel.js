"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const profileModel = new mongoose_1.Schema({
    name: {
        type: String,
    },
    phoneNumber: {
        type: String,
    },
    address: {
        type: String,
    },
    profileAvatar: {
        type: String,
    },
    profileAvatarID: {
        type: String,
    },
    userID: {
        type: String,
    },
    user: {
        type: mongoose_1.Types.ObjectId,
        ref: "users",
    },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("profiles", profileModel);
