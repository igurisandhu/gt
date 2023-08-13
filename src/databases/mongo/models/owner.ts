import { Schema, model } from "mongoose";
import IOnwnerSchema from "../../../types/models/owner";
import bcrypt from "bcrypt";

const PASSWORD_SALT = Number(process.env.PASSWORD_SALT) || 10;

const ownerSchema = new Schema<IOnwnerSchema>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  avatar: { type: String, default: "/assets/images/onwer-avatar.png" },
  phone: { type: Number, required: true },
  phoneCountryCode: { type: Number, required: true },
  country: { type: String, required: true },
  countryCodeAlphabet: { type: String, required: true },
  password: { type: String, required: true },
  isDeleted: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
});

ownerSchema.pre("save", function (next) {
  let owner = this;

  // only hash the password if it has been modified (or is new)
  if (!owner.isModified("password")) return next();

  // generate a salt
  bcrypt.genSalt(PASSWORD_SALT, function (err, salt) {
    if (err) return next(err);

    // hash the password using our new salt
    bcrypt.hash(owner.password, salt, function (err, hash) {
      if (err) return next(err);
      // override the cleartext password with the hashed one
      owner.password = hash;
      next();
    });
  });
});

ownerSchema.methods.valifatePassword = async function (
  password: string,
): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

const OwnerModel = model<IOnwnerSchema>("Owner", ownerSchema);

export default OwnerModel;
