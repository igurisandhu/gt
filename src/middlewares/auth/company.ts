import { Request, Response, NextFunction } from "express";
import responses from "../../utilities/responses";
import CompanyModel from "../../databases/mongo/models/company";
import ManagerModel from "../../databases/mongo/models/manager";
import { ICompanyProfile } from "../../types/controllers/company";
import IManagerSchema from "../../types/models/manager";
import { IOwnerProfile } from "../../types/controllers/owner";
import { IManagerProfile } from "../../types/controllers/manager";

const companyAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let company_id = req.body.company_id || req.header("company_id");
    const owner: IOwnerProfile = req.owner;
    const manager: IManagerProfile = req.manager;

    if (manager) {
      if (!company_id) {
        company_id = manager.company_id;
      }
    }

    if (!company_id) {
      return responses.authFail(req, res, {});
    }

    let company: ICompanyProfile | null = null;

    if (owner) {
      company = await CompanyModel.findOne({
        _id: company_id,
        owner_id: owner._id,
      }).lean();
    } else if (manager) {
      company = await CompanyModel.findById(company_id).lean();
    }

    if (!company || company.isDeleted) {
      return responses.notFound(req, res, {}, "Company");
    }

    if (!company.isActive) {
      return responses.notActive(req, res, {}, "Company");
    }

    req.company = company;

    next();
  } catch (error) {
    return responses.authFail(req, res, {});
  }
};

export { companyAuth };
