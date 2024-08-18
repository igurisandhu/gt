import express from "express";
import { companyAuth } from "../../middlewares/auth/company";
import { OwnerAndManagerAuth } from "../../middlewares/auth/common";
import jobController from "../../controllers/job";
import { teamAuth } from "../../middlewares/auth/team";

const jobRouter = express.Router();

jobRouter.get("/", OwnerAndManagerAuth, companyAuth, jobController.getJob);

jobRouter.post(
  "/add",
  OwnerAndManagerAuth,
  companyAuth,
  teamAuth,
  jobController.addJob,
);

jobRouter.delete(
  "/:_id",
  OwnerAndManagerAuth,
  companyAuth,
  jobController.deleteJob,
);

export default jobRouter;
