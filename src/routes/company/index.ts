import express from "express";
import { ownerAuth } from "../../middlewares/auth/owner";
import { companyAuth } from "../../middlewares/auth/company";
import companyController from "../../controllers/company";
import { OwnerAndManagerAuth } from "../../middlewares/auth/common";

const companyRouter = express.Router();

companyRouter.get("/", ownerAuth, companyController.getCompany);

companyRouter.get(
  "/qr",
  OwnerAndManagerAuth,
  companyAuth,
  companyController.getqr,
);

companyRouter.post("/add", ownerAuth, companyController.addCompany);

companyRouter.delete("/:_id", ownerAuth, companyController.deleteCompany);

export default companyRouter;
