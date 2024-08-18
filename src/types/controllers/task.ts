import { ObjectId } from "mongoose";

interface ITask {
  location?: {
    type: string;
    coordinates: number[];
  };
  type: 1 | 2;
  status: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
  address: string;
  name: string;
  phone: number;
  datetime: number;
}

interface ITaskProfile extends ITask {
  _id: ObjectId;
}

interface IJob {
  customer_id?: ObjectId;
  manager_id?: ObjectId;
  owner_id: ObjectId;
  isDeleted: boolean;
  isActive: boolean;
  company_id: ObjectId;
  task_id: ITaskProfile[];
  team_id: ObjectId;
  agent_id?: ObjectId;
  order_id: number;
}

export { ITask, ITaskProfile, IJob };
