import { ObjectId } from "mongoose";
import { unPick } from "../utilities/typescriptUtilities";

interface IOwner {
  name: string;
  email: string;
  phone: number;
  phoneCountryCode?: number;
  country?: string;
  countryCodeAlphabet?: string;
  avatar?: string;
  password: string;
  isDeleted: boolean;
  isActive: boolean;
}

type IManagerSignupRequest = unPick<IOwner, "isActive" | "isDeleted">;

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
