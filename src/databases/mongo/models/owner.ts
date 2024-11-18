import { Schema, model } from "mongoose";
import IOwnerSchema from "../../../types/models/owner";
import bcrypt from "bcrypt";

const PASSWORD_SALT = Number(process.env.PASSWORD_SALT) || 10;

const ownerSchema = new Schema<IOwnerSchema>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  avatar: { type: String, default: "/assets/images/owner-avatar.png" },
  phone: { type: String, required: true },
  country: { type: String, required: false },
  countryCode: { type: String, required: false },
  password: { type: String, required: true },
  isDeleted: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
});

ownerSchema.pre("save", function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const owner = this;

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

ownerSchema.methods.validatePassword = async function (
  password: string,
): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

const OwnerModel = model<IOwnerSchema>("Owner", ownerSchema);

export default OwnerModel;
