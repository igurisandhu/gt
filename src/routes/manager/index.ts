import express from "express";
import managerController from "../../controllers/manager";
import validate from "../../middlewares/validator";
import managerValidatorSchema from "../../middlewares/validator/manager";
import { ownerAuth } from "../../middlewares/auth/owner";
import { companyAuth } from "../../middlewares/auth/company";

const managerRouter = express.Router();

/**
 * @swagger
 * /manager:
 *   get:
 *     tags:
 *       - Manager
 *     summary: Get manager details
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Manager details retrieved successfully
 */
managerRouter.get("/", ownerAuth, companyAuth, managerController.getManager);

/**
 * @swagger
 * /manager/add:
 *   post:
 *     tags:
 *       - Manager
 *     summary: Add new manager
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
 *               password:
 *                 type: string
 *                 example: "password123"
 *               phone:
 *                 type: string
 *                 example: "+1234567890"
 */
managerRouter.post(
  "/",
  validate(managerValidatorSchema.addManager),
  ownerAuth,
  companyAuth,
  managerController.addManager,
);

/**
 * @swagger
 * /manager/assign-team:
 *   post:
 *     tags:
 *       - Manager
 *     summary: Assign team to manager
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               managerId:
 *                 type: string
 *                 example: "612e4781b3e2c8001f123456"
 *               teamId:
 *                 type: string
 *                 example: "612e4781b3e2c8001f789012"
 */
managerRouter.post(
  "/assign-team",
  validate(managerValidatorSchema.assignTeam),
  ownerAuth,
  companyAuth,
  managerController.assignTeam,
);

/**
 * @swagger
 * /manager/login:
 *   post:
 *     tags:
 *       - Manager
 *     summary: Manager login
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
managerRouter.post(
  "/login",
  validate(managerValidatorSchema.login),
  managerController.login,
);

/**
 * @swagger
 * /manager/{_id}:
 *   delete:
 *     tags:
 *       - Manager
 *     summary: Delete manager
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: _id
 *         required: true
 *         schema:
 *           type: string
 *         example: "612e4781b3e2c8001f123456"
 */
managerRouter.delete(
  "/:_id",
  ownerAuth,
  companyAuth,
  managerController.deleteManager,
);

/**
 * @swagger
 * /manager/change-password:
 *   put:
 *     tags:
 *       - Manager
 *     summary: Change manager password
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 example: "oldpassword123"
 *               newPassword:
 *                 type: string
 *                 example: "newpassword123"
 */
managerRouter.put(
  "/change-password",
  ownerAuth,
  validate(managerValidatorSchema.changePassword),
  managerController.changePassword,
);

/**
 * @swagger
 * /manager/forgot-password:
 *   put:
 *     tags:
 *       - Manager
 *     summary: Initiate forgot password process
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
managerRouter.put(
  "/forgot-password",
  validate(managerValidatorSchema.forgotPassword),
  managerController.forgotPassword,
);

/**
 * @swagger
 * /manager/verify-token:
 *   get:
 *     tags:
 *       - Manager
 *     summary: Verify reset password token
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         example: "resettoken123"
 */
managerRouter.get("/verify-token", managerController.verifyToken);

/**
 * @swagger
 * /manager/change-forgot-password:
 *   put:
 *     tags:
 *       - Manager
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
 *                 example: "resettoken123"
 *               newPassword:
 *                 type: string
 *                 example: "newpassword123"
 */
managerRouter.put(
  "/change-forgot-password",
  validate(managerValidatorSchema.changeForgotPassword),
  managerController.resetPassword,
);

/**
 * @swagger
 * /manager/send-phone-otp:
 *   post:
 *     tags:
 *       - Manager
 *     summary: Send OTP to phone number
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
managerRouter.post(
  "/send-phone-otp",
  validate(managerValidatorSchema.sendPhoneOTP),
  managerController.sendPhoneOtp,
);

/**
 * @swagger
 * /manager/login-phone-otp:
 *   post:
 *     tags:
 *       - Manager
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
managerRouter.post(
  "/login-phone-otp",
  validate(managerValidatorSchema.loginWithPhoneOTP),
  managerController.loginWithPhoneOTP,
);

export default managerRouter;
