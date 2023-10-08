import mongoose, { Schema, model } from "mongoose";
import IOnwnerSchema from "../../../types/models/manager";
import bcrypt from "bcrypt";
import CompanyModel from "./company";

const PASSWORD_SALT = Number(process.env.PASSWORD_SALT) || 10;

const managerSchema = new Schema<IOnwnerSchema>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  avatar: { type: String, default: "/assets/images/manager-avatar.png" },
  phone: { type: Number, required: true },
  phoneCountryCode: { type: Number, required: false },
  country: { type: String, required: false },
  countryCodeAlphabet: { type: String, required: false },
  password: { type: String, required: true },
  isDeleted: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  company_id: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: CompanyModel,
  },
  owner_id: { type: mongoose.Types.ObjectId, required: true, ref: "owner" },
});

managerSchema.pre("save", function (next) {
  let manager = this;

  // only hash the password if it has been modified (or is new)
  if (!manager.isModified("password")) return next();

  // generate a salt
  bcrypt.genSalt(PASSWORD_SALT, function (err, salt) {
    if (err) return next(err);

    // hash the password using our new salt
    bcrypt.hash(manager.password, salt, function (err, hash) {
      if (err) return next(err);
      // override the cleartext password with the hashed one
      manager.password = hash;
      next();
    });
  });
});

managerSchema.methods.valifatePassword = async function (
  password: string,
): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

const ManagerModel = model<IOnwnerSchema>("Manager", managerSchema);

export default ManagerModel;
