import express from "express";
import managerController from "../../controllers/manager";
import validate from "../../middlewares/validator";
import managerValidatorSchema from "../../middlewares/validator/manager";
import { ownerAuth } from "../../middlewares/auth/owner";
import { companyAuth } from "../../middlewares/auth/company";

const managerRouter = express.Router();

managerRouter.get("/", ownerAuth, companyAuth, managerController.getManager);

/**
 * @swagger
 * /manager/add:
 *   post:
 *     summary: Add a new manager
 *     tags: [Manager]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Manager's email
 *               password:
 *                 type: string
 *                 description: Manager's password
 *     responses:
 *       200:
 *         description: Manager added successfully
 *       400:
 *         description: Bad request
 */
managerRouter.post(
  "/add",
  validate(managerValidatorSchema.addManager),
  ownerAuth,
  companyAuth,
  managerController.addManager,
);

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
 *     summary: Login a manager
 *     tags: [Manager]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Manager's email
 *               password:
 *                 type: string
 *                 description: Manager's password
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Unauthorized
 */
managerRouter.post(
  "/login",
  validate(managerValidatorSchema.login),
  managerController.login,
);

managerRouter.delete(
  "/:_id",
  ownerAuth,
  companyAuth,
  managerController.deleteManager,
);

export default managerRouter;
