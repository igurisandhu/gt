import { ObjectId } from "mongoose";

interface ICompany {
  owner_id: ObjectId;
  name: string;
  email: string;
  phone: string;
  country?: string;
  countryCode?: string;
  logo?: string;
  website?: string;
  isDeleted: boolean;
  isActive: boolean;
}

interface ICompanyProfile extends ICompany {
  _id: ObjectId;
}

export { ICompany, ICompanyProfile };
