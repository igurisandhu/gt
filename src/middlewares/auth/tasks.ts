import { Request, Response, NextFunction } from "express";
import responses from "../../utilities/responses";
import TeamModel from "../../databases/mongo/models/team";
import ManagerModel from "../../databases/mongo/models/manager";
import { ITeamProfile } from "../../types/controllers/team";
import IManagerSchema from "../../types/models/manager";
import { IOwnerProfile } from "../../types/controllers/owner";
import { IManagerProfile } from "../../types/controllers/manager";
import ManagerTeamModel from "../../databases/mongo/models/managerTeam";
import { ICompanyProfile } from "../../types/controllers/company";

const teamAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let team_id = req.query.team_id || req.body.team_id;
    const owner: IOwnerProfile = req.owner;
    const manager: IManagerProfile = req.manager;
    const company: ICompanyProfile = req.company;

    if (!team_id) {
      if (manager) {
        return responses.NotFoundRequestParam(req, res, {}, "team");
      }
      return next();
    }

    let team: ITeamProfile | null = null;

    if (owner) {
      team = await TeamModel.findOne({
        _id: team_id,
        owner_id: owner._id,
        company_id: company._id,
      }).lean();
    } else if (manager) {
      const managerTeam = await ManagerTeamModel.findOne({ team_id }).lean();
      if (managerTeam) {
        team = await TeamModel.findOne({
          _id: team_id,
          owner_id: manager.owner_id,
          company_id: company._id,
        }).lean();
      }
    }

    if (!team || team.isDeleted) {
      return responses.notFound(req, res, {}, "Team");
    }

    if (!team.isActive) {
      return responses.notActive(req, res, {}, "Team");
    }

    req.team = team;

    next();
  } catch (error) {
    return responses.authFail(req, res, {});
  }
};

export { teamAuth };
