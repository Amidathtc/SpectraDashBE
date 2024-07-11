"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const orderStatus = ["pending", "processing", "shipped", "delivered"]; // Order status options
const senderCountry = "Nigeria"; // Order status options
const ordersSchema = new mongoose_1.Schema({
    sender: {
        country: {
            type: String,
            required: true,
            enum: senderCountry, // Limit status to available options
            default: "Nigeria",
        },
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        street: { type: String, required: true },
        unit_aptNo: { type: String },
        city: { type: String, required: true },
        state: { type: String, required: true },
        postalCode: { type: Number, required: true },
        phoneNo: { type: Number, required: true },
        email: { type: String, required: true },
    },
    receiver: {
        country: { type: String, required: true },
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        street: { type: String, required: true },
        unit_aptNo: { type: String },
        city: { type: String, required: true },
        state: { type: String, required: true },
        postalCode: { type: Number, required: true },
        phoneNo: { type: Number, required: true },
        email: { type: String, required: true },
    },
    shipmentDetails: {
        typeOfItem: { type: String, required: true },
        color: { type: String },
        brand: { type: String },
        itemForm: { type: String },
        quantity: { type: Number, required: true },
        itemValue: { type: String, required: true },
    },
    shipmentMetrics: {
        weight_kg: { type: Number, required: true },
        length_cm: { type: Number, required: true },
        width_cm: { type: Number, required: true },
        height_cm: { type: Number, required: true },
    },
    user: { type: mongoose_1.Types.ObjectId, required: true, ref: "users" }, // User reference
    status: {
        type: String,
        enum: orderStatus, // Limit status to available options
        default: "pending",
    },
    orderPricing: {
        type: Number,
        required: true,
    },
}, { timestamps: true });
const orderModels = (0, mongoose_1.model)("orders", ordersSchema);
exports.default = orderModels;
