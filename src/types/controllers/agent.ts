import { ObjectId } from "mongoose";
import { unPick } from "../utilities/typescriptUtilities";

interface IAgent {
  owner_id: ObjectId;
  company_id: ObjectId;
  team_id: ObjectId;
  name?: string;
  email?: string;
  phone?: number;
  phoneCountryCode?: number;
  country?: string;
  countryCodeAlphabet?: string;
  avatar?: string;
  password?: string;
  agentCode: string;
  isDeleted: boolean;
  isActive: boolean;
  location: {
    type: string;
    coordinates: [number];
  };
}

interface IAgentSignupRequest extends IAgent {}

interface IAgentProfile extends unPick<IAgent, "password"> {
  _id: ObjectId;
}

interface IAgentProfileWithAuth extends IAgentProfile {
  Authorization: string;
}

interface IAgentProfileWithOptionalPassword extends IAgentProfile {
  password?: string;
}

interface IAgentLoginRequest extends Pick<IAgent, "email" | "password"> {}

export {
  IAgentSignupRequest,
  IAgent,
  IAgentProfile,
  IAgentProfileWithAuth,
  IAgentProfileWithOptionalPassword,
  IAgentLoginRequest,
};
