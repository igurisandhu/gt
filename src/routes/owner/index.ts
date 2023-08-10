import express, { request, response } from "express";
import ownerController from "../../controllers/owners";
import validate from "../../middlewares/validator";
import ownerAuth from "../../middlewares/auth/owner";
import ownerValidatorSchema from "../../middlewares/validator/owner";

const ownerRouter = express.Router();

ownerRouter.post(
  "/register",
  validate(ownerValidatorSchema.register),
  ownerController.register,
);

ownerRouter.get("/:_id", ownerAuth, ownerController.getOwner);

export default ownerRouter;
