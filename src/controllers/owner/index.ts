import jwt from "jsonwebtoken";
import OwnerModel from "../../databases/mongo/models/owner";
import {
  IOwnerProfileWithAuth,
  IOwnerSignupRequest,
  IOwnerProfileWithOptionalPassword,
} from "../../types/controllers/owner";
import responses from "../../utilities/responses";
import { Request, Response } from "express";

const OwnerAuthSecert = process.env.OWNER_AUTH_SECERT || "GOD-IS-ALl";

const signup = async (req: Request, res: Response) => {
  try {
    let body: IOwnerSignupRequest = req.body;

    body.email = body.email.toLowerCase();

    //check if owner already registered
    const check = await OwnerModel.findOne({ email: body.email });

    if (check) {
      return responses.alreadyExists(req, res, {}, "Owner account");
    }

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
    const { email, password }: { email: string; password: string } = req.body;

    const owner = await OwnerModel.findOne({ email: email });

    if (!owner || owner.isDeleted == true) {
      return responses.notFound(req, res, {}, "Owner Account");
    }

    if (owner.isActive == false) {
      return responses.notActive(req, res, {}, "Owner Account");
    }

    const isPasswordValid: boolean = await owner.valifatePassword(password);

    if (!isPasswordValid) {
      return responses.authFail(req, res, {});
    }

    const Authorization = jwt.sign({ _id: owner._id }, OwnerAuthSecert);

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
