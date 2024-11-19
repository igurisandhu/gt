import { z } from "zod";
import { Request } from "express";

const jobValidatorSchema = {
  addJob: (req: Request) => {
    return z.object({
      body: z.object({
        title: z.string({
          required_error: req.t("NOT_FOUND_REQUEST_PARAM_TYPE_RESPONSE", {
            key: "title",
          }),
          invalid_type_error: req.t("INVALID_REQUEST_PARAM_TYPE_RESPONSE", {
            key: "title",
            type: "string",
          }),
        }),
        description: z.string({
          required_error: req.t("NOT_FOUND_REQUEST_PARAM_TYPE_RESPONSE", {
            key: "description",
          }),
          invalid_type_error: req.t("INVALID_REQUEST_PARAM_TYPE_RESPONSE", {
            key: "description",
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
        location: z.string({
          required_error: req.t("NOT_FOUND_REQUEST_PARAM_TYPE_RESPONSE", {
            key: "location",
          }),
          invalid_type_error: req.t("INVALID_REQUEST_PARAM_TYPE_RESPONSE", {
            key: "location",
            type: "string",
          }),
        }),
        salary: z.number({
          required_error: req.t("NOT_FOUND_REQUEST_PARAM_TYPE_RESPONSE", {
            key: "salary",
          }),
          invalid_type_error: req.t("INVALID_REQUEST_PARAM_TYPE_RESPONSE", {
            key: "salary",
            type: "number",
          }),
        }),
      }),
    });
  },
  updateJob: (req: Request) => {
    return z.object({
      body: z.object({
        title: z.string().optional(),
        description: z.string().optional(),
        location: z.string().optional(),
        salary: z.number().optional(),
      }),
    });
  },
};

export default jobValidatorSchema;
