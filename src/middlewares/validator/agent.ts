import { z } from "zod";
import { Request } from "express";

const agentValidatorSchema = {
  addAgent: (req: Request) => {
    return z.object({
      params: z.object({}),
    });
  },
  loginWithQR: (req: Request) =>
    z.object({
      body: z.object({
        owner_id: z.string({
          required_error: req.t("NOT_FOUND_REQUEST_PARAM_TYPE_RESPONSE", {
            key: "owner_id",
          }),
          invalid_type_error: req.t("INVALID_REQUEST_PARAM_TYPE_RESPONSE", {
            key: "owner_id",
            type: "string",
          }),
        }),
        company_id: z.string({
          required_error: req.t("NOT_FOUND_REQUEST_PARAM_TYPE_RESPONSE", {
            key: "company_id",
          }),
          invalid_type_error: req.t("INVALID_REQUEST_PARAM_TYPE_RESPONSE", {
            key: "company_id",
            type: "string",
          }),
        }),
        agentCode: z.string({
          required_error: req.t("NOT_FOUND_REQUEST_PARAM_TYPE_RESPONSE", {
            key: "agentCode",
          }),
          invalid_type_error: req.t("INVALID_REQUEST_PARAM_TYPE_RESPONSE", {
            key: "agentCode",
            type: "string",
          }),
        }),
      }),
    }),
  login: (req: Request) =>
    z.object({
      body: z.object({
        email: z.string({
          required_error: req.t("NOT_FOUND_REQUEST_PARAM_TYPE_RESPONSE", {
            key: "email",
          }),
          invalid_type_error: req.t("INVALID_REQUEST_PARAM_TYPE_RESPONSE", {
            key: "email",
            type: "string",
          }),
        }),
        password: z.string({
          required_error: req.t("NOT_FOUND_REQUEST_PARAM_TYPE_RESPONSE", {
            key: "password",
          }),
          invalid_type_error: req.t("INVALID_REQUEST_PARAM_TYPE_RESPONSE", {
            key: "password",
            type: "string",
          }),
        }),
        // ownerPublicKey: z.string({
        //   required_error: req.t("NOT_FOUND_REQUEST_PARAM_TYPE_RESPONSE", {
        //     key: "ownerPublicKey",
        //   }),
        //   invalid_type_error: req.t("INVALID_REQUEST_PARAM_TYPE_RESPONSE", {
        //     key: "ownerPublicKey",
        //     type: "string",
        //   }),
        // }),
      }),
    }),
};

export default agentValidatorSchema;
