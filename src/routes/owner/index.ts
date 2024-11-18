import express from "express";
import ownerController from "../../controllers/owner";
import validate from "../../middlewares/validator";
import ownerValidatorSchema from "../../middlewares/validator/owner";
import { ownerAuth } from "../../middlewares/auth/owner";

const ownerRouter = express.Router();

/**
 * @swagger
 * /owner/signup:
 *   post:
 *     tags:
 *       - Owner
 *     summary: Owner signup
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
 */
ownerRouter.post(
  "/signup",
  validate(ownerValidatorSchema.signup),
  ownerController.signup,
);

/**
 * @swagger
 * /owner/login:
 *   post:
 *     tags:
 *       - Owner
 *     summary: Owner login
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
ownerRouter.post(
  "/login",
  validate(ownerValidatorSchema.login),
  ownerController.login,
);

/**
 * @swagger
 * /owner/profile/{id}:
 *   put:
 *     tags:
 *       - Owner
 *     summary: Update owner profile
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe Updated"
 *               phone:
 *                 type: string
 *                 example: "+1234567890"
 */
ownerRouter.put(
  "/profile/:id",
  ownerAuth,
  validate(ownerValidatorSchema.updateProfile),
  ownerController.updateProfile,
);

/**
 * @swagger
 * /owner/change-password:
 *   put:
 *     tags:
 *       - Owner
 *     summary: Change owner password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 example: "oldpassword123"
 *               newPassword:
 *                 type: string
 *                 example: "newpassword123"
 */
ownerRouter.put("/change-password", ownerAuth, ownerController.changePassword);

/**
 * @swagger
 * /owner/profile:
 *   get:
 *     tags:
 *       - Owner
 *     summary: Get owner profile
 */
ownerRouter.get("/profile", ownerAuth, ownerController.getProfile);

/**
 * @swagger
 * /owner/forgot-password:
 *   put:
 *     tags:
 *       - Owner
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
ownerRouter.put("/forgot-password", ownerController.forgotPassword);

/**
 * @swagger
 * /owner/verify-token:
 *   get:
 *     tags:
 *       - Owner
 *     summary: Verify reset password token
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 */
ownerRouter.get("/verify-token", ownerController.verifyToken);

/**
 * @swagger
 * /owner/change-forgot-password:
 *   put:
 *     tags:
 *       - Owner
 *     summary: Reset password with token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 example: "reset-token"
 *               newPassword:
 *                 type: string
 *                 example: "newpassword123"
 */
ownerRouter.put(
  "/change-forgot-password",
  ownerController.changeForgotPassword,
);

/**
 * @swagger
 * /owner/send-phone-otp:
 *   post:
 *     tags:
 *       - Owner
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
ownerRouter.post("/send-phone-otp", ownerController.sendPhoneOTP);

/**
 * @swagger
 * /owner/login-phone-otp:
 *   post:
 *     tags:
 *       - Owner
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
ownerRouter.post("/login-phone-otp", ownerController.loginWithPhoneOTP);

export default ownerRouter;
