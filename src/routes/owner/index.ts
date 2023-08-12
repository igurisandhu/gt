import express from "express";
import ownerController from "../../controllers/owners";
import validate from "../../middlewares/validator";
import ownerAuth from "../../middlewares/auth/owner";
import ownerValidatorSchema from "../../middlewares/validator/owner";

const ownerRouter = express.Router();

ownerRouter.post(
  "/signup",
  validate(ownerValidatorSchema.register),
  ownerController.signup,
);

ownerRouter.post(
  "/login",
  validate(ownerValidatorSchema.login),
  ownerController.login,
);

export default ownerRouter;
