import { Schema, model } from "mongoose";
import IOwner from "../../../types/models/owner";

const ownerSchema = new Schema<IOwner>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  avatar: { type: String, default: "/assets/images/onwer-avatar.png" },
  phone: { type: Number, required: true },
  phoneCountryCode: { type: Number, required: true },
  country: { type: String, required: true },
  countryCodeAlphabet: { type: String, required: true },
});

const OwnerModel = model<IOwner>("Owner", ownerSchema);

export default OwnerModel;
