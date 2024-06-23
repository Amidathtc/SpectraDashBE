"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const agentModel = new mongoose_1.Schema({
    fullName: {
        type: String,
    },
    AgentCompanyname: {
        type: String,
    },
    AgentEmail: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
    },
    verified: {
        type: Boolean,
        default: true,
    },
    role: {
        type: String,
    },
    profile: [
        {
            type: mongoose_1.Types.ObjectId,
            ref: "profiles",
        },
    ],
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("agents", agentModel);
