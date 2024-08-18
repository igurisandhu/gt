import express from "express";
import commonController from "../../controllers/common";

const commonRouter = express.Router();

commonRouter.get("/metrics", commonController.getMetrics);

export default commonRouter;
