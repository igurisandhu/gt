import { IOwnerProfile } from "../../types/controllers/owner";
import responses from "../../utilities/responses";
import { Request, Response } from "express";
import { generateQRCode } from "../../utilities/qrcode";
import { IOwnerCompanyProfile } from "../../types/controllers/ownerCompany";

const getqr = async (req: Request, res: Response) => {
  try {
    const owner: IOwnerProfile = req.owner;
    const ownerCompany: IOwnerCompanyProfile = req.ownerCompany;

    const qrcode = await generateQRCode(
      JSON.stringify({ owner_id: owner._id, company_id: ownerCompany._id }),
    );

    return responses.success(req, res, { qr: qrcode });
  } catch (error) {
    return responses.serverError(req, res, {});
  }
};

const ownerCompanyController = {
  getqr,
};

export default ownerCompanyController;
