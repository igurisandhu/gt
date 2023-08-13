import { Request, Response, NextFunction } from "express";
import responses from "../../utilities/responses";
import OwnerCompanyModel from "../../databases/mongo/models/ownerCompany";

const ownerCompanyAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { company_id } = req.body;

    if (!company_id) {
      return responses.authFail(req, res, {});
    }

    const ownerCompany = await OwnerCompanyModel.findById(company_id).lean();

    if (!ownerCompany || ownerCompany.isDeleted) {
      return responses.notFound(req, res, {}, "Company");
    }

    if (!ownerCompany.isActive) {
      return responses.notActive(req, res, {}, "Company");
    }

    req.ownerCompany = ownerCompany;

    next();
  } catch (error) {
    return responses.authFail(req, res, {});
  }
};

export { ownerCompanyAuth };
