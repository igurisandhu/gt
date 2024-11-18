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
 *     tags:
 *       - Agent
 *     summary: Get agent details
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *       401:
 *         description: Unauthorized
 */
agentRouter.get(
  "/",
  OwnerAndManagerAuth,
  companyAuth,
  teamAuth,
  agentController.getAgent,
);

/**
 * @swagger
 * /agent/add:
 *   post:
 *     tags:
 *       - Agent
 *     summary: Add new agent
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 example: "john@example.com"
 *               phone:
 *                 type: string
 *                 example: "+1234567890"
 *     responses:
 *       201:
 *         description: Agent created successfully
 *       400:
 *         description: Invalid input
 */
agentRouter.post(
  "/add",
  OwnerAndManagerAuth,
  companyAuth,
  validate(agentValidatorSchema.addAgent),
  agentController.addAgent,
);

/**
 * @swagger
 * /agent/update-location:
 *   post:
 *     tags:
 *       - Agent
 *     summary: Update agent location
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               latitude:
 *                 type: number
 *                 example: 12.9716
 *               longitude:
 *                 type: number
 *                 example: 77.5946
 */
agentRouter.post("/update-location", agentController.updateLocation);

/**
 * @swagger
 * /agent/login:
 *   post:
 *     tags:
 *       - Agent
 *     summary: Agent login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "john@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 */
agentRouter.post(
  "/login",
  validate(agentValidatorSchema.login),
  agentController.login,
);

/**
 * @swagger
 * /agent/{id}:
 *   delete:
 *     tags:
 *       - Agent
 *     summary: Delete agent
 *     parameters:
 *       - in: path
 *         name: _id
 *         required: true
 *         schema:
 *           type: string
 *         example: "507f1f77bcf86cd799439011"
 */
agentRouter.delete("/:_id", companyAuth, agentController.deleteAgent);

/**
 * @swagger
 * /agent/change-password:
 *   put:
 *     tags:
 *       - Agent
 *     summary: Change agent password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 example: "oldpass123"
 *               newPassword:
 *                 type: string
 *                 example: "newpass123"
 */
agentRouter.put(
  "/change-password",
  companyAuth,
  agentController.changePassword,
);

/**
 * @swagger
 * /agent/forgot-password:
 *   put:
 *     tags:
 *       - Agent
 *     summary: Initiate forgot password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "john@example.com"
 */
agentRouter.put(
  "/forgot-password",
  companyAuth,
  agentController.forgotPassword,
);

/**
 * @swagger
 * /agent/verify-token:
 *   get:
 *     tags:
 *       - Agent
 *     summary: Verify reset password token
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         example: "reset-token-123"
 */
agentRouter.get(
  "/verify-token",
  ownerAuth,
  companyAuth,
  agentController.verifyResetToken,
);

/**
 * @swagger
 * /agent/change-forgot-password:
 *   put:
 *     tags:
 *       - Agent
 *     summary: Reset forgotten password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 example: "reset-token-123"
 *               newPassword:
 *                 type: string
 *                 example: "newpass123"
 */
agentRouter.put(
  "/change-forgot-password",
  companyAuth,
  agentController.resetPassword,
);

/**
 * @swagger
 * /agent/send-phone-otp:
 *   post:
 *     tags:
 *       - Agent
 *     summary: Send OTP to phone
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone:
 *                 type: string
 *                 example: "+1234567890"
 */
agentRouter.post("/send-phone-otp", agentController.sendPhoneOTP);

/**
 * @swagger
 * /agent/login-phone-otp:
 *   post:
 *     tags:
 *       - Agent
 *     summary: Login with phone OTP
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone:
 *                 type: string
 *                 example: "+1234567890"
 *               otp:
 *                 type: string
 *                 example: "123456"
 */
agentRouter.post(
  "/login-phone-otp",
  companyAuth,
  agentController.loginWithPhoneOTP,
);

export default agentRouter;
