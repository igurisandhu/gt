import jwt from "jsonwebtoken";
import ManagerModel from "../../databases/mongo/models/manager";
import {
  IManagerProfileWithAuth,
  IManagerSignupRequest,
  IManagerProfileWithOptionalPassword,
  IManagerProfile,
  IManagerTeam,
  IManagerTeamWithTeam,
} from "../../types/controllers/manager";
import responses from "../../utilities/responses";
import { Request, Response } from "express";
import { ICompanyProfile } from "../../types/controllers/company";
import { IOwnerProfile } from "../../types/controllers/owner";
import ManagerTeamModel from "../../databases/mongo/models/managerTeam";
import mongoose, { ObjectId, isValidObjectId } from "mongoose";
import TeamModel from "../../databases/mongo/models/team";
import { ITeamProfile } from "../../types/controllers/team";
import aggregateWithPaginationAndPopulate, {
  IAggregateOptions,
} from "../../databases/mongo/coommon";

const ManagerAuthSecert = process.env.OWNER_AUTH_SECERT || "GOD-IS-ALl";

const addManager = async (req: Request, res: Response) => {
  try {
    let body: IManagerSignupRequest = req.body;
    const company: ICompanyProfile = req.company;
    const owner: IOwnerProfile = req.owner;

    body.email = body.email.toLowerCase();
    body.owner_id = owner._id;
    body.company_id = company._id;

    const data = req.body;
    let manager: IManagerProfileWithOptionalPassword;
    //check if manager already registered
    if (!data._id) {
      const check = await ManagerModel.findOne({ email: body.email });

      if (check) {
        return responses.alreadyExists(req, res, {}, "Manager account");
      }

      const newManager = new ManagerModel({ ...body });

      const newSavedManager = await newManager.save();

      manager = newSavedManager.toObject();
    } else {
      let updatedManager: IManagerProfileWithOptionalPassword | null =
        await ManagerModel.findOneAndUpdate(
          { _id: data._id },
          { ...data },
        ).populate("company_id");
      if (!updatedManager) {
        return responses.notFound(req, res, {}, "Manager");
      }
      manager = updatedManager;
    }
    delete manager.password;

    if (!manager) {
      return responses.serverError(req, res, {});
    }

    const Authorization = await jwt.sign(
      { _id: manager._id },
      ManagerAuthSecert,
    );

    const managerProfileWithAuth: IManagerProfileWithAuth = {
      ...manager,
      isManager: true,
      Authorization,
    };

    return responses.success(req, res, managerProfileWithAuth);
  } catch (error) {
    return responses.serverError(req, res, {});
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const { email, password }: { email: string; password: string } = req.body;

    const manager = await ManagerModel.findOne({ email: email }).populate(
      "company_id",
    );

    if (!manager || manager.isDeleted == true) {
      return responses.notFound(req, res, {}, "Manager Account");
    }

    if (manager.isActive == false) {
      return responses.notActive(req, res, {}, "Manager Account");
    }

    const isPasswordValid: boolean = await manager.valifatePassword(password);

    if (!isPasswordValid) {
      return responses.authFail(req, res, {});
    }

    const Authorization = jwt.sign({ _id: manager._id }, ManagerAuthSecert);

    const managerProfile: IManagerProfileWithOptionalPassword =
      manager.toObject();

    delete managerProfile.password;

    const managerProfileWithAuth: IManagerProfileWithAuth = {
      ...managerProfile,
      isManager: true,
      Authorization,
    };

    return responses.success(req, res, managerProfileWithAuth);
  } catch (error) {
    console.log(error);
    return responses.serverError(req, res, {});
  }
};

const assignTeam = async (req: Request, res: Response) => {
  try {
    const { teams = [], manager_id }: { teams: string[]; manager_id: string } =
      req.body;
    const owner: IOwnerProfile = req.owner;
    const company: ICompanyProfile = req.company;

    const manager = await ManagerModel.findOne({
      _id: manager_id,
      owner_id: owner._id,
      company_id: company._id,
    }).lean();

    if (!manager || manager.isDeleted == true) {
      return responses.notFound(req, res, {}, "Manager Account");
    }

    if (manager.isActive == false) {
      return responses.notActive(req, res, {}, "Manager Account");
    }

    if (teams.length > 0) {
      await ManagerTeamModel.deleteMany({
        manager_id: manager._id,
        company_id: company._id,
      });

      teams.forEach(async (team_id) => {
        await ManagerTeamModel.create({
          manager_id: manager._id,
          company_id: company._id,
          team_id,
        });
      });
    }
    return responses.success(req, res, {});
  } catch (error) {
    console.log(error);
    return responses.serverError(req, res, {});
  }
};

const getManager = async (req: Request, res: Response) => {
  try {
    const owner: IOwnerProfile = req.owner;
    const company: ICompanyProfile = req.company;

    const { manager_id } = req.query;

    let data: [] | {} = [];
    let total: number = 0;

    if (manager_id) {
      let manager: IManagerProfile | null = null;

      manager = await ManagerModel.findOne({
        _id: manager_id,
        owner_id: owner._id,
        company_id: company._id,
      })
        .select(["-password"])
        .lean();

      if (!manager) {
        return responses.notFound(req, res, {}, "Manager");
      }

      data = manager;
      total = 1;
    } else {
      const {
        limit = "10",
        page = "1",
        name,
        sort,
        isActive,
        email,
      }: {
        limit?: string;
        page?: string;
        name?: string;
        sort?: string;
        email?: string;
        isActive?: string;
      } = req.query;

      let searchQuery: {
        name?: {
          $regex: string;
          $options?: string;
        };
        email?: {
          $regex: string;
          $options?: string;
        };
        owner_id?: ObjectId;
        company_id: ObjectId;
        isActive?: boolean;
      } = {
        company_id: company._id,
        owner_id: owner._id,
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

      let AggregateOptions: IAggregateOptions = {
        page: Number(page),
        perPage: Number(limit),
      };

      if (sort) {
        AggregateOptions.sort = { name: Number(sort) };
      }

      const result = await aggregateWithPaginationAndPopulate(
        ManagerModel,
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

const managerController = {
  addManager,
  login,
  assignTeam,
  getManager,
};

export default managerController;
