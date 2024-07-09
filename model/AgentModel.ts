import { Schema, Types, model } from "mongoose";
import { IAgent } from "../interface/interface";
import { ROLE } from "../Utils/enum";

interface iAgentData extends IAgent, Document {}

const kgPriceSchema = new Schema({
  from_kg: {
    type: Number,
    required: true,
  },
  to_kg: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

const deliveryZoneSchema = new Schema({
  zone_name: {
    type: String,
    required: true,
  },
  countries: {
    type: [String],
    required: true,
  },
  kg_prices: {
    type: [kgPriceSchema],
    required: true,
  },
});

const agentSchema = new Schema<iAgentData>(
  {
    agentName: {
      type: String,
      required: true,
    },
    agentCompanyName: {
      type: String,
    },
    agentZones: {
      // Use the deliveryZoneSchema for nested zones
      type: [deliveryZoneSchema],
      required: true,
    },
    role: {
      type: String,
      default: ROLE.AGENT,
    },
    orders: [
      {
        type: Types.ObjectId,
        ref: "orders",
      },
    ],
  },
  { timestamps: true }
);

const agentModel = model<iAgentData>("agents", agentSchema);

export default agentModel;
