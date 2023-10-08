import express from "express";
import { companyAuth } from "../../middlewares/auth/company";
import {
  OwnerAndManagerAuth,
  checkOwnerAndCompanyStatus,
} from "../../middlewares/auth/common";
import teamController from "../../controllers/team";
import { ownerAuth } from "../../middlewares/auth/owner";

const teamRouter = express.Router();

teamRouter.get("/", OwnerAndManagerAuth, companyAuth, teamController.getTeam);

teamRouter.post("/add", ownerAuth, companyAuth, teamController.addTeam);

export default teamRouter;
