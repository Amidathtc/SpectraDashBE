import { Schema, Types, model } from "mongoose";
import { Iagent } from "../interface/interface";


interface iAgentData extends Iagent, Document {}

const agentModel = new Schema<iAgentData>(
  {
    fullName: {
      type: String,
    },
    AgentCompanyname: {
        type: String,
      },
    AgentEmail: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
    },
    verified: {
      type: Boolean,
      default: true,
    },
    role: {
      type: String,
    },
    profile: [
        {
          type: Types.ObjectId,
          ref: "profiles",
        },
      ],
    
  },
  { timestamps: true }
);

export default model("agents", agentModel);