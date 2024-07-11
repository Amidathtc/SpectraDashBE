import { Router } from "express";
import {
  viewAllAgent,
  getAgent,
  createAgent,
  deleteAgent,
  addMoreZones,
  addMoreKgAndPrices,
  updateAgentDeliveryDays,
  updateAgentInfo,
} from "../controller/agentController";

const AgentRoute = Router();

AgentRoute.route("/get-all-agents").get(viewAllAgent);
AgentRoute.route("/create-agent").post(createAgent);
AgentRoute.route("/add-more-kgprices/:agentID").patch(addMoreKgAndPrices);
AgentRoute.route("/add-zones/:agentID").patch(addMoreZones);
AgentRoute.route("/update-agent-info/:agentID").patch(updateAgentInfo);
AgentRoute.route("/update-agent-ddays/:agentID").patch(updateAgentDeliveryDays);
AgentRoute.route("/get-agent/:agentID").get(getAgent);
AgentRoute.route("/delete-agent/:agentID").delete(deleteAgent);

export default AgentRoute;
