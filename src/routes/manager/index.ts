import express from "express";
import managerController from "../../controllers/manager";
import validate from "../../middlewares/validator";
import managerValidatorSchema from "../../middlewares/validator/manager";
import { ownerAuth } from "../../middlewares/auth/owner";
import { companyAuth } from "../../middlewares/auth/company";

const managerRouter = express.Router();

managerRouter.get("/", ownerAuth, companyAuth, managerController.getManager);

managerRouter.post(
  "/add",
  validate(managerValidatorSchema.addManager),
  ownerAuth,
  companyAuth,
  managerController.addManager,
);

managerRouter.post(
  "/assign-team",
  validate(managerValidatorSchema.assignTeam),
  ownerAuth,
  companyAuth,
  managerController.assignTeam,
);

managerRouter.post(
  "/login",
  validate(managerValidatorSchema.login),
  managerController.login,
);

managerRouter.delete(
  "/:_id",
  ownerAuth,
  companyAuth,
  managerController.deleteManager,
);

export default managerRouter;
