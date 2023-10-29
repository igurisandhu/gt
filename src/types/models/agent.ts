import { ObjectId } from "mongoose";
import { IAgent } from "../controllers/agent";

export interface IAgentSchema extends IAgent {
  valifatePassword(password: string): Promise<boolean>;
}

export default IAgentSchema;
