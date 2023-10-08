import { IOwnerProfile } from "../../types/controllers/owner";
import responses from "../../utilities/responses";
import { Request, Response } from "express";
import { ITeamProfile } from "../../types/controllers/team";
import TeamModel from "../../databases/mongo/models/team";
import ManagerTeamModel from "../../databases/mongo/models/managerTeam";
import mongoose, { ObjectId } from "mongoose";

import { IManagerProfile } from "../../types/controllers/manager";
import { ICompanyProfile } from "../../types/controllers/company";

const addTeam = async (req: Request, res: Response) => {
  try {
    const owner: IOwnerProfile = req.owner;

    const teamData = req.body;

    const team: ITeamProfile = (
      await TeamModel.create({ ...teamData })
    ).toObject();

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

    const { team_id } = req.query;

    let data: [] | {} = [];

    if (team_id) {
      let _id;

      try {
        _id = new mongoose.Types.ObjectId(String(team_id));
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
          _id: team_id,
          owner_id: owner._id,
          company_id: company._id,
        }).lean();
      }

      if (manager) {
        const managerTeam = await ManagerTeamModel.findOne({
          team_id: team_id,
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

      let teams: ITeamProfile[] | [];

      let searchQuery: {
        name?: {
          $search: string;
        };
        owner_id?: ObjectId;
        manager_id?: ObjectId;
        compnay_id: ObjectId;
      } = {
        compnay_id: company._id,
      };

      if (name) {
        searchQuery = {
          ...searchQuery,
          name: { $search: name },
        };
      }

      if (owner) {
        searchQuery.owner_id = owner._id;
        teams = await TeamModel.find(searchQuery)
          .limit(limit)
          .skip((page - 1) * 10)
          .lean();
      }

      if (manager) {
        searchQuery.manager_id = manager._id;
        const managerTeams = await ManagerTeamModel.find(searchQuery)
          .limit(limit)
          .skip((page - 1) * 10)
          .populate("team_id")
          .lean();
        teams = managerTeams.map(
          (managerTeam) => managerTeam.team_id as ITeamProfile,
        );
      }

      data = teams;
    }

    return responses.success(req, res, data);
  } catch (error) {
    return responses.serverError(req, res, {});
  }
};

const teamController = {
  addTeam,
  getTeam,
};

export default teamController;
