import express from "express";
import { companyAuth } from "../../middlewares/auth/company";
import { OwnerAndManagerAuth } from "../../middlewares/auth/common";
import taskController from "../../controllers/task";

const taskRouter = express.Router();

taskRouter.get("/", OwnerAndManagerAuth, companyAuth, taskController.getTask);

taskRouter.post(
  "/add",
  OwnerAndManagerAuth,
  companyAuth,
  taskController.addTask,
);

taskRouter.delete(
  "/:_id",
  OwnerAndManagerAuth,
  companyAuth,
  taskController.deleteTask,
);

export default taskRouter;
