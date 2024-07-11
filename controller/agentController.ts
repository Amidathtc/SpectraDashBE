import { NextFunction, Response, Request } from "express";
import { AsyncHandler } from "../MiddleWare/AsyncHandler";
import { HTTPCODES, MainAppError } from "../Utils/MainAppError";
import agentModel from "../model/AgentModel";

export const viewAllAgent = AsyncHandler(
  async (req: Request, res: Response) => {
    try {
      // const users = await clientModels.find().populate("ShipmentHistory");
      const agents = await agentModel.find();
      return res.status(HTTPCODES.OK).json({
        length: agents?.length,
        message:
          agents?.length === 0
            ? "No Available Agent yet"
            : "All Agents successfully gotten",
        data: agents,
      });
    } catch (error) {
      return res.status(HTTPCODES.BAD_REQUEST).json({
        message: "An Error Occured View All Users",
        error: error,
      });
    }
  }
);

export const createAgent = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { agentName, agentCompanyName, agentZones, deliveryDays } = req.body;

    // lbb 3-5 days
    // trill 1-4 days
    // tv deluxe 2-7 days

    // Validate agentZones data structure (optional)
    if (
      !Array.isArray(agentZones) ||
      !agentZones.every(
        (zone) =>
          zone.zone_name && zone.countries && Array.isArray(zone.kg_prices)
      )
    ) {
      return res
        .status(400)
        .json({ message: "Invalid agentZones data structure" });
    }

    try {
      const newAgent: any = await agentModel.create({
        agentName,
        agentCompanyName,
        agentZones,
        deliveryDays,
      });
      res.status(201).json({
        No_Agents: `Number of Agents:${newAgent?.length}`,
        message: "An Agent has being created",
        data: newAgent,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message, error });
      return next(
        new MainAppError({
          message: "An error occurred in while creating Agent",
          httpcode: HTTPCODES.INTERNAL_SERVER_ERROR,
        })
      );
    }
  }
);

export const addMoreZones = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { agentID } = req.params;
    const { newZone } = req.body; // Specify newZone object with zone structure

    // Validate agentId and newZone structure (optional)

    try {
      const agent: any = await agentModel.findById(agentID);
      if (!agent) {
        return res.status(404).json({ message: "Agent not found" });
      }

      // Push the new zone object to the agent's agentZones array
      agent?.agentZones.push(newZone);
      await agent?.save(); // Save the updated agent document

      res.status(200).json({
        lengthOfData: `${agent.agentZones.length}`,
        message: "new zone has being added",
        data: agent.agentZones,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message, error });
    }
  }
);

export const addMoreKgAndPrices = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { agentID } = req.params;
    const { zoneName, newKgPrices } = req.body; // Specify zoneName and newKgPrices array

    // Validate agentId, zoneName, and newKgPrices structure (optional)

    try {
      const agent = await agentModel.findById(agentID);
      if (!agent) {
        return res.status(404).json({ message: "Agent not found" });
      }

      const targetZone = agent?.agentZones.find(
        (zone) => zone.zone_name === zoneName
      ); // Find the zone by name
      if (!targetZone) {
        return res.status(400).json({ message: "Zone not found in agent" });
      }

      // Push new kg_prices to the target zone's kg_prices array
      targetZone.kg_prices.push(...newKgPrices);
      await agent?.save(); // Save the updated agent document

      res.status(200).json(agent);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }
);

export const getAgent = AsyncHandler(async (req: Request, res: Response) => {
  try {
    const { agentID } = req.params;
    const Agent = await agentModel.findById(agentID);

    return res.status(HTTPCODES.OK).json({
      data: Agent,
    });
  } catch (error: any) {
    if (error.path === "_id") {
      return res.status(HTTPCODES.NOT_FOUND).json({
        message: "An Error Occured in getAdmin(id)",
      });
    }
    return res.status(HTTPCODES.INTERNAL_SERVER_ERROR).json({
      message: "An Error Occured in getAdmin",
      error: error?.message,
    });
  }
});

export const deleteAgent = AsyncHandler(async (req: Request, res: Response) => {
  try {
    const { agentID } = req.params;
    const agent = await agentModel.findByIdAndDelete(agentID);

    return res.status(HTTPCODES.OK).json({
      message: `${agent?.agentCompanyName} account has being deleted`,
    });
  } catch (error: any) {
    if (error.path === "_id") {
      return res.status(HTTPCODES.NOT_FOUND).json({
        message: "An Error Occured in getAgent(id)",
      });
    }
    return res.status(HTTPCODES.INTERNAL_SERVER_ERROR).json({
      message: "An Error Occured in getAgent",
      error: error?.message,
    });
  }
});

export const updateAgentInfo = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { agentID } = req.params;

      const { agentName } = req.body;
      const agent = await agentModel.findByIdAndUpdate(
        agentID,
        { agentName },
        { new: true }
      );
      return res.status(HTTPCODES.OK).json({
        message: "Agent details has being Updated",
        data: agent,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message, error });
      return next(
        new MainAppError({
          message: "Agent details hasn't being Updated",
          httpcode: HTTPCODES.BAD_REQUEST,
        })
      );
    }
  }
);

export const updateAgentDeliveryDays = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { agentID } = req.params;

      const { deliveryDays } = req.body;
      const agent = await agentModel.findByIdAndUpdate(
        agentID,
        { deliveryDays },
        { new: true }
      );
      return res.status(HTTPCODES.OK).json({
        message: "Agent's delivery days has being Updated",
        data: agent,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message, error });
      return next(
        new MainAppError({
          message: "Agent's delivery days hasn't being Updated",
          httpcode: HTTPCODES.BAD_REQUEST,
        })
      );
    }
  }
);
