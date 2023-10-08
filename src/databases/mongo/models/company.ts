import { Schema, model } from "mongoose";
import ICompanySchema from "../../../types/models/company";

const companySchema = new Schema<ICompanySchema>({
  owner_id: { type: Schema.Types.ObjectId, required: true, ref: "Owner" },
  name: { type: String, required: true },
  email: { type: String, required: true },
  logo: { type: String, default: "/assets/images/company-logo.png" },
  phone: { type: Number, required: true },
  phoneCountryCode: { type: Number, required: false },
  country: { type: String, required: false },
  countryCodeAlphabet: { type: String, required: false },
  website: { type: String, required: false },
  isDeleted: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
});

const CompanyModel = model<ICompanySchema>("Company", companySchema);

export default CompanyModel;
