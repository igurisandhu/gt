import { Schema, model } from "mongoose";
import ITeamSchema from "../../../types/models/team";

const teamSchema = new Schema<ITeamSchema>({
  owner_id: { type: Schema.Types.ObjectId, required: true, ref: "Owner" },
  company_id: { type: Schema.Types.ObjectId, required: true, ref: "Company" },
  name: { type: String, required: true },
  logo: { type: String, default: "/assets/images/team-logo.png" },
  isDeleted: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
});

const TeamModel = model<ITeamSchema>("Team", teamSchema);

export default TeamModel;
