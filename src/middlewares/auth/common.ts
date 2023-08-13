import { Request, Response, NextFunction } from "express";
import responses from "../../utilities/responses";
import OwnerModel from "../../databases/mongo/models/owner";
import OwnerCompanyModel from "../../databases/mongo/models/ownerCompany";

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

    const ownerCompany = await OwnerCompanyModel.findById(company_id);

    if (
      !ownerCompany ||
      ownerCompany.isActive == false ||
      ownerCompany.isDeleted == true ||
      ownerCompany.owner_id !== owner._id
    ) {
      return responses.authFail(req, res, {});
    }

    req.owner = owner;
    req.ownerCompany = ownerCompany;

    next();
  } catch (error) {
    return responses.authFail(req, res, {});
  }
};

export { checkOwnerAndCompanyStatus };
