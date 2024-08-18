import { ObjectId } from "mongoose";
import { unPick } from "../utilities/typescriptUtilities";
import { ITeamProfile } from "./team";
import { ICompanyProfile } from "./company";

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
  permissions: object;
}

type IManagerSignupRequest = unPick<IManager, "isActive" | "isDeleted">;

interface IManagerProfile extends unPick<IManager, "password"> {
  _id: ObjectId;
}

interface IManagerProfileWithAuth
  extends unPick<IManagerProfile, "company_id"> {
  Authorization: string;
  isManager: boolean;
  company_id?: ICompanyProfile;
}

interface IManagerProfileWithOptionalPassword
  extends unPick<IManagerProfile, "company_id"> {
  password?: string;
  company_id?: ICompanyProfile;
}

type IManagerLoginRequest = Pick<IManager, "email" | "password">;

interface IManagerTeam {
  manager_id: ObjectId;
  team_id: ObjectId;
  company_id: ObjectId;
}

interface IManagerTeamWithTeam extends unPick<IManagerTeam, "team_id"> {
  team_id: ITeamProfile;
}

export {
  IManagerSignupRequest,
  IManager,
  IManagerProfile,
  IManagerProfileWithAuth,
  IManagerProfileWithOptionalPassword,
  IManagerLoginRequest,
  IManagerTeam,
  IManagerTeamWithTeam,
};
