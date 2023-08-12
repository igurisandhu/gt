import express from "express";
import agentController from "../../controllers/agents";
import validate from "../../middlewares/validator";
import agentAuth from "../../middlewares/auth/agent";
import agentValidatorSchema from "../../middlewares/validator/agent";

const agentRouter = express.Router();

agentRouter.post(
  "/signup",
  validate(agentValidatorSchema.register),
  agentController.signup,
);

agentRouter.post(
  "/login",
  validate(agentValidatorSchema.login),
  agentController.login,
);

export default agentRouter;
