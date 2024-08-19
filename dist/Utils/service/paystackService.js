"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY; // Ensure you have this in your environment variables
const PAYSTACK_BASE_URL = "https://api.paystack.co";
const paystackService = {
    initializePayment: (amount, email) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield axios_1.default.post(`${PAYSTACK_BASE_URL}/transaction/initialize`, {
            amount,
            email,
        }, {
            headers: {
                Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
                "Content-Type": "application/json",
            },
        });
        console.log(response);
        return response.data;
    }),
    verifyPayment: (reference) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield axios_1.default.get(`${PAYSTACK_BASE_URL}/transaction/verify/${reference}`, {
            headers: {
                Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
            },
        });
        return response.data;
    }),
};
exports.default = paystackService;
