import { ObjectId } from "mongoose";

interface ICompany {
  owner_id: ObjectId;
  name: string;
  email: string;
  phone: number;
  phoneCountryCode?: number;
  country?: string;
  countryCodeAlphabet?: string;
  logo?: string;
  website?: string;
  isDeleted: boolean;
  isActive: boolean;
}

interface ICompanyProfile extends ICompany {
  _id: ObjectId;
}

export { ICompany, ICompanyProfile };
