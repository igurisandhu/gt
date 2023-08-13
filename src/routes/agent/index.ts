import express from "express";
import agentController from "../../controllers/agent";
import validate from "../../middlewares/validator";
import agentValidatorSchema from "../../middlewares/validator/agent";
import { checkOwnerAndCompanyStatus } from "../../middlewares/auth/common";

const agentRouter = express.Router();

agentRouter.post(
  "/add",
  checkOwnerAndCompanyStatus,
  validate(agentValidatorSchema.addAgent),
  agentController.addAgent,
);

agentRouter.post(
  "/login",
  checkOwnerAndCompanyStatus,
  validate(agentValidatorSchema.login),
  agentController.login,
);

export default agentRouter;
