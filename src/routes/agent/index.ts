import express from "express";
import agentController from "../../controllers/agent";
import validate from "../../middlewares/validator";
import agentValidatorSchema from "../../middlewares/validator/agent";
import {
  OwnerAndManagerAuth,
  checkOwnerAndCompanyStatus,
} from "../../middlewares/auth/common";
import { companyAuth } from "../../middlewares/auth/company";
import { ownerAuth } from "../../middlewares/auth/owner";
import { teamAuth } from "../../middlewares/auth/team";

const agentRouter = express.Router();

agentRouter.get(
  "/",
  OwnerAndManagerAuth,
  companyAuth,
  teamAuth,
  agentController.getAgent,
);

agentRouter.post(
  "/add",
  OwnerAndManagerAuth,
  companyAuth,
  validate(agentValidatorSchema.addAgent),
  agentController.addAgent,
);

agentRouter.post("/update-location", agentController.updateLocation);

agentRouter.post(
  "/login",
  validate(agentValidatorSchema.login),
  agentController.login,
);

agentRouter.delete(
  "/:_id",
  ownerAuth,
  companyAuth,
  agentController.deleteAgent,
);

export default agentRouter;
