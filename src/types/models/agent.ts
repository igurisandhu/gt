import { IAgent } from "../controllers/agent";

export interface IAgentSchema extends IAgent {
  validatePassword(password: string): Promise<boolean>;
}

export default IAgentSchema;
