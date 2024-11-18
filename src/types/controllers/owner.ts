import { ObjectId } from "mongoose";
import { unPick } from "../utilities/typescriptUtilities";

interface IOwner {
  name: string;
  email: string;
  phone: string;
  country?: string;
  countryCode?: string;
  avatar?: string;
  password: string;
  isDeleted: boolean;
  isActive: boolean;
}

interface IOwnerProfile extends unPick<IOwner, "password"> {
  _id: ObjectId;
}

interface IOwnerProfileWithAuth extends IOwnerProfile {
  Authorization: string;
}

interface IOwnerProfileWithOptionalPassword extends IOwnerProfile {
  password?: string;
}

type IOwnerLoginRequest = Pick<IOwner, "email" | "password">;

export {
  IOwnerSignupRequest,
  IOwner,
  IOwnerProfile,
  IOwnerProfileWithAuth,
  IOwnerProfileWithOptionalPassword,
  IOwnerLoginRequest,
};
