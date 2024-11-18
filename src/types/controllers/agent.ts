import { ObjectId } from "mongoose";
import { unPick } from "../utilities/typescriptUtilities";
import { ITeamProfile } from "./team";

interface IAgent {
  owner_id: ObjectId;
  company_id: ObjectId;
  team_id: ObjectId;
  name?: string;
  email?: string;
  phone?: string;
  country?: string;
  countryCode?: string;
  avatar?: string;
  password?: string;
  agentCode: string;
  isDeleted: boolean;
  isActive: boolean;
  location: {
    type: string;
    coordinates: number[];
  };
}

type IAgentSignupRequest = IAgent;

interface IAgentProfile extends unPick<IAgent, "password"> {
  _id: ObjectId;
}

interface IAgentProfileWithTeamData
  extends unPick<IAgent, "password" | "team_id"> {
  _id: ObjectId;
  team_id: ITeamProfile;
}

interface IAgentProfileWithAuth extends IAgentProfile {
  Authorization: string;
}

interface IAgentProfileWithOptionalPassword extends IAgentProfile {
  password?: string;
}

type IAgentLoginRequest = Pick<IAgent, "email" | "password">;

export {
  IAgentSignupRequest,
  IAgent,
  IAgentProfile,
  IAgentProfileWithAuth,
  IAgentProfileWithOptionalPassword,
  IAgentLoginRequest,
  IAgentProfileWithTeamData,
};
