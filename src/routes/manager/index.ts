import express from "express";
import managerController from "../../controllers/manager";
import validate from "../../middlewares/validator";
import managerValidatorSchema from "../../middlewares/validator/manager";
import { ownerAuth } from "../../middlewares/auth/owner";
import { companyAuth } from "../../middlewares/auth/company";
import { teamAuth } from "../../middlewares/auth/team";

const managerRouter = express.Router();

managerRouter.post(
  "/addManager",
  validate(managerValidatorSchema.addManager),
  ownerAuth,
  companyAuth,
  managerController.addManager,
);

managerRouter.post(
  "/assignteam",
  validate(managerValidatorSchema.assignTeam),
  ownerAuth,
  companyAuth,
  teamAuth,
  managerController.assignTeam,
);

managerRouter.post(
  "/login",
  validate(managerValidatorSchema.login),
  managerController.login,
);

export default managerRouter;
