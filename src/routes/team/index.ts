import express from "express";
import { companyAuth } from "../../middlewares/auth/company";
import { OwnerAndManagerAuth } from "../../middlewares/auth/common";
import teamController from "../../controllers/team";
import { ownerAuth } from "../../middlewares/auth/owner";
import validate from "../../middlewares/validator";
import teamValidatorSchema from "../../middlewares/validator/team";

const teamRouter = express.Router();

/**
 * @swagger
 * /team:
 *   get:
 *     tags:
 *       - Team
 *     summary: Get team details
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Team details retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 teamId: "123"
 *                 name: "Engineering Team"
 *                 members: ["user1", "user2"]
 */
teamRouter.get("/", OwnerAndManagerAuth, companyAuth, teamController.getTeam);

/**
 * @swagger
 * /team/add:
 *   post:
 *     tags:
 *       - Team
 *     summary: Add new team
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
 *               members:
 *                 type: array
 *                 items:
 *                   type: string
 *           example:
 *             name: "New Team"
 *             members: ["userId1", "userId2"]
 *     responses:
 *       201:
 *         description: Team created successfully
 */
teamRouter.post(
  "/add",
  validate(teamValidatorSchema.addTeam),
  ownerAuth,
  companyAuth,
  teamController.addTeam,
);

/**
 * @swagger
 * /team/{_id}:
 *   delete:
 *     tags:
 *       - Team
 *     summary: Delete team
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: _id
 *         required: true
 *         schema:
 *           type: string
 *         description: Team ID
 *     responses:
 *       200:
 *         description: Team deleted successfully
 */
teamRouter.delete("/:_id", ownerAuth, companyAuth, teamController.deleteTeam);

export default teamRouter;
