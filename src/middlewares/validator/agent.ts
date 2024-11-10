import { z } from "zod";
import { Request } from "express";

const agentValidatorSchema = {
  addAgent: (req: Request) => {
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
          .email({
            message: req.t("INVALID_REQUEST_PARAM_TYPE_RESPONSE", {
              key: "email",
              type: "email",
            }),
          }),
        password: z
          .string({
            required_error: req.t("NOT_FOUND_REQUEST_PARAM_TYPE_RESPONSE", {
              key: "password",
            }),
            invalid_type_error: req.t("INVALID_REQUEST_PARAM_TYPE_RESPONSE", {
              key: "password",
              type: "string",
            }),
          })
          .min(8, req.t("WORNG_PASSWORD_FORMAT")),
        phone: z
          .string({
            required_error: req.t("NOT_FOUND_REQUEST_PARAM_TYPE_RESPONSE", {
              key: "phone",
            }),
            invalid_type_error: req.t("INVALID_REQUEST_PARAM_TYPE_RESPONSE", {
              key: "phone",
              type: "string",
            }),
          })
          .min(10, req.t("WORNG_PHONE_NUMBER_FORMAT")),
        company_id: z
          .string({
            required_error: req.t("NOT_FOUND_REQUEST_PARAM_TYPE_RESPONSE", {
              key: "company_id",
            }),
            invalid_type_error: req.t("INVALID_REQUEST_PARAM_TYPE_RESPONSE", {
              key: "company_id",
              type: "string",
            }),
          })
          .optional(),
        team_id: z.string({
          required_error: req.t("NOT_FOUND_REQUEST_PARAM_TYPE_RESPONSE", {
            key: "team_id",
          }),
          invalid_type_error: req.t("INVALID_REQUEST_PARAM_TYPE_RESPONSE", {
            key: "team_id",
            type: "string",
          }),
        }),
        country: z
          .string({
            required_error: req.t("NOT_FOUND_REQUEST_PARAM_TYPE_RESPONSE", {
              key: "country",
            }),
            invalid_type_error: req.t("INVALID_REQUEST_PARAM_TYPE_RESPONSE", {
              key: "country",
              type: "string",
            }),
          })
          .optional(),
      }),
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
