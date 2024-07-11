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
exports.updateAgentDeliveryDays = exports.updateAgentInfo = exports.deleteAgent = exports.getAgent = exports.addMoreKgAndPrices = exports.addMoreZones = exports.createAgent = exports.viewAllAgent = void 0;
const AsyncHandler_1 = require("../MiddleWare/AsyncHandler");
const MainAppError_1 = require("../Utils/MainAppError");
const AgentModel_1 = __importDefault(require("../model/AgentModel"));
exports.viewAllAgent = (0, AsyncHandler_1.AsyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const users = await clientModels.find().populate("ShipmentHistory");
        const agents = yield AgentModel_1.default.find();
        return res.status(MainAppError_1.HTTPCODES.OK).json({
            length: agents === null || agents === void 0 ? void 0 : agents.length,
            message: (agents === null || agents === void 0 ? void 0 : agents.length) === 0
                ? "No Available Agent yet"
                : "All Agents successfully gotten",
            data: agents,
        });
    }
    catch (error) {
        return res.status(MainAppError_1.HTTPCODES.BAD_REQUEST).json({
            message: "An Error Occured View All Users",
            error: error,
        });
    }
}));
exports.createAgent = (0, AsyncHandler_1.AsyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { agentName, agentCompanyName, agentZones, deliveryDays } = req.body;
    // lbb 3-5 days
    // trill 1-4 days
    // tv deluxe 2-7 days
    // Validate agentZones data structure (optional)
    if (!Array.isArray(agentZones) ||
        !agentZones.every((zone) => zone.zone_name && zone.countries && Array.isArray(zone.kg_prices))) {
        return res
            .status(400)
            .json({ message: "Invalid agentZones data structure" });
    }
    try {
        const newAgent = yield AgentModel_1.default.create({
            agentName,
            agentCompanyName,
            agentZones,
            deliveryDays,
        });
        res.status(201).json({
            No_Agents: `Number of Agents:${newAgent === null || newAgent === void 0 ? void 0 : newAgent.length}`,
            message: "An Agent has being created",
            data: newAgent,
        });
    }
    catch (error) {
        res.status(400).json({ message: error.message, error });
        return next(new MainAppError_1.MainAppError({
            message: "An error occurred in while creating Agent",
            httpcode: MainAppError_1.HTTPCODES.INTERNAL_SERVER_ERROR,
        }));
    }
}));
exports.addMoreZones = (0, AsyncHandler_1.AsyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { agentID } = req.params;
    const { newZone } = req.body; // Specify newZone object with zone structure
    // Validate agentId and newZone structure (optional)
    try {
        const agent = yield AgentModel_1.default.findById(agentID);
        if (!agent) {
            return res.status(404).json({ message: "Agent not found" });
        }
        // Push the new zone object to the agent's agentZones array
        agent === null || agent === void 0 ? void 0 : agent.agentZones.push(newZone);
        yield (agent === null || agent === void 0 ? void 0 : agent.save()); // Save the updated agent document
        res.status(200).json({
            lengthOfData: `${agent.agentZones.length}`,
            message: "new zone has being added",
            data: agent.agentZones,
        });
    }
    catch (error) {
        res.status(400).json({ message: error.message, error });
    }
}));
exports.addMoreKgAndPrices = (0, AsyncHandler_1.AsyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { agentID } = req.params;
    const { zoneName, newKgPrices } = req.body; // Specify zoneName and newKgPrices array
    // Validate agentId, zoneName, and newKgPrices structure (optional)
    try {
        const agent = yield AgentModel_1.default.findById(agentID);
        if (!agent) {
            return res.status(404).json({ message: "Agent not found" });
        }
        const targetZone = agent === null || agent === void 0 ? void 0 : agent.agentZones.find((zone) => zone.zone_name === zoneName); // Find the zone by name
        if (!targetZone) {
            return res.status(400).json({ message: "Zone not found in agent" });
        }
        // Push new kg_prices to the target zone's kg_prices array
        targetZone.kg_prices.push(...newKgPrices);
        yield (agent === null || agent === void 0 ? void 0 : agent.save()); // Save the updated agent document
        res.status(200).json(agent);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
}));
exports.getAgent = (0, AsyncHandler_1.AsyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { agentID } = req.params;
        const Agent = yield AgentModel_1.default.findById(agentID);
        return res.status(MainAppError_1.HTTPCODES.OK).json({
            data: Agent,
        });
    }
    catch (error) {
        if (error.path === "_id") {
            return res.status(MainAppError_1.HTTPCODES.NOT_FOUND).json({
                message: "An Error Occured in getAdmin(id)",
            });
        }
        return res.status(MainAppError_1.HTTPCODES.INTERNAL_SERVER_ERROR).json({
            message: "An Error Occured in getAdmin",
            error: error === null || error === void 0 ? void 0 : error.message,
        });
    }
}));
exports.deleteAgent = (0, AsyncHandler_1.AsyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { agentID } = req.params;
        const agent = yield AgentModel_1.default.findByIdAndDelete(agentID);
        return res.status(MainAppError_1.HTTPCODES.OK).json({
            message: `${agent === null || agent === void 0 ? void 0 : agent.agentCompanyName} account has being deleted`,
        });
    }
    catch (error) {
        if (error.path === "_id") {
            return res.status(MainAppError_1.HTTPCODES.NOT_FOUND).json({
                message: "An Error Occured in getAgent(id)",
            });
        }
        return res.status(MainAppError_1.HTTPCODES.INTERNAL_SERVER_ERROR).json({
            message: "An Error Occured in getAgent",
            error: error === null || error === void 0 ? void 0 : error.message,
        });
    }
}));
exports.updateAgentInfo = (0, AsyncHandler_1.AsyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { agentID } = req.params;
        const { agentName } = req.body;
        const agent = yield AgentModel_1.default.findByIdAndUpdate(agentID, { agentName }, { new: true });
        return res.status(MainAppError_1.HTTPCODES.OK).json({
            message: "Agent details has being Updated",
            data: agent,
        });
    }
    catch (error) {
        res.status(400).json({ message: error.message, error });
        return next(new MainAppError_1.MainAppError({
            message: "Agent details hasn't being Updated",
            httpcode: MainAppError_1.HTTPCODES.BAD_REQUEST,
        }));
    }
}));
exports.updateAgentDeliveryDays = (0, AsyncHandler_1.AsyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { agentID } = req.params;
        const { deliveryDays } = req.body;
        const agent = yield AgentModel_1.default.findByIdAndUpdate(agentID, { deliveryDays }, { new: true });
        return res.status(MainAppError_1.HTTPCODES.OK).json({
            message: "Agent's delivery days has being Updated",
            data: agent,
        });
    }
    catch (error) {
        res.status(400).json({ message: error.message, error });
        return next(new MainAppError_1.MainAppError({
            message: "Agent's delivery days hasn't being Updated",
            httpcode: MainAppError_1.HTTPCODES.BAD_REQUEST,
        }));
    }
}));
