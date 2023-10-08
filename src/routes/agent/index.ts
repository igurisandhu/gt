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

const agentRouter = express.Router();

agentRouter.get("/", ownerAuth, agentController.getAgent);

agentRouter.post(
  "/add",
  OwnerAndManagerAuth,
  companyAuth,
  validate(agentValidatorSchema.addAgent),
  agentController.addAgent,
);

agentRouter.post(
  "/login",
  validate(agentValidatorSchema.login),
  agentController.login,
);

export default agentRouter;
