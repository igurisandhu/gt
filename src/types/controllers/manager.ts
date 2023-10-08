import { ObjectId } from "mongoose";
import { unPick } from "../utilities/typescriptUtilities";

interface IManager {
  name: string;
  email: string;
  phone: number;
  phoneCountryCode?: number;
  country?: string;
  countryCodeAlphabet?: string;
  avatar?: string;
  password: string;
  isDeleted: boolean;
  isActive: boolean;
  owner_id: ObjectId;
  company_id: ObjectId;
}

interface IManagerSignupRequest
  extends unPick<IManager, "isActive" | "isDeleted"> {}

interface IManagerProfile extends unPick<IManager, "password"> {
  _id: ObjectId;
}

interface IManagerProfileWithAuth extends IManagerProfile {
  Authorization: string;
  isManager: boolean;
}

interface IManagerProfileWithOptionalPassword extends IManagerProfile {
  password?: string;
}

interface IManagerLoginRequest extends Pick<IManager, "email" | "password"> {}

interface IManagerTeam {
  manager_id: ObjectId;
  team_id: ObjectId;
  company_id: ObjectId;
}

export {
  IManagerSignupRequest,
  IManager,
  IManagerProfile,
  IManagerProfileWithAuth,
  IManagerProfileWithOptionalPassword,
  IManagerLoginRequest,
  IManagerTeam,
};
