import { ObjectId } from "mongoose";

interface ITask {
  task_id: number;
  company_id: ObjectId;
  location: {
    type: string;
    coordinates: number[];
  };
  type: 1 | 2;
  status: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
  address: string;
  name: string;
  phone?: number;
  isDeleted: boolean;
  isActive: boolean;
  customer_id?: ObjectId;
  manager_id?: ObjectId;
  admin_id: ObjectId;
}

interface ITaskProfile extends ITask {
  _id: ObjectId;
}

export { ITask, ITaskProfile };
