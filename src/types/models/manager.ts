import { ObjectId } from "mongoose";
import { IManager, IManagerTeam } from "../controllers/manager";

export interface IManagerSchema extends IManager {
  _id: ObjectId;
  valifatePassword(password: string): Promise<boolean>;
}

export interface IManagerTeamSchema extends IManagerTeam {
  _id: ObjectId;
}

export default IManagerSchema;
