import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import LocationSchema from "./location";
import IAgentSchema from "../../../types/models/agent";

const PASSWORD_SALT = Number(process.env.PASSWORD_SALT) || 10;

const agentSchema = new Schema<IAgentSchema>({
  owner_id: { type: Schema.Types.ObjectId, required: true, ref: "Owner" },
  company_id: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "OwnerCompany",
  },
  name: { type: String },
  email: { type: String },
  avatar: { type: String, default: "/assets/images/agent-avatar.png" },
  phone: { type: Number },
  phoneCountryCode: { type: Number },
  country: { type: String },
  countryCodeAlphabet: { type: String },
  location: LocationSchema,
  password: { type: String },
  agentCode: { type: String, required: true },
  isDeleted: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
});

agentSchema.pre("save", function (next) {
  let agent = this;

  // only hash the password if it has been modified (or is new)
  if (!agent.password) return next();
  if (!agent.isModified("password")) return next();

  // generate a salt
  bcrypt.genSalt(PASSWORD_SALT, function (err, salt) {
    if (err) return next(err);

    // hash the password using our new salt
    bcrypt.hash(agent.password || "", salt, function (err, hash) {
      if (err) return next(err);
      // override the cleartext password with the hashed one
      agent.password = hash;
      next();
    });
  });
});

agentSchema.methods.valifatePassword = async function (
  password: string,
): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

const AgentModel = model<IAgentSchema>("Agent", agentSchema);

export default AgentModel;
