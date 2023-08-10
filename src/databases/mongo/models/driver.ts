import { Schema, model } from "mongoose";
import IDriver from "../../../types/models/driver";
import LocationSchema from "./location";

const driverSchema = new Schema<IDriver>({
  owner_id: { type: Schema.Types.ObjectId, required: true, ref: "Owner" },
  company_id: { type: Schema.Types.ObjectId, required: true, ref: "Company" },
  name: { type: String },
  email: { type: String },
  avatar: { type: String, default: "/assets/images/driver-avatar.png" },
  phone: Number,
  phoneCountryCode: Number,
  country: String,
  countryCodeAlphabet: String,
  location: LocationSchema,
});

const DriverModel = model<IDriver>("Driver", driverSchema);

export default DriverModel;
