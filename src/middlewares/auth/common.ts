import { Request, Response, NextFunction } from "express";
import responses from "../../utilities/responses";
import OwnerModel from "../../databases/mongo/models/owner";
import CompanyModel from "../../databases/mongo/models/company";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongoose";
import ManagerModel from "../../databases/mongo/models/manager";

const OwnerAuthSecert = process.env.OWNER_AUTH_SECERT || "GOD-IS-ALl";

const checkOwnerAndCompanyStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { company_id, owner_id }: { owner_id: string; company_id: string } =
      req.body;

    const owner = await OwnerModel.findById(owner_id)
      .select(["-password"])
      .lean();

    if (!owner || owner.isActive == false || owner.isDeleted == true) {
      return responses.authFail(req, res, {});
    }

    const company = await CompanyModel.findById(company_id);

    if (
      !company ||
      company.isActive == false ||
      company.isDeleted == true ||
      company.owner_id !== owner._id
    ) {
      return responses.authFail(req, res, {});
    }

    req.owner = owner;
    req.company = company;

    next();
  } catch (error) {
    return responses.authFail(req, res, {});
  }
};

const OwnerAndManagerAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return responses.authFail(req, res, {});
    }

    const decoded = jwt.verify(token, OwnerAuthSecert) as { _id: ObjectId };

    const owner = await OwnerModel.findById(decoded._id)
      .select(["-password"])
      .lean();

    let manager;

    if (owner) {
      if (owner.isActive == false || owner.isDeleted == true) {
        return responses.authFail(req, res, {});
      }

      req.owner = owner;
    } else {
      manager = await ManagerModel.findById(decoded._id)
        .select(["-password"])
        .populate("owner_id")
        .lean();

      if (!manager || manager.isActive == false || manager.isDeleted == true) {
        return responses.authFail(req, res, {});
      }

      req.manager = manager;
      req.owner = manager.owner_id;
    }

    next();
  } catch (error) {
    return responses.authFail(req, res, {});
  }
};

export { checkOwnerAndCompanyStatus, OwnerAndManagerAuth };
