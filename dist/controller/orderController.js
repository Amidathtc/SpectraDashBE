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
exports.makeOrder = void 0;
const mongoose_1 = require("mongoose");
const MainAppError_1 = require("../Utils/MainAppError");
const AsyncHandler_1 = require("../MiddleWare/AsyncHandler");
const userModel_1 = __importDefault(require("../model/userModel"));
const OrdersModel_1 = __importDefault(require("../model/OrdersModel"));
const AgentModel_1 = __importDefault(require("../model/AgentModel"));
exports.makeOrder = (0, AsyncHandler_1.AsyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID, agentID } = req.params;
        const { sender, receiver, shipmentDetails, shipmentMetrics } = req.body;
        const user = yield userModel_1.default.findById(userID);
        const agent = yield AgentModel_1.default.findById(agentID);
        if (user && agent) {
            const order = yield OrdersModel_1.default.create({
                sender,
                receiver,
                shipmentDetails,
                shipmentMetrics,
                user: user,
                agent: agent,
            });
            yield (user === null || user === void 0 ? void 0 : user.orders.push(new mongoose_1.Types.ObjectId(order === null || order === void 0 ? void 0 : order._id)));
            yield (user === null || user === void 0 ? void 0 : user.save());
            yield (agent === null || agent === void 0 ? void 0 : agent.orders.push(new mongoose_1.Types.ObjectId(order === null || order === void 0 ? void 0 : order._id)));
            yield (agent === null || agent === void 0 ? void 0 : agent.save());
            return res.status(MainAppError_1.HTTPCODES.OK).json({
                message: "Shipment Ordered",
                data: order,
            });
        }
        else {
            return next(new MainAppError_1.MainAppError({
                message: "Account has not been verified yet.",
                httpcode: MainAppError_1.HTTPCODES.BAD_REQUEST,
            }));
        }
    }
    catch (error) {
        return next(new MainAppError_1.MainAppError({
            message: "An error occurred in while booking shipment ",
            httpcode: MainAppError_1.HTTPCODES.INTERNAL_SERVER_ERROR,
        }));
    }
}));
