import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import ManagerModel from "../../databases/mongo/models/manager";
import responses from "../../utilities/responses";
import { ObjectId } from "mongoose";

const ManagerAuthSecert = process.env.OWNER_AUTH_SECERT || "GOD-IS-ALl";

const managerAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return responses.authFail(req, res, {});
    }

    const decoded = jwt.verify(token, ManagerAuthSecert) as { _id: ObjectId };

    const manager = await ManagerModel.findById(decoded._id)
      .select(["-password"])
      .lean();

    if (!manager || manager.isActive == false || manager.isDeleted == true) {
      return responses.authFail(req, res, {});
    }

    req.manager = manager;

    next();
  } catch (error) {
    return responses.authFail(req, res, {});
  }
};

export { managerAuth };
