"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const enum_1 = require("../Utils/enum");
const kgPriceSchema = new mongoose_1.Schema({
    from_kg: {
        type: Number,
        required: true,
    },
    to_kg: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
});
const deliveryZoneSchema = new mongoose_1.Schema({
    zone_name: {
        type: String,
        required: true,
    },
    countries: {
        type: [String],
        required: true,
    },
    kg_prices: {
        type: [kgPriceSchema],
        required: true,
    },
});
const agentSchema = new mongoose_1.Schema({
    agentName: {
        type: String,
        required: true,
    },
    agentCompanyName: {
        type: String,
    },
    agentZones: {
        // Use the deliveryZoneSchema for nested zones
        type: [deliveryZoneSchema],
        required: true,
    },
    role: {
        type: String,
        default: enum_1.ROLE.AGENT,
    },
    deliveryDays: {
        type: String,
        required: true,
    },
    orders: [
        {
            type: mongoose_1.Types.ObjectId,
            ref: "orders",
        },
    ],
}, { timestamps: true });
const agentModel = (0, mongoose_1.model)("agents", agentSchema);
exports.default = agentModel;
