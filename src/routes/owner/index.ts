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

export default ownerRouter;
