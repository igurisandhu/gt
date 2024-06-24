import jwt from "jsonwebtoken";
import AgentModel from "../../databases/mongo/models/agent";
import {
  IAgentProfile,
  IAgentProfileWithAuth,
  IAgentProfileWithOptionalPassword,
  IAgentProfileWithTeamData,
} from "../../types/controllers/agent";
import responses from "../../utilities/responses";
import { Request, Response } from "express";
import { IOwnerProfile } from "../../types/controllers/owner";
import { IManagerProfile } from "../../types/controllers/manager";
import { ICompanyProfile } from "../../types/controllers/company";
import { ITeamProfile } from "../../types/controllers/team";
import { ObjectId } from "mongoose";
import aggregateWithPaginationAndPopulate, {
  IAggregateOptions,
} from "../../databases/mongo/coommon";

const AgentAuthSecert = process.env.AGENT_AUTH_SECERT || "GOD-IS-ALl";

const addAgent = async (req: Request, res: Response) => {
  try {
    const owner: IOwnerProfile = req.owner;
    const company: ICompanyProfile = req.company;
    const manager: IManagerProfile = req.manager;

    const data = req.body;

    let agent: IAgentProfileWithOptionalPassword;

    if (data.password) {
    }

    if (!data._id) {
      const check = await AgentModel.findOne({ email: data.email });

      if (check) {
        return responses.alreadyExists(req, res, {}, "Agent");
      }

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
        ...data,
      });

      const newSavedAgent = await newAgent.save();

      agent = newSavedAgent.toObject();
    } else {
      const updatedAgent = await AgentModel.findOneAndUpdate(
        { _id: data._id },
        { ...data },
      );
      if (!updatedAgent) {
        return responses.notFound(req, res, {}, "Agent");
      }
      agent = updatedAgent;
    }
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
    console.log(error);
    return responses.serverError(req, res, {});
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const {
      email,
      password,
      owner_id,
      company_id,
    }: {
      email: string;
      password: string;
      owner_id: string;
      company_id: string;
    } = req.body;

    const agent = await AgentModel.findOne({
      email,
      // owner_id: owner_id,
      // company_id: company_id,
    });

    if (!agent || agent.isDeleted == true) {
      return responses.notFound(req, res, {}, "Agent Account");
    }

    if (!agent?.valifatePassword(password)) {
      return responses.authFail(req, res, {});
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
    console.log(error);
    return responses.serverError(req, res, {});
  }
};

const loginWithQR = async (req: Request, res: Response) => {
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
    const company: ICompanyProfile = req.company;
    const team: ITeamProfile = req.team;

    const { agent_id } = req.query;

    let data: [] | {} = [];
    let total = 0;
    if (agent_id) {
      let agent: IAgentProfileWithTeamData | null = null;

      if (owner) {
        agent = await AgentModel.findOne({
          _id: agent_id,
          owner_id: owner._id,
          company_id: company._id,
        })
          .select(["-password"])
          .populate("team_id")
          .lean();
      }

      if (manager) {
        agent = await AgentModel.findOne({
          _id: agent_id,
          owner_id: manager.owner_id,
          company_id: company._id,
        })
          .select(["-password"])
          .populate("team_id")
          .lean();
      }

      if (!agent) {
        return responses.notFound(req, res, {}, "Agent");
      }

      data = agent;
      total = 1;
    } else {
      const {
        limit = "10",
        page = "1",
        name,
        sort,
        email,
        isActive,
      }: {
        limit?: string;
        page?: string;
        name?: string;
        sort?: string;
        email?: string;
        isActive?: string;
      } = req.query;

      let searchQuery: {
        owner_id?: ObjectId;
        team_id?: ObjectId;
        company_id: ObjectId;
        isActive?: boolean;
        name?: {
          $regex: string;
          $options?: string;
        };
        email?: {
          $regex: string;
          $options?: string;
        };
      } = {
        company_id: company._id,
      };

      if (isActive) {
        searchQuery.isActive = isActive == "true" ? true : false;
      }

      if (name) {
        searchQuery = {
          ...searchQuery,
          name: { $regex: name, $options: "i" },
        };
      }

      if (email) {
        searchQuery = {
          ...searchQuery,
          email: { $regex: email, $options: "i" },
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

      const AggregateOptions: IAggregateOptions = {
        page: Number(page),
        perPage: Number(limit),
      };

      if (sort) {
        AggregateOptions.sort = { name: Number(sort) };
      }

      AggregateOptions.lookups = [
        {
          from: "teams",
          localField: "team_id",
          foreignField: "_id",
          as: "team",
        },
      ];

      AggregateOptions.unwind = ["team"];

      const result = await aggregateWithPaginationAndPopulate(
        AgentModel,
        searchQuery,
        AggregateOptions,
      );
      data = result.data;
      total = result.total;
    }

    return responses.success(req, res, data);
  } catch (error) {
    console.log(error);
    return responses.serverError(req, res, {});
  }
};

const updateLocation = async (req: Request, res: Response) => {
  try {
    const { agent_id, lat, long } = req.body;

    console.log(updateLocation);

    const agent = await AgentModel.updateOne(
      { _id: agent_id },
      { location: { type: "Point", coordinates: [lat, long] } },
    );

    console.log(agent);

    return responses.success(req, res, {});
  } catch (error) {
    console.log(error);
    return responses.serverError(req, res, {});
  }
};

const deleteAgent = async (req: Request, res: Response) => {
  try {
    const _id = req.params._id;

    await AgentModel.deleteOne({ _id: _id });
    return responses.success(req, res, {});
  } catch (error) {
    return responses.serverError(req, res, {});
  }
};

const agentController = {
  addAgent,
  login,
  getAgent,
  updateLocation,
  deleteAgent,
};

export default agentController;
