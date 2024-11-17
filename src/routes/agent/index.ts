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

/**
 * @swagger
 * /agent:
 *   get:
 *     summary: Get agent details
 *     tags: [Agent]
 *     responses:
 *       200:
 *         description: Agent details
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal server error
 */

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

agentRouter.delete("/:_id", companyAuth, agentController.deleteAgent);

agentRouter.put(
  "/change-password",
  companyAuth,
  agentController.changePassword,
);

agentRouter.put(
  "/forgot-password",
  companyAuth,
  agentController.forgotPassword,
);

agentRouter.get(
  "/verify-token",
  ownerAuth,
  companyAuth,
  agentController.verifyResetToken,
);

agentRouter.put(
  "/change-forgot-password",
  companyAuth,
  agentController.resetPassword,
);

agentRouter.post("/send-otp", agentController.sendPhoneOTP);

agentRouter.post(
  "/login-with-otp",
  companyAuth,
  agentController.loginWithPhoneOTP,
);

export default agentRouter;
