import jwt from "jsonwebtoken";
import OwnerModel from "../../databases/mongo/models/owner";
import {
  IOwnerProfileWithAuth,
  IOwnerSignupRequest,
  IOwnerProfileWithOptionalPassword,
} from "../../types/controllers/owner";
import responses from "../../utilities/responses";
import { Request, Response } from "express";
import IOnwnerSchema from "../../types/models/owner";

const OwnerAuthSecert = process.env.OWNER_AUTH_SECERT || "GOD-IS-ALl";

const signup = async (req: Request, res: Response) => {
  try {
    const body: IOwnerSignupRequest = req.body;

    const newOwner = new OwnerModel({ ...body });

    const newSavedOwner = await newOwner.save();

    const owner: IOwnerProfileWithOptionalPassword = newSavedOwner.toObject();
    // await OwnerModel.findById(newSavedOwner._id).select(['-password']).lean()
    delete owner.password;

    if (!owner) {
      return responses.serverError(req, res, {});
    }

    const Authorization = await jwt.sign({ _id: owner._id }, OwnerAuthSecert);

    const ownerProfileWithAuth: IOwnerProfileWithAuth = {
      ...owner,
      Authorization,
    };

    return responses.success(req, res, ownerProfileWithAuth);
  } catch (error) {
    return responses.serverError(req, res, {});
  }
};

const login = async (req: Request, res: Response) => {
  try {
    let { email, password }: { email: string; password: string } = req.body;

    let owner = await OwnerModel.findOne({ email });

    if (!owner) {
      return responses.notFound(req, res, {}, "Owner Account");
    }

    const isPasswordValid: boolean = await owner.valifatePassword(password);

    if (!isPasswordValid) {
      return responses.authFail(req, res, {});
    }

    const Authorization = jwt.sign({ ownerId: owner._id }, OwnerAuthSecert);

    const ownerProfile: IOwnerProfileWithOptionalPassword = owner.toObject();

    delete ownerProfile.password;

    const ownerProfileWithAuth: IOwnerProfileWithAuth = {
      ...ownerProfile,
      Authorization,
    };

    return responses.success(req, res, ownerProfileWithAuth);
  } catch (error) {
    return responses.serverError(req, res, {});
  }
};

const ownerController = {
  signup,
  login,
};

export default ownerController;
