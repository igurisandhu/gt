import { Model, Schema, model, Document } from "mongoose";
import ITeamSchema from "../../../types/models/team";

interface IModleTeam extends Document, ITeamSchema {}

const teamSchema = new Schema<IModleTeam>({
  owner_id: { type: Schema.Types.ObjectId, required: true, ref: "Owner" },
  company_id: { type: Schema.Types.ObjectId, required: true, ref: "Company" },
  name: { type: String, required: true },
  logo: { type: String, default: "/assets/images/team-logo.png" },
  isDeleted: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
});

const TeamModel: Model<IModleTeam> = model<IModleTeam>("Team", teamSchema);

export default TeamModel;
