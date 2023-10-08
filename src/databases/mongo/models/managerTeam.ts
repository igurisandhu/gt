import { Schema, model } from "mongoose";
import { IManagerTeam } from "../../../types/controllers/manager";
import { IManagerTeamSchema } from "../../../types/models/manager";

const managerTeamSchema = new Schema<IManagerTeam>({
  manager_id: { type: Schema.Types.ObjectId, required: true, ref: "Manager" },
  team_id: { type: Schema.Types.ObjectId, required: true, ref: "Team" },
  company_id: { type: Schema.Types.ObjectId, required: true, reqf: "Company" },
});

const ManagerTeamModel = model<IManagerTeamSchema>(
  "ManagerTeam",
  managerTeamSchema,
);

export default ManagerTeamModel;
