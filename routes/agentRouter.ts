import { Router } from "express";
import {
    ViewAllAgent,
  getAgent,
  logoutAgent,
  loginAgent,
  updateAgent,
  createAgent,
  verifyAgent,
  deleteAgent
} from "../controller/agentController";

const AgentRoute = Router();

AgentRoute.route("/get-all-users").get(ViewAllAgent);
AgentRoute.route("/create-user").post(createAgent);
AgentRoute.route("/login").post(loginAgent);
AgentRoute.route("/logout").post(logoutAgent);
AgentRoute.route("/get-user/:userID").get(getAgent);
AgentRoute.route("/delete-user/:userID").delete(deleteAgent);
AgentRoute.route("/update-user-info/:userID").patch(updateAgent);
AgentRoute.route("/verify/:userID").get(verifyAgent)
export default AgentRoute;