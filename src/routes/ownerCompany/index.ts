import express from "express";
import { ownerAuth } from "../../middlewares/auth/owner";
import { ownerCompanyAuth } from "../../middlewares/auth/ownerCompany";
import ownerCompanyController from "../../controllers/ownerCompany";

const ownerCompanyRouter = express.Router();

ownerCompanyRouter.get(
  "/qr",
  ownerAuth,
  ownerCompanyAuth,
  ownerCompanyController.getqr,
);

export default ownerCompanyRouter;
