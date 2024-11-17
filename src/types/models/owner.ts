import { ObjectId } from "mongoose";
import { IOwner } from "../controllers/owner";

export interface IOwnerSchema extends IOwner {
  _id: ObjectId;
  validatePassword(password: string): Promise<boolean>;
}

export default IOwnerSchema;
