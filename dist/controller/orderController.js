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
exports.deleteOrderE = exports.deleteOrder = exports.getOrder = exports.getAllOrders = exports.viewOrder = exports.makeOrder = void 0;
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
        const { weight_kg } = shipmentMetrics; // Assuming weight is a property in shipmentMetrics
        const user = yield userModel_1.default.findById(userID);
        const agent = yield AgentModel_1.default.findById(agentID).populate("agentZones"); // Populate agentZones
        if (user && agent && (agent === null || agent === void 0 ? void 0 : agent.agentZones.length) > 0) {
            const matchingZone = agent === null || agent === void 0 ? void 0 : agent.agentZones.find((zone) => {
                const { countries } = zone;
                return countries.includes(receiver === null || receiver === void 0 ? void 0 : receiver.country); // Check if receiver country is in the zone
            });
            if (matchingZone) {
                const { kg_prices } = matchingZone;
                const matchingPrice = kg_prices.find((price) => {
                    return weight_kg >= (price === null || price === void 0 ? void 0 : price.from_kg) && weight_kg <= (price === null || price === void 0 ? void 0 : price.to_kg); // Check if weight falls within range
                });
                if (matchingPrice) {
                    const orderPricing = matchingPrice === null || matchingPrice === void 0 ? void 0 : matchingPrice.price; // Set orderPricing based on matching price
                    const order = yield OrdersModel_1.default.create({
                        sender,
                        receiver,
                        shipmentDetails,
                        shipmentMetrics,
                        orderPricing,
                        userID,
                        agentID,
                    });
                    user === null || user === void 0 ? void 0 : user.orders.push(new mongoose_1.Types.ObjectId(order === null || order === void 0 ? void 0 : order._id));
                    yield (user === null || user === void 0 ? void 0 : user.save());
                    agent === null || agent === void 0 ? void 0 : agent.orders.push(new mongoose_1.Types.ObjectId(order === null || order === void 0 ? void 0 : order._id));
                    yield (agent === null || agent === void 0 ? void 0 : agent.save());
                    return res.status(MainAppError_1.HTTPCODES.CREATED).json({
                        message: "Shipment Ordered",
                        status: "success",
                        data: order,
                    });
                }
                else {
                    return next(new MainAppError_1.MainAppError({
                        message: "Shipment weight does not fall within any zone's price range",
                        httpcode: MainAppError_1.HTTPCODES.BAD_REQUEST,
                    }));
                }
            }
            else {
                return next(new MainAppError_1.MainAppError({
                    message: "Receiver country not covered by any of the agent's zones",
                    httpcode: MainAppError_1.HTTPCODES.BAD_REQUEST,
                }));
            }
        }
        else {
            return next(new MainAppError_1.MainAppError({
                message: "Account has not been verified yet or Agent has no zones defined.",
                httpcode: MainAppError_1.HTTPCODES.BAD_REQUEST,
            }));
        }
    }
    catch (error) {
        res.status(400).json({ message: error.message, error });
        return next(new MainAppError_1.MainAppError({
            message: "An error occurred while booking shipment ",
            httpcode: MainAppError_1.HTTPCODES.INTERNAL_SERVER_ERROR,
        }));
    }
}));
exports.viewOrder = (0, AsyncHandler_1.AsyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const shipments = yield OrdersModel_1.default.find();
        return res.status(MainAppError_1.HTTPCODES.OK).json({
            No_Shipments: `${shipments.length}`,
            message: "All Shipments",
            data: shipments,
        });
    }
    catch (error) {
        res.status(400).json({ message: error.message, error });
        return next(new MainAppError_1.MainAppError({
            message: "An error occurred while viewing shipments",
            httpcode: MainAppError_1.HTTPCODES.INTERNAL_SERVER_ERROR,
        }));
    }
}));
const getAllOrders = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield OrdersModel_1.default.find().populate("user").populate("agent");
        return res.status(MainAppError_1.HTTPCODES.OK).json({
            No_Shipments: `${orders.length}`,
            message: "All Shipments",
            data: orders,
        });
    }
    catch (error) {
        res.status(400).json({ message: error.message, error });
        return next(new MainAppError_1.MainAppError({
            message: "An error occurred while viewing shipments",
            httpcode: MainAppError_1.HTTPCODES.INTERNAL_SERVER_ERROR,
        }));
    }
});
exports.getAllOrders = getAllOrders;
const getOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const order = yield OrdersModel_1.default
            .findById(id)
            .populate("user")
            .populate("agent");
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        res.status(200).json({ message: "Requested Order", data: order });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getOrder = getOrder;
exports.deleteOrder = (0, AsyncHandler_1.AsyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID, shipmentID } = req.params;
        const user = yield userModel_1.default.findById(userID);
        const deletedOrder = yield OrdersModel_1.default.findByIdAndDelete(shipmentID);
        if (!deletedOrder) {
            return res
                .status(MainAppError_1.HTTPCODES.BAD_REQUEST)
                .json({ message: "Order not found" });
        }
        user === null || user === void 0 ? void 0 : user.orders.pull(new mongoose_1.Types.ObjectId(deletedOrder._id));
        yield user.save();
        return res.status(MainAppError_1.HTTPCODES.OK).json({
            message: "Order deleted successfully",
        });
    }
    catch (error) {
        res.status(400).json({ message: error.message, error });
        return next(new MainAppError_1.MainAppError({
            message: "An error occurred while viewing shipments",
            httpcode: MainAppError_1.HTTPCODES.INTERNAL_SERVER_ERROR,
        }));
    }
}));
exports.deleteOrderE = (0, AsyncHandler_1.AsyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { userID, agentID, shipmentID } = req.params; // Assuming orderID is correct
        const user = yield userModel_1.default.findById(userID);
        const agent = yield AgentModel_1.default.findById(agentID);
        const deletedOrder = yield OrdersModel_1.default
            .findById(shipmentID)
            .populate("user", "_id"); // Populate user for authorization
        if (!deletedOrder) {
            return res.status(404).json({ message: "Order not found" });
        }
        // Check if requesting user is the order owner or the assigned agent
        if ((deletedOrder === null || deletedOrder === void 0 ? void 0 : deletedOrder.user._id.toString()) !== userID &&
            (deletedOrder === null || deletedOrder === void 0 ? void 0 : deletedOrder.agent._id.toString()) !== agentID) {
            return res
                .status(401)
                .json({ message: "Unauthorized to delete this order" });
        }
        user === null || user === void 0 ? void 0 : user.orders.pull(new mongoose_1.Types.ObjectId(deletedOrder._id));
        yield user.save();
        (_a = agent === null || agent === void 0 ? void 0 : agent.orders) === null || _a === void 0 ? void 0 : _a.pull(new mongoose_1.Types.ObjectId(deletedOrder._id));
        yield (agent === null || agent === void 0 ? void 0 : agent.save());
        return res.status(MainAppError_1.HTTPCODES.OK).json({
            message: "Order deleted successfully",
        });
    }
    catch (error) {
        console.error(error); // Log the error for debugging
        res
            .status(MainAppError_1.HTTPCODES.INTERNAL_SERVER_ERROR)
            .json({ message: "An error occurred while deleting the order" });
    }
}));
