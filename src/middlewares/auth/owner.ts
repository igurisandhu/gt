import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import OwnerModel from "../../databases/mongo/models/owner";
import responses from "../../utilities/responses";
import { ObjectId } from "mongoose";

const OwnerAuthSecert = process.env.OWNER_AUTH_SECERT || "GOD-IS-ALl";

const ownerAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return responses.authFail(req, res, {});
    }

    const decoded = jwt.verify(token, OwnerAuthSecert) as { _id: ObjectId };

    const owner = await OwnerModel.findById(decoded._id)
      .select(["password"])
      .lean();

    if (!owner || owner.isActive == false || owner.isDeleted == true) {
      return responses.authFail(req, res, {});
    }

    req.owner = owner;

    next();
  } catch (error) {
    return responses.authFail(req, res, {});
  }
};

export { ownerAuth };
