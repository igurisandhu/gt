import express from "express";
import { companyAuth } from "../../middlewares/auth/company";
import { OwnerAndManagerAuth } from "../../middlewares/auth/common";
import jobController from "../../controllers/job";
import { teamAuth } from "../../middlewares/auth/team";
import validate from "../../middlewares/validator";
import jobValidatorSchema from "../../middlewares/validator/job";

const jobRouter = express.Router();

/**
 * @swagger
 * /job:
 *   get:
 *     summary: Get jobs
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of jobs
 *         content:
 *           application/json:
 *             example:
 *               jobs: [
 *                 {
 *                   _id: "123",
 *                   title: "Software Engineer",
 *                   description: "Full stack developer role",
 *                   company: "ABC Corp",
 *                   team: "Engineering"
 *                 }
 *               ]
 */
jobRouter.get("/", OwnerAndManagerAuth, companyAuth, jobController.getJob);

/**
 * @swagger
 * /job/add:
 *   post:
 *     summary: Create new job
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             title: "Software Engineer"
 *             description: "Full stack developer role"
 *             team: "engineering-team-id"
 *             requirements: ["Node.js", "React"]
 *             experience: "3-5 years"
 *     responses:
 *       201:
 *         description: Job created successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Job created successfully"
 *               job: {
 *                 _id: "123",
 *                 title: "Software Engineer",
 *                 description: "Full stack developer role"
 *               }
 */

jobRouter.post(
  "/add",
  OwnerAndManagerAuth,
  companyAuth,
  teamAuth,
  validate(jobValidatorSchema.addJob),
  jobController.addJob,
);

/**
 * @swagger
 * /job/{_id}:
 *   delete:
 *     summary: Delete a job
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: _id
 *         required: true
 *         schema:
 *           type: string
 *         description: Job ID
 *     responses:
 *       200:
 *         description: Job deleted successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Job deleted successfully"
 *               jobId: "123"
 */
jobRouter.delete(
  "/:_id",
  OwnerAndManagerAuth,
  companyAuth,
  jobController.deleteJob,
);

/**
 * @swagger
 * /job/assign_agent:
 *   put:
 *     summary: Assign agent to job
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             job_id: "123"
 *             agent_id: "456"
 *     responses:
 *       200:
 *         description: Agent assigned successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Agent assigned successfully"
 *               job: {
 *                 _id: "123",
 *                 title: "Software Engineer",
 *                 description: "Full stack developer role"
 *               }
 */

jobRouter.put(
  "/assign_agent",
  OwnerAndManagerAuth,
  companyAuth,
  jobController.assignAgent,
);

export default jobRouter;
