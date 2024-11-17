import { Schema, model, Document, Model } from "mongoose";
import bcrypt from "bcrypt";
import IAgentSchema from "../../../types/models/agent";
import { IAgent } from "../../../types/controllers/agent";

const PASSWORD_SALT = Number(process.env.PASSWORD_SALT) || 10;

interface IModelAgent extends Document, IAgentSchema {}

const agentSchema = new Schema<IModelAgent>({
  owner_id: { type: Schema.Types.ObjectId, required: true, ref: "Owner" },
  company_id: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Company",
  },
  team_id: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Team",
  },
  name: { type: String },
  email: { type: String },
  avatar: { type: String, default: "/assets/images/agent-avatar.png" },
  phone: { type: Number },
  phoneCountryCode: { type: Number },
  country: { type: String },
  countryCodeAlphabet: { type: String },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
      default: [0, 0],
    },
  },
  password: { type: String },
  agentCode: { type: String, required: true },
  isDeleted: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
});

agentSchema.pre("save", function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const agent = this;

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

agentSchema.pre("findOneAndUpdate", function (next) {
  const agent = this.getUpdate() as IAgent;

  if (!agent) return next();
  if (!agent.password) return next();

  if (agent && agent.password) {
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
  }
});

agentSchema.methods.validatePassword = async function (
  password: string,
): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

const AgentModel: Model<IModelAgent> = model<IModelAgent>("Agent", agentSchema);

export default AgentModel;
