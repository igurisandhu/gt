import express from "express";
import { ownerAuth } from "../../middlewares/auth/owner";
import { companyAuth } from "../../middlewares/auth/company";
import companyController from "../../controllers/company";
import { OwnerAndManagerAuth } from "../../middlewares/auth/common";
import validate from "../../middlewares/validator";
import companyValidatorSchema from "../../middlewares/validator/company";

const companyRouter = express.Router();

/**
 * @swagger
 * /company:
 *   get:
 *     summary: Get company details
 *     tags: [Company]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Company details retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               id: "123"
 *               name: "Test Company"
 *               address: "123 Street"
 *               email: "company@test.com"
 */
companyRouter.get("/", ownerAuth, companyController.getCompany);

/**
 * @swagger
 * /company/qr:
 *   get:
 *     summary: Get company QR code
 *     tags: [Company]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: QR code retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               qrCode: "base64EncodedQRCode"
 */
companyRouter.get(
  "/qr",
  OwnerAndManagerAuth,
  companyAuth,
  companyController.getqr,
);

/**
 * @swagger
 * /company/add:
 *   post:
 *     summary: Add a new company
 *     tags: [Company]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             name: "New Company"
 *             address: "456 Street"
 *             email: "newcompany@test.com"
 *             phone: "1234567890"
 *     responses:
 *       201:
 *         description: Company created successfully
 *         content:
 *           application/json:
 *             example:
 *               id: "124"
 *               name: "New Company"
 *               address: "456 Street"
 *               email: "newcompany@test.com"
 */
companyRouter.post(
  "/add",
  ownerAuth,
  validate(companyValidatorSchema.addCompany),
  companyController.addCompany,
);

/**
 * @swagger
 * /company/{_id}:
 *   delete:
 *     summary: Delete a company
 *     tags: [Company]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: _id
 *         required: true
 *         schema:
 *           type: string
 *         description: Company ID
 *     responses:
 *       200:
 *         description: Company deleted successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Company deleted successfully"
 */
companyRouter.delete(
  "/:_id",
  ownerAuth,
  validate(companyValidatorSchema.updateCompany),
  companyController.deleteCompany,
);

export default companyRouter;
