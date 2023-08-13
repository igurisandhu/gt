import { Schema, model } from "mongoose";
import IOwnerCompanySchema from "../../../types/models/ownerCompany";

const ownerCompanySchema = new Schema<IOwnerCompanySchema>({
  owner_id: { type: Schema.Types.ObjectId, required: true, ref: "Owner" },
  name: { type: String, required: true },
  email: { type: String, required: true },
  logo: { type: String, default: "/assets/images/company-logo.png" },
  phone: { type: Number, required: true },
  phoneCountryCode: { type: Number, required: true },
  country: { type: String, required: true },
  countryCodeAlphabet: { type: String, required: true },
  website: { type: String },
  isDeleted: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
});

const OwnerCompanyModel = model<IOwnerCompanySchema>(
  "OwnerCompany",
  ownerCompanySchema,
);

export default OwnerCompanyModel;
