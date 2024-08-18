import { Model, Schema, model, Document } from "mongoose";
import { IJobSchema } from "../../../types/models/tasks";
// import AutoIncrementFactory from 'mongoose-sequence';

// 0 = unassigned,
// 1 = assigned,
// 2 = acknowledge,
// 3 = start,
// 4 = arrive,
// 5 = successful,
// 6 = cancel,
// 7 = failed

interface IModleJob extends Document, IJobSchema {}

const jobSchema = new Schema<IModleJob>({
  company_id: { type: Schema.Types.ObjectId, required: true, ref: "Company" },
  customer_id: { type: Schema.Types.ObjectId },
  manager_id: { type: Schema.Types.ObjectId, ref: "Manager" },
  owner_id: { type: Schema.Types.ObjectId, required: true, ref: "Owner" },
  team_id: { type: Schema.Types.ObjectId, required: true, ref: "Team" },
  isDeleted: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  agent_id: { type: Schema.Types.ObjectId, ref: "Agent" },
  task_id: [{ type: Schema.Types.ObjectId, required: true, ref: "Task" }],
  order_id: { type: Number, unique: true },
});

const JobModel: Model<IModleJob> = model<IModleJob>("Job", jobSchema);

export default JobModel;
