import { Model, Schema, model, Document } from "mongoose";
import ITaskSchema from "../../../types/models/tasks";

// 0 = unassigned,
// 1 = assigned,
// 2 = acknowledge,
// 3 = start,
// 4 = arrive,
// 5 = successful,
// 6 = cancel,
// 7 = failed

interface IModleTask extends Document, ITaskSchema {}

const taskSchema = new Schema<IModleTask>({
  company_id: { type: Schema.Types.ObjectId, required: true, ref: "Company" },
  customer_id: { type: Schema.Types.ObjectId },
  manager_id: { type: Schema.Types.ObjectId, required: true, ref: "Manager" },
  admin_id: { type: Schema.Types.ObjectId, required: true, ref: "Owner" },
  task_id: { type: Number, unique: true, required: true },
  status: {
    type: Number,
    enum: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    required: true,
    default: 0,
  },
  name: { type: String, required: true },
  phone: { type: Number },
  type: { type: Number, enum: [1, 2], required: true, default: 1 },
  address: { type: String },
  location: {
    type: {
      type: String,
    },
    coordinates: [Number],
  },
  isDeleted: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
});

const TaskModel: Model<IModleTask> = model<IModleTask>("Task", taskSchema);

export default TaskModel;
