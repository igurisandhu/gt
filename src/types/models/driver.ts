import { ObjectId } from "mongoose";

interface IDriver {
  owner_id: ObjectId;
  company_id: ObjectId;
  name?: string;
  email?: string;
  phone?: number;
  phoneCountryCode?: number;
  country?: string;
  countryCodeAlphabet?: string;
  avatar?: string;
  location: {
    type: string;
    coordinates: [number];
  };
}

export default IDriver;
