import { ObjectId } from "mongoose";

interface IOwnerCompany {
  owner_id: ObjectId;
  name: string;
  email: string;
  phone: number;
  phoneCountryCode: number;
  country: string;
  countryCodeAlphabet: string;
  logo?: string;
  website?: string;
  isDeleted: boolean;
  isActive: boolean;
}

interface IOwnerCompanyProfile extends IOwnerCompany {
  _id: ObjectId;
}

export { IOwnerCompany, IOwnerCompanyProfile };
