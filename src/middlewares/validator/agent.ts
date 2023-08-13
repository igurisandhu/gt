import { z } from "zod";
import { Request } from "express";

const agentValidatorSchema = {
  addAgent: (req: Request) => {
    return z.object({
      params: z.object({
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
      }),
    });
  },
  login: (req: Request) =>
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
};

export default agentValidatorSchema;
