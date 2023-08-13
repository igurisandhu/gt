import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import responses from "../../utilities/responses";
import { ObjectId } from "mongoose";
import AgentModel from "../../databases/mongo/models/agent";
import OwnerModel from "../../databases/mongo/models/owner";
import OwnerCompanyModel from "../../databases/mongo/models/ownerCompany";

const AgentAuthSecert = process.env.OWNER_AUTH_SECERT || "GOD-IS-ALl";

const agentAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return responses.authFail(req, res, {});
    }

    const decoded = jwt.verify(token, AgentAuthSecert) as { _id: ObjectId };

    const agent = await AgentModel.findById(decoded._id).lean();

    if (!agent || agent.isActive == false || agent.isDeleted == true) {
      return responses.authFail(req, res, {});
    }

    req.agent = agent;

    next();
  } catch (error) {
    return responses.authFail(req, res, {});
  }
};

export { agentAuth };
