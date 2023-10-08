import jwt from "jsonwebtoken";
import AgentModel from "../../databases/mongo/models/agent";
import {
  IAgentProfile,
  IAgentProfileWithAuth,
  IAgentProfileWithOptionalPassword,
} from "../../types/controllers/agent";
import responses from "../../utilities/responses";
import { Request, Response } from "express";
import { IOwnerProfile } from "../../types/controllers/owner";
import { IManagerProfile } from "../../types/controllers/manager";
import { ICompanyProfile } from "../../types/controllers/company";
import { ITeamProfile } from "../../types/controllers/team";
import { ObjectId } from "mongoose";

const AgentAuthSecert = process.env.AGENT_AUTH_SECERT || "GOD-IS-ALl";

const addAgent = async (req: Request, res: Response) => {
  try {
    const owner: IOwnerProfile = req.owner;
    const company: ICompanyProfile = req.company;
    const manager: IManagerProfile = req.manager;

    const genrateRandomCode = () => Math.floor(Math.random() * 90000) + 10000;

    let agentCode: number = genrateRandomCode();

    const checkAgentCode = async (code: number) => {
      const isAgent = await AgentModel.findOne({
        agentCode: `${company.name.slice(0, 2)}${company.name.slice(
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
      owner_id: manager ? manager.owner_id : owner._id,
      company_id: company._id,
      agentCode: `${company.name.slice(0, 2)}${company.name.slice(
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
    const company: ICompanyProfile = req.company;

    const agent = await AgentModel.findOne({
      agentCode,
      owner_id: owner._id,
      company_id: company._id,
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

const getAgent = async (req: Request, res: Response) => {
  try {
    const owner: IOwnerProfile = req.owner;
    const manager: IManagerProfile = req.manager;
    let company: ICompanyProfile = req.company;
    const team: ITeamProfile = req.team;

    const agent_id = req.query;

    let data: [] | {} = [];
    if (agent_id) {
      let agent: IAgentProfile | null = null;

      if (owner) {
        agent = await AgentModel.findOne({
          _id: agent_id,
          owner_id: owner._id,
          company_id: company._id,
        })
          .select(["-password"])
          .lean();
      }

      if (manager) {
        agent = await AgentModel.findOne({
          _id: agent_id,
          owner_id: manager.owner_id,
          company_id: company._id,
        });
      }

      if (!agent) {
        return responses.notFound(req, res, {}, "Agent");
      }

      data = agent;
    } else {
      const {
        limit = 10,
        page = 1,
        name,
      }: {
        limit: number;
        page: number;
        name: string;
      } = req.body;

      let searchQuery: {
        owner_id?: ObjectId;
        name?: {
          $search: string;
        };
        team_id?: ObjectId;
        company_id: ObjectId;
      } = {
        owner_id: owner._id,
        company_id: company._id,
      };

      if (name) {
        searchQuery = {
          ...searchQuery,
          name: { $search: name },
        };
      }

      if (owner) {
        searchQuery.owner_id = owner._id;
      }

      if (team) {
        searchQuery.team_id = team._id;
      }

      if (manager) {
        searchQuery.owner_id = manager.owner_id;
      }

      const agents: [IAgentProfile] | [] = await AgentModel.find(searchQuery)
        .select(["-password"])
        .limit(limit)
        .skip((page - 1) * 10)
        .lean();
      data = agents;
    }

    return responses.success(req, res, data);
  } catch (error) {
    return responses.serverError(req, res, {});
  }
};

const agentController = {
  addAgent,
  login,
  getAgent,
};

export default agentController;
