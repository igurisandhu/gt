import jwt from "jsonwebtoken";
import ManagerModel from "../../databases/mongo/models/manager";
import {
  IManagerProfileWithAuth,
  IManagerSignupRequest,
  IManagerProfileWithOptionalPassword,
} from "../../types/controllers/manager";
import responses from "../../utilities/responses";
import { Request, Response } from "express";
import { ICompanyProfile } from "../../types/controllers/company";
import { IOwnerProfile } from "../../types/controllers/owner";
import ManagerTeamModel from "../../databases/mongo/models/managerTeam";

const ManagerAuthSecert = process.env.OWNER_AUTH_SECERT || "GOD-IS-ALl";

const addManager = async (req: Request, res: Response) => {
  try {
    let body: IManagerSignupRequest = req.body;
    const company: ICompanyProfile = req.company;
    const owner: IOwnerProfile = req.owner;

    body.email = body.email.toLowerCase();
    body.owner_id = owner._id;
    body.company_id = company._id;

    //check if manager already registered
    const check = await ManagerModel.findOne({ email: body.email });

    if (check) {
      return responses.alreadyExists(req, res, {}, "Manager account");
    }

    const newManager = new ManagerModel({ ...body });

    const newSavedManager = await newManager.save();

    const manager: IManagerProfileWithOptionalPassword =
      newSavedManager.toObject();
    // await ManagerModel.findById(newSavedManager._id).select(['-password']).lean()
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
      Authorization,
      isManager: true,
    };

    return responses.success(req, res, managerProfileWithAuth);
  } catch (error) {
    return responses.serverError(req, res, {});
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const { email, password }: { email: string; password: string } = req.body;

    const manager = await ManagerModel.findOne({ email: email });

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
    const { team_id, manager_id }: { team_id: string; manager_id: string } =
      req.body;
    const owner: IOwnerProfile = req.owner;

    const manager = await ManagerModel.findOne({
      _id: manager_id,
      owner_id: owner._id,
    });

    if (!manager || manager.isDeleted == true) {
      return responses.notFound(req, res, {}, "Manager Account");
    }

    if (manager.isActive == false) {
      return responses.notActive(req, res, {}, "Manager Account");
    }

    const managerTeam = await ManagerTeamModel.create({
      manager_id: manager._id,
      team_id,
    });

    return responses.success(req, res, managerTeam.toObject());
  } catch (error) {
    console.log(error);
    return responses.serverError(req, res, {});
  }
};

const managerController = {
  addManager,
  login,
  assignTeam,
};

export default managerController;
