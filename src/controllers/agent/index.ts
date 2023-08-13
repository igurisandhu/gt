import jwt from "jsonwebtoken";
import AgentModel from "../../databases/mongo/models/agent";
import {
  IAgentProfileWithAuth,
  IAgentProfileWithOptionalPassword,
} from "../../types/controllers/agent";
import responses from "../../utilities/responses";
import { Request, Response } from "express";
import { IOwnerProfile } from "../../types/controllers/owner";
import { IOwnerCompanyProfile } from "../../types/controllers/ownerCompany";

const AgentAuthSecert = process.env.AGENT_AUTH_SECERT || "GOD-IS-ALl";

const addAgent = async (req: Request, res: Response) => {
  try {
    const owner: IOwnerProfile = req.owner;
    const ownerCompany: IOwnerCompanyProfile = req.ownerCompany;

    const genrateRandomCode = () => Math.floor(Math.random() * 90000) + 10000;

    let agentCode: number = genrateRandomCode();

    const checkAgentCode = async (code: number) => {
      const isAgent = await AgentModel.findOne({
        agentCode: `${ownerCompany.name.slice(0, 2)}${ownerCompany.name.slice(
          -2,
        )}${code}`,
      }).lean();
      if (!isAgent) {
        return true;
      } else {
        agentCode = genrateRandomCode();
        checkAgentCode(agentCode);
      }
    };

    checkAgentCode(agentCode);

    const newAgent = new AgentModel({
      owner_id: owner._id,
      company_id: ownerCompany._id,
      agentCode: `${ownerCompany.name.slice(0, 2)}${ownerCompany.name.slice(
        -2,
      )}${agentCode}`,
    });

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
    const { agentCode }: { agentCode: string } = req.body;
    const owner: IOwnerProfile = req.owner;
    const ownerCompany: IOwnerCompanyProfile = req.ownerCompany;

    const agent = await AgentModel.findOne({
      agentCode,
      owner_id: owner._id,
      company_id: ownerCompany._id,
    });

    if (!agent || agent.isDeleted == true) {
      return responses.notFound(req, res, {}, "Agent Account");
    }

    if (agent.isActive == false) {
      return responses.notActive(req, res, {}, "Agent Account");
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
  addAgent,
  login,
};

export default agentController;
