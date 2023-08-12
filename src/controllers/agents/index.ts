import jwt from "jsonwebtoken";
import AgentModel from "../../databases/mongo/models/agent";
import {
  IAgentProfileWithAuth,
  IAgentSignupRequest,
  IAgentProfileWithOptionalPassword,
} from "../../types/controllers/agent";
import responses from "../../utilities/responses";
import { Request, Response } from "express";
import IOnwnerSchema from "../../types/models/agent";

const AgentAuthSecert = process.env.OWNER_AUTH_SECERT || "GOD-IS-ALl";

const signup = async (req: Request, res: Response) => {
  try {
    const body: IAgentSignupRequest = req.body;

    const newAgent = new AgentModel({ ...body });

    const newSavedAgent = await newAgent.save();

    const agent: IAgentProfileWithOptionalPassword = newSavedAgent.toObject();
    // await AgentModel.findById(newSavedAgent._id).select(['-password']).lean()
    delete agent.password;

    if (!agent) {
      return responses.serverError(req, res, {});
    }

    const Authorization = await jwt.sign({ _id: agent._id }, AgentAuthSecert);

    const agentProfileWithAuth: IAgentProfileWithAuth = {
      ...agent,
      Authorization,
    };

    return responses.success(req, res, agentProfileWithAuth);
  } catch (error) {
    return responses.serverError(req, res, {});
  }
};

const login = async (req: Request, res: Response) => {
  try {
    let { email, password }: { email: string; password: string } = req.body;

    let agent = await AgentModel.findOne({ email });

    if (!agent) {
      return responses.notFound(req, res, {}, "Agent Account");
    }

    const isPasswordValid: boolean = await agent.valifatePassword(password);

    if (!isPasswordValid) {
      return responses.authFail(req, res, {});
    }

    const Authorization = jwt.sign({ agentId: agent._id }, AgentAuthSecert);

    const agentProfile: IAgentProfileWithOptionalPassword = agent.toObject();

    delete agentProfile.password;

    const agentProfileWithAuth: IAgentProfileWithAuth = {
      ...agentProfile,
      Authorization,
    };

    return responses.success(req, res, agentProfileWithAuth);
  } catch (error) {
    return responses.serverError(req, res, {});
  }
};

const agentController = {
  signup,
  login,
};

export default agentController;
