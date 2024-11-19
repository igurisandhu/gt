import jwt from "jsonwebtoken";
import AgentModel from "../../databases/mongo/models/agent";
import {
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
import aggregateWithPaginationAndPopulate, {
  IAggregateOptions,
} from "../../databases/mongo/common";
import { sendMail } from "../../utilities/mail";
import { sendPhoneOTPUtility } from "../../utilities/sms";
import {
  deleteRedisData,
  getRedisData,
  setRedisDataWithExpiry,
} from "../../databases/redis";

const AgentAuthSecret = process.env.AGENT_AUTH_SECRET || "GOD-IS-ALL";

const generateRandomCode = () => Math.floor(Math.random() * 90000) + 10000;

const signup = async (req: Request, res: Response) => {
  try {
    const {
      email,
      phone,
      password,
    }: { email: string; phone: string; password: string } = req.body;
    const owner: IOwnerProfile = req.owner;
    const company: ICompanyProfile = req.company;

    const existingAgent = await AgentModel.findOne({ email: email });

    if (existingAgent) {
      return responses.alreadyExists(req, res, {}, "Agent");
    }

    const newAgent = new AgentModel({
      email,
      phone,
      password,
      owner_id: owner._id,
      company_id: company._id,
      isActive: true,
      isDeleted: false,
    });

    const newSavedAgent = await newAgent.save();
    const agent = newSavedAgent.toObject();
    delete agent.password;

    const Authorization = await jwt.sign({ _id: agent._id }, AgentAuthSecret);

    const agentProfileWithAuth: IAgentProfileWithAuth = {
      ...agent,
      Authorization,
    };

    return responses.success(req, res, agentProfileWithAuth);
  } catch (error) {
    console.error(error);
    return responses.serverError(req, res, {});
  }
};

const addAgent = async (req: Request, res: Response) => {
  try {
    const owner: IOwnerProfile = req.owner;
    const company: ICompanyProfile = req.company;
    const manager: IManagerProfile = req.manager;
    const data = req.body;

    const existingAgent = await AgentModel.findOne({ email: data.email });

    if (existingAgent) {
      return responses.alreadyExists(req, res, {}, "Agent");
    }

    let agentCode = generateRandomCode();

    const checkAgentCode: any = async (code: number) => {
      const isAgent = await AgentModel.findOne({
        agentCode: `${company.name.slice(0, 2)}${company.name.slice(
          -2,
        )}${code}`,
      }).lean();
      if (!isAgent) {
        return true;
      } else {
        agentCode = generateRandomCode();
        return checkAgentCode(agentCode);
      }
    };

    await checkAgentCode(agentCode);

    const newAgent = new AgentModel({
      owner_id: manager ? manager.owner_id : owner._id,
      company_id: company._id,
      agentCode: `${company.name.slice(0, 2)}${company.name.slice(
        -2,
      )}${agentCode}`,
      ...data,
    });

    const newSavedAgent = await newAgent.save();
    const agent = newSavedAgent.toObject();
    delete agent.password;

    const Authorization = await jwt.sign({ _id: agent._id }, AgentAuthSecret);

    const agentProfileWithAuth: IAgentProfileWithAuth = {
      ...agent,
      Authorization,
    };

    return responses.success(req, res, agentProfileWithAuth);
  } catch (error) {
    console.error(error);
    return responses.serverError(req, res, {});
  }
};

const updateAgent = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const _id = req.params._id;

    if (!_id) {
      return responses.NotFoundRequestParam(req, res, {}, "Agent ID");
    }

    const updatedAgent = await AgentModel.findOneAndUpdate(
      { _id },
      { ...data },
    );

    if (!updatedAgent) {
      return responses.notFound(req, res, {}, "Agent");
    }

    const agent = updatedAgent.toObject();
    delete agent.password;

    const Authorization = await jwt.sign({ _id: agent._id }, AgentAuthSecret);

    const agentProfileWithAuth: IAgentProfileWithAuth = {
      ...agent,
      Authorization,
    };

    return responses.success(req, res, agentProfileWithAuth);
  } catch (error) {
    console.error(error);
    return responses.serverError(req, res, {});
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const { email, password }: { email: string; password: string } = req.body;

    const agent = await AgentModel.findOne({ email });

    if (!agent || agent.isDeleted) {
      return responses.notFound(req, res, {}, "Agent Account");
    }

    if (!agent.validatePassword(password)) {
      return responses.authFail(req, res, {});
    }

    if (!agent.isActive) {
      return responses.notActive(req, res, {}, "Agent Account");
    }

    const Authorization = jwt.sign({ agentId: agent._id }, AgentAuthSecret);

    const agentProfile: IAgentProfileWithOptionalPassword = agent.toObject();
    delete agentProfile.password;

    const agentProfileWithAuth: IAgentProfileWithAuth = {
      ...agentProfile,
      Authorization,
    };

    return responses.success(req, res, agentProfileWithAuth);
  } catch (error) {
    console.error(error);
    return responses.serverError(req, res, {});
  }
};

const loginWithPhonePassword = async (req: Request, res: Response) => {
  try {
    const { phone, password }: { phone: string; password: string } = req.body;

    const agent = await AgentModel.findOne({ phone });

    if (!agent || agent.isDeleted) {
      return responses.notFound(req, res, {}, "Agent Account");
    }

    if (!agent.validatePassword(password)) {
      return responses.authFail(req, res, {});
    }

    if (!agent.isActive) {
      return responses.notActive(req, res, {}, "Agent Account");
    }

    const Authorization = jwt.sign({ agentId: agent._id }, AgentAuthSecret);

    const agentProfile: IAgentProfileWithOptionalPassword = agent.toObject();
    delete agentProfile.password;

    const agentProfileWithAuth: IAgentProfileWithAuth = {
      ...agentProfile,
      Authorization,
    };

    return responses.success(req, res, agentProfileWithAuth);
  } catch (error) {
    console.error(error);
    return responses.serverError(req, res, {});
  }
};

const sendPhoneOTP = async (req: Request, res: Response) => {
  try {
    const { phone }: { phone: string } = req.body;

    const agent = await AgentModel.findOne({ phone });

    if (!agent || agent.isDeleted) {
      return responses.notFound(req, res, {}, "Agent Account");
    }

    if (!agent.isActive) {
      return responses.notActive(req, res, {}, "Agent Account");
    }

    const otp = await sendPhoneOTPUtility(phone);

    return responses.success(req, res, { otp });
  } catch (error) {
    console.error(error);
    return responses.serverError(req, res, {});
  }
};

const loginWithPhoneOTP = async (req: Request, res: Response) => {
  try {
    const { phone, otp }: { phone: string; otp: number } = req.body;

    const agent = await AgentModel.findOne({ phone });

    if (!agent || agent.isDeleted) {
      return responses.notFound(req, res, {}, "Agent Account");
    }

    if (!agent.isActive) {
      return responses.notActive(req, res, {}, "Agent Account");
    }

    let attempts = await getRedisData(phone + "_fail");

    if (!attempts) attempts = "0";

    const savedOTP = await getRedisData(phone);

    if (!savedOTP) {
      return responses.authFail(req, res, { message: "OTP expired" });
    }

    if (Number(savedOTP) !== otp) {
      if (Number(attempts) + 1 >= 3) {
        await AgentModel.updateOne({ phone }, { isActive: false });
        await deleteRedisData(phone + "_fail");
        await deleteRedisData(phone);
      } else {
        await setRedisDataWithExpiry(
          phone + "_fail",
          Number(attempts) + 1,
          3600,
        );
      }
      return responses.authFail(req, res, { message: "Invalid OTP" });
    }

    await deleteRedisData(phone + "_fail");
    await deleteRedisData(phone);

    const Authorization = jwt.sign({ agentId: agent._id }, AgentAuthSecret);

    const agentProfile: IAgentProfileWithOptionalPassword = agent.toObject();
    delete agentProfile.password;

    const agentProfileWithAuth: IAgentProfileWithAuth = {
      ...agentProfile,
      Authorization,
    };

    return responses.success(req, res, agentProfileWithAuth);
  } catch (error) {
    console.error(error);
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

    if (!agent || agent.isDeleted) {
      return responses.notFound(req, res, {}, "Agent Account");
    }

    if (!agent.isActive) {
      return responses.notActive(req, res, {}, "Agent Account");
    }

    const Authorization = jwt.sign({ agentId: agent._id }, AgentAuthSecret);

    const agentProfile: IAgentProfileWithOptionalPassword = agent.toObject();
    delete agentProfile.password;

    const agentProfileWithAuth: IAgentProfileWithAuth = {
      ...agentProfile,
      Authorization,
    };

    return responses.success(req, res, agentProfileWithAuth);
  } catch (error) {
    console.error(error);
    return responses.serverError(req, res, {});
  }
};

const getAgent = async (req: Request, res: Response) => {
  try {
    const owner: IOwnerProfile = req.owner;
    const company: ICompanyProfile = req.company;
    const team: ITeamProfile = req.team;
    const { agent_id } = req.query;

    let data: [] | object = [];
    let total = 0;

    if (agent_id) {
      const agent = await AgentModel.findOne({
        _id: agent_id,
        owner_id: owner._id,
        company_id: company._id,
      })
        .select(["-password"])
        .populate("team_id")
        .lean();

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

      const searchQuery: {
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
        searchQuery.isActive = isActive === "true";
      }

      if (name) {
        searchQuery.name = { $regex: name, $options: "i" };
      }

      if (email) {
        searchQuery.email = { $regex: email, $options: "i" };
      }

      if (owner) {
        searchQuery.owner_id = owner._id;
      }

      if (team) {
        searchQuery.team_id = team._id;
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

    return responses.success(req, res, data, total);
  } catch (error) {
    console.error(error);
    return responses.serverError(req, res, {});
  }
};

const updateLocation = async (req: Request, res: Response) => {
  try {
    const { agent_id, lat, long } = req.body;

    await AgentModel.updateOne(
      { _id: agent_id },
      { location: { type: "Point", coordinates: [lat, long] } },
    );

    return responses.success(req, res, {});
  } catch (error) {
    console.error(error);
    return responses.serverError(req, res, {});
  }
};

const deleteAgent = async (req: Request, res: Response) => {
  try {
    const _id = req.params._id;

    await AgentModel.deleteOne({ _id });
    return responses.success(req, res, {});
  } catch (error) {
    console.error(error);
    return responses.serverError(req, res, {});
  }
};

const changePassword = async (req: Request, res: Response) => {
  try {
    const { oldPassword, newPassword } = req.body;
    let agent = req.agent;

    agent = await AgentModel.find(agent._id);

    if (!agent) {
      return responses.notFound(req, res, {}, "Agent not found");
    }

    const isPasswordValid = await agent.validatePassword(oldPassword);

    if (!isPasswordValid) {
      return responses.authFail(req, res, {});
    }

    agent.password = newPassword;
    await agent.save();

    return responses.success(req, res, {});
  } catch (error) {
    console.error("Error changing agent password:", error);
    return responses.serverError(req, res, {});
  }
};

const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const agent = await AgentModel.findOne({ email });

    if (!agent) {
      return responses.notFound(req, res, {}, "Agent not found");
    }

    if (agent.isActive === false) {
      return responses.notActive(req, res, {}, "Agent Account");
    }

    const resetToken = jwt.sign(
      { _id: agent._id, password: agent.password },
      AgentAuthSecret,
      { expiresIn: "1h" },
    );

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    await sendMail(
      email,
      "Password Reset",
      `Click here to reset your password: ${resetLink}`,
    );

    return responses.success(req, res, {});
  } catch (error) {
    console.error("Error forgot password:", error);
    return responses.serverError(req, res, {});
  }
};

const verifyResetToken = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;

    const verify: any = jwt.verify(token, AgentAuthSecret);

    if (!verify) {
      return responses.notFound(req, res, {}, "Invalid token");
    }

    if (verify._id && verify.password) {
      const agent = await AgentModel.findOne({
        _id: verify._id,
        password: verify.password,
      });

      if (!agent) {
        return responses.notFound(req, res, {}, "Invalid token");
      }
    }

    return responses.success(req, res, { isValid: true });
  } catch (error) {
    console.error("Error verifying reset token:", error);
    return responses.serverError(req, res, {});
  }
};

const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;

    const decoded: any = jwt.verify(token, AgentAuthSecret);

    const agent = await AgentModel.findOne({
      _id: decoded._id,
      password: decoded.password,
    });

    if (!agent) {
      return responses.notFound(req, res, {}, "Invalid token");
    }

    agent.password = newPassword;
    await agent.save();

    return responses.success(req, res, {});
  } catch (error) {
    console.error("Error resetting password:", error);
    return responses.serverError(req, res, {});
  }
};

const agentController = {
  signup,
  addAgent,
  updateAgent,
  login,
  getAgent,
  updateLocation,
  deleteAgent,
  changePassword,
  forgotPassword,
  verifyResetToken,
  resetPassword,
  loginWithQR,
  loginWithPhonePassword,
  sendPhoneOTP,
  loginWithPhoneOTP,
};

export default agentController;
