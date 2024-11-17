import express from "express";
import ownerController from "../../controllers/owner";
import validate from "../../middlewares/validator";
import ownerValidatorSchema from "../../middlewares/validator/owner";
import { ownerAuth } from "../../middlewares/auth/owner";

const ownerRouter = express.Router();

ownerRouter.post(
  "/signup",
  validate(ownerValidatorSchema.signup),
  ownerController.signup,
);

ownerRouter.post(
  "/login",
  validate(ownerValidatorSchema.login),
  ownerController.login,
);

ownerRouter.put(
  "/profile/:id",
  ownerAuth,
  validate(ownerValidatorSchema.updateProfile),
  ownerController.updateProfile,
);

ownerRouter.put("/change-password", ownerAuth, ownerController.changePassword);
ownerRouter.get("/profile", ownerAuth, ownerController.getProfile);
ownerRouter.put("/forgot-password", ownerController.forgotPassword);
ownerRouter.get("/verify-token", ownerController.verifyToken);
ownerRouter.put(
  "/change-forgot-password",
  ownerController.changeForgotPassword,
);
ownerRouter.post("/send-phone-otp", ownerController.sendPhoneOTP);
ownerRouter.post("/login-phone-otp", ownerController.loginWithPhoneOTP);

export default ownerRouter;
