import { Model, Schema, model, Document } from "mongoose";
import { IManagerTeam } from "../../../types/controllers/manager";

interface IModleManagerTeam extends Document, IManagerTeam {}

const managerTeamSchema = new Schema<IManagerTeam>({
  manager_id: { type: Schema.Types.ObjectId, required: true, ref: "Manager" },
  team_id: { type: Schema.Types.ObjectId, required: true, ref: "Team" },
  company_id: { type: Schema.Types.ObjectId, required: true, reqf: "Company" },
});

const ManagerTeamModel = model<IModleManagerTeam>(
  "ManagerTeam",
  managerTeamSchema,
);

export default ManagerTeamModel;
