import { IOwnerProfile } from "../../types/controllers/owner";
import responses from "../../utilities/responses";
import { Request, Response } from "express";
import { generateQRCode } from "../../utilities/qrcode";
import { ICompanyProfile } from "../../types/controllers/company";
import CompanyModel from "../../databases/mongo/models/company";
import { ObjectId } from "mongoose";

const getqr = async (req: Request, res: Response) => {
  try {
    const owner: IOwnerProfile = req.owner;
    const company: ICompanyProfile = req.company;

    const qrcode = await generateQRCode(
      JSON.stringify({ owner_id: owner._id, company_id: company._id }),
    );

    return responses.success(req, res, { qr: qrcode });
  } catch (error) {
    return responses.serverError(req, res, {});
  }
};

const addCompany = async (req: Request, res: Response) => {
  try {
    const owner: IOwnerProfile = req.owner;

    const companyData = req.body;

    const company: ICompanyProfile = (
      await CompanyModel.create({ ...companyData, owner_id: owner._id })
    ).toObject();

    if (!company) {
      return responses.serverError(req, res, {});
    }

    return responses.success(req, res, company);
  } catch (error) {
    return responses.serverError(req, res, {});
  }
};

const getCompany = async (req: Request, res: Response) => {
  try {
    const owner: IOwnerProfile = req.owner;

    const { company_id } = req.query;

    let data: [] | {} = [];

    if (company_id) {
      const company: ICompanyProfile | null = await CompanyModel.findOne({
        _id: company_id,
        owner_id: owner._id,
      }).lean();

      if (!company) {
        return responses.notFound(req, res, {}, "Company");
      }

      data = company;
    } else {
      const {
        limit = 10,
        page = 1,
        name,
      }: {
        limit: number;
        page: number;
        company_id: ObjectId;
        name: string;
      } = req.body;

      let searchQuery: {
        owner_id: ObjectId;
        name?: {
          $search: string;
        };
      } = {
        owner_id: owner._id,
      };

      if (name) {
        searchQuery = {
          ...searchQuery,
          name: { $search: name },
        };
      }

      const companies: [ICompanyProfile] | [] = await CompanyModel.find(
        searchQuery,
      )
        .limit(limit)
        .skip((page - 1) * 10)
        .lean();
      data = companies;
    }

    return responses.success(req, res, data);
  } catch (error) {
    return responses.serverError(req, res, {});
  }
};

const companyController = {
  getqr,
  addCompany,
  getCompany,
};

export default companyController;
