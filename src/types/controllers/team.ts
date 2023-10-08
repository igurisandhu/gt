import { ObjectId } from "mongoose";

interface ITeam {
  owner_id: ObjectId;
  company_id: ObjectId;
  name: string;
  logo?: string;
  isDeleted: boolean;
  isActive: boolean;
}

interface ITeamProfile extends ITeam {
  _id: ObjectId;
}

export { ITeam, ITeamProfile };
