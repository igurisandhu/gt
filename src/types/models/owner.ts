import { ObjectId } from "mongoose";
import { IOwner } from "../controllers/owner";

export interface IOnwnerSchema extends IOwner {
  _id: ObjectId;
  valifatePassword(password: string): Promise<boolean>;
}

export default IOnwnerSchema;
