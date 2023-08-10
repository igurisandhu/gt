import { Schema, model } from "mongoose";
import IOwnerCompany from "../../../types/models/ownerCompany";
import { ObjectId } from "mongoose";

const ownerCompanySchema = new Schema<IOwnerCompany>({
  owner_id: { type: Schema.Types.ObjectId, required: true, ref: "Owner" },
  name: { type: String, required: true },
  email: { type: String, required: true },
  logo: { type: String, default: "/assets/images/company-logo.png" },
  phone: Number,
  phoneCountryCode: Number,
  country: String,
  countryCodeAlphabet: String,
  website: String,
});

const OwnerCompanyModel = model<IOwnerCompany>(
  "OwnerCompany",
  ownerCompanySchema,
);

export default OwnerCompanyModel;
