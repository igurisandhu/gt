import mongoose, { Model, Schema, model, Document } from "mongoose";
import IManagerSchema from "../../../types/models/manager";
import bcrypt from "bcrypt";
import CompanyModel from "./company";
import { IManager } from "../../../types/controllers/manager";
import OwnerModel from "./owner";

interface IModleManager extends Document, IManagerSchema {}

const PASSWORD_SALT = Number(process.env.PASSWORD_SALT) || 10;

const managerSchema = new Schema<IModleManager>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  avatar: { type: String, default: "/assets/images/manager-avatar.png" },
  phone: { type: String, required: true },
  country: { type: String, required: false },
  countryCode: { type: String, required: false },
  password: { type: String, required: true },
  isDeleted: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  company_id: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: CompanyModel,
  },
  owner_id: { type: mongoose.Types.ObjectId, required: true, ref: OwnerModel },
  permissions: {
    type: Object,
    required: true,
    default: {
      job: {
        read: true,
        write: false,
        delete: false,
      },
      agent: {
        read: true,
        write: false,
        delete: false,
      },
      manager: {
        read: true,
        write: false,
        delete: false,
      },
    },
  },
});

managerSchema.pre("save", function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const manager = this;

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

managerSchema.pre("findOneAndUpdate", function (next) {
  const manager = this.getUpdate() as IManager;

  if (!manager) return next();
  if (!manager.password) return next();

  if (manager && manager.password) {
    // generate a salt
    bcrypt.genSalt(PASSWORD_SALT, function (err, salt) {
      if (err) return next(err);

      // hash the password using our new salt
      bcrypt.hash(manager.password || "", salt, function (err, hash) {
        if (err) return next(err);
        // override the cleartext password with the hashed one
        manager.password = hash;
        next();
      });
    });
  }
});

managerSchema.methods.valifatePassword = async function (
  password: string,
): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

const ManagerModel: Model<IModleManager> = model<IModleManager>(
  "Manager",
  managerSchema,
);

export default ManagerModel;
