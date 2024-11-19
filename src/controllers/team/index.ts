import { IOwnerProfile } from "../../types/controllers/owner";
import responses from "../../utilities/responses";
import { Request, Response } from "express";
import { ITeam, ITeamProfile } from "../../types/controllers/team";
import TeamModel from "../../databases/mongo/models/team";
import ManagerTeamModel from "../../databases/mongo/models/managerTeam";
import mongoose, { ObjectId } from "mongoose";

import { IManagerProfile } from "../../types/controllers/manager";
import { ICompanyProfile } from "../../types/controllers/company";
import aggregateWithPaginationAndPopulate, {
  IAggregateOptions,
} from "../../databases/mongo/common";

const addTeam = async (req: Request, res: Response) => {
  try {
    const owner: IOwnerProfile = req.owner;
    const company: ICompanyProfile = req.company;

    const teamData = req.body;

    let team: ITeamProfile | null;

    if (teamData._id) {
      team = await TeamModel.findByIdAndUpdate(
        teamData._id,
        { ...teamData, owner_id: owner._id, company_id: company._id },
        { new: true },
      ).lean();
    } else {
      team = (
        await TeamModel.create({
          ...teamData,
          owner_id: owner._id,
          company_id: company._id,
        })
      ).toObject();
    }

    if (!team) {
      return responses.serverError(req, res, {});
    }

    return responses.success(req, res, team);
  } catch (error) {
    return responses.serverError(req, res, {});
  }
};

const getTeam = async (req: Request, res: Response) => {
  try {
    const owner: IOwnerProfile = req.owner;
    const manager: IManagerProfile = req.manager;
    const company: ICompanyProfile = req.company;

    const { team_id }: { team_id?: string } = req.query;

    let data: [] | object = [];
    let total = 0;

    if (team_id) {
      let _id;

      try {
        _id = new mongoose.Types.ObjectId(team_id);
      } catch (error) {
        return responses.requestDataValidatorError(
          req,
          res,
          {},
          req.t("INVALID", { module: "Team Id" }),
        );
      }

      let team: ITeamProfile | null = null;

      if (owner) {
        team = await TeamModel.findOne({
          _id: _id,
          owner_id: owner._id,
          company_id: company._id,
        }).lean();
      }

      if (manager) {
        const managerTeam = await ManagerTeamModel.findOne({
          team_id: _id,
          manager_id: manager._id,
          company_id: company._id,
        });
        if (managerTeam) {
          team = await TeamModel.findById(managerTeam.team_id).lean();
        }
      }

      if (!team) {
        return responses.notFound(req, res, {}, "Team");
      }

      data = team;
      total = 1;
    } else {
      const {
        limit = "10",
        page = "1",
        name,
        manager_id,
        sort,
        isActive,
      }: {
        limit?: string;
        page?: string;
        name?: string;
        manager_id?: string;
        sort?: string;
        isActive?: string;
      } = req.query;

      let searchQuery: {
        name?: {
          $regex: string;
          $options?: string;
        };
        owner_id?: ObjectId;
        manager_id?: mongoose.Types.ObjectId;
        company_id: ObjectId;
        isActive?: boolean;
      } = {
        company_id: company._id,
      };
      if (manager_id) {
        try {
          searchQuery = {
            ...searchQuery,
            manager_id: new mongoose.Types.ObjectId(manager_id),
          };
        } catch (error) {
          return responses.requestDataValidatorError(
            req,
            res,
            {},
            req.t("INVALID", { module: "Manager Id" }),
          );
        }
      }

      if (isActive) {
        searchQuery.isActive = isActive == "true" ? true : false;
      }

      if (name) {
        searchQuery = {
          ...searchQuery,
          name: { $regex: name, $options: "i" },
        };
      }

      const AggregateOptions: IAggregateOptions = {
        page: Number(page),
        perPage: Number(limit),
      };

      if (sort) {
        AggregateOptions.sort = { name: Number(sort) };
      }

      if (owner && !manager_id) {
        searchQuery.owner_id = owner._id;
        const result = await aggregateWithPaginationAndPopulate(
          TeamModel,
          searchQuery,
          AggregateOptions,
        );
        data = result.data;
        total = result.total;
      } else if (manager || (manager_id && !manager)) {
        if (manager)
          searchQuery.manager_id = new mongoose.Types.ObjectId(
            manager._id.toString(),
          );
        AggregateOptions.lookups = [
          {
            from: "teams",
            localField: "team_id",
            foreignField: "_id",
            as: "team",
          },
        ];
        const result = await aggregateWithPaginationAndPopulate(
          ManagerTeamModel,
          searchQuery,
          AggregateOptions,
        );
        data = result.data.map((managerTeam: any) => managerTeam?.team[0]);
        total = result.total;
      }
    }

    return responses.success(req, res, data, total);
  } catch (error) {
    return responses.serverError(req, res, {});
  }
};

const deleteTeam = async (req: Request, res: Response) => {
  try {
    const _id = req.params._id;

    await TeamModel.deleteOne({ _id: _id });
    return responses.success(req, res, {});
  } catch (error) {
    return responses.serverError(req, res, {});
  }
};

const teamController = {
  addTeam,
  getTeam,
  deleteTeam,
};

export default teamController;
