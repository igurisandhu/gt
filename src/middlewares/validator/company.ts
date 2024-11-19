import { z } from "zod";
import { Request } from "express";

const companyValidatorSchema = {
  addCompany: (req: Request) => {
    return z.object({
      body: z.object({
        name: z.string({
          required_error: req.t("NOT_FOUND_REQUEST_PARAM_TYPE_RESPONSE", {
            key: "name",
          }),
          invalid_type_error: req.t("INVALID_REQUEST_PARAM_TYPE_RESPONSE", {
            key: "name",
            type: "string",
          }),
        }),
        address: z.string({
          required_error: req.t("NOT_FOUND_REQUEST_PARAM_TYPE_RESPONSE", {
            key: "address",
          }),
          invalid_type_error: req.t("INVALID_REQUEST_PARAM_TYPE_RESPONSE", {
            key: "address",
            type: "string",
          }),
        }),
        email: z
          .string({
            required_error: req.t("NOT_FOUND_REQUEST_PARAM_TYPE_RESPONSE", {
              key: "email",
            }),
            invalid_type_error: req.t("INVALID_REQUEST_PARAM_TYPE_RESPONSE", {
              key: "email",
              type: "string",
            }),
          })
          .email(
            req.t("INVALID_REQUEST_PARAM_TYPE_RESPONSE", {
              key: "email",
              type: "string",
            }),
          ),
        phone: z.string({
          required_error: req.t("NOT_FOUND_REQUEST_PARAM_TYPE_RESPONSE", {
            key: "phone",
          }),
          invalid_type_error: req.t("INVALID_REQUEST_PARAM_TYPE_RESPONSE", {
            key: "phone",
            type: "string",
          }),
        }),
      }),
    });
  },
  updateCompany: (req: Request) => {
    return z.object({
      body: z.object({
        name: z.string().optional(),
        address: z.string().optional(),
        email: z.string().email().optional(),
        phone: z.string().optional(),
      }),
    });
  },
};

export default companyValidatorSchema;
