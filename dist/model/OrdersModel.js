"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const orderStatus = ["pending", "processing", "shipped", "delivered", "paid"]; // Added 'paid' status
const senderCountry = "Nigeria"; // Order status options
const ordersSchema = new mongoose_1.Schema({
    sender: {
        country: {
            type: String,
            required: true,
            enum: senderCountry, // Limit status to available options
            default: "Nigeria",
        },
        firstName: { type: String, trim: true, required: true },
        lastName: { type: String, trim: true, required: true },
        address: { type: String, trim: true, required: true },
        city: { type: String, trim: true, required: true },
        state: { type: String, trim: true, required: true },
        phoneNumber: { type: String, trim: true, required: true },
        email: { type: String, trim: true, required: true },
    },
    receiver: {
        country: { type: String, required: true },
        firstName: { type: String, trim: true, required: true },
        lastName: { type: String, trim: true, required: true },
        address: { type: String, trim: true, required: true },
        city: { type: String, trim: true, required: true },
        state: { type: String, trim: true, required: true },
        phoneNumber: { type: String, trim: true, required: true },
        email: { type: String, trim: true, required: true },
    },
    shipmentDetails: [
        {
            typeOfItem: { type: String, required: true },
            color: { type: String },
            detailsOfItem: { type: String },
            quantity: { type: Number, required: true },
            itemValue: { type: Number, required: true },
        },
    ],
    shipmentMetrics: {
        weight_kg: { type: Number, required: true },
        length_cm: { type: Number, required: true },
        width_cm: { type: Number, required: true },
    },
    user: { type: mongoose_1.Types.ObjectId, required: true, ref: "users" }, // User reference
    agent: { type: mongoose_1.Types.ObjectId, required: true, ref: "agents" }, // Agents reference
    status: {
        type: String,
        enum: orderStatus, // Limit status to available options
        default: "pending",
    },
    orderPricing: {
        type: Number,
        required: true,
    },
    payment: {
        reference: { type: String, required: true }, // Paystack payment reference
        status: {
            type: String,
            enum: ["successful", "pending", "failed"],
            default: "pending",
        }, // Payment status
    },
}, { timestamps: true });
const orderModels = (0, mongoose_1.model)("orders", ordersSchema);
exports.default = orderModels;
