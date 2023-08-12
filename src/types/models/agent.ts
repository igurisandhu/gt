import { ObjectId } from "mongoose";
import { IAgent } from "../controllers/agent";

export interface IAgentSchema extends IAgent {
  _id: ObjectId;
  valifatePassword(password: string): Promise<boolean>;
}

export default IAgentSchema;
