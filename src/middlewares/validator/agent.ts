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
        phone: z.string({
          required_error: req.t("NOT_FOUND_REQUEST_PARAM_TYPE_RESPONSE", {
            key: "phone",
          }),
          invalid_type_error: req.t("INVALID_REQUEST_PARAM_TYPE_RESPONSE", {
            key: "phone",
            type: "string",
          }),
        }),
        company_id: z.string().optional(),
        team_id: z.string({
          required_error: req.t("NOT_FOUND_REQUEST_PARAM_TYPE_RESPONSE", {
            key: "team_id",
          }),
          invalid_type_error: req.t("INVALID_REQUEST_PARAM_TYPE_RESPONSE", {
            key: "team_id",
            type: "string",
          }),
        }),
        country: z.string().optional(),
        countryCode: z.string().optional(),
      }),
    });
  },
  login: (req: Request) => {
    return z.object({
      body: z.object({
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
      }),
    });
  },
  updateLocation: (req: Request) => {
    return z.object({
      body: z.object({
        latitude: z.number({
          required_error: req.t("NOT_FOUND_REQUEST_PARAM_TYPE_RESPONSE", {
            key: "latitude",
          }),
          invalid_type_error: req.t("INVALID_REQUEST_PARAM_TYPE_RESPONSE", {
            key: "latitude",
            type: "number",
          }),
        }),
        longitude: z.number({
          required_error: req.t("NOT_FOUND_REQUEST_PARAM_TYPE_RESPONSE", {
            key: "longitude",
          }),
          invalid_type_error: req.t("INVALID_REQUEST_PARAM_TYPE_RESPONSE", {
            key: "longitude",
            type: "number",
          }),
        }),
      }),
    });
  },
  loginWithPhoneOTP: (req: Request) => {
    return z.object({
      body: z.object({
        phone: z.string({
          required_error: req.t("NOT_FOUND_REQUEST_PARAM_TYPE_RESPONSE", {
            key: "phone",
          }),
          invalid_type_error: req.t("INVALID_REQUEST_PARAM_TYPE_RESPONSE", {
            key: "phone",
            type: "string",
          }),
        }),
        otp: z.string({
          required_error: req.t("NOT_FOUND_REQUEST_PARAM_TYPE_RESPONSE", {
            key: "otp",
          }),
          invalid_type_error: req.t("INVALID_REQUEST_PARAM_TYPE_RESPONSE", {
            key: "otp",
            type: "string",
          }),
        }),
      }),
    });
  },
  deleteAgent: (req: Request) => {
    return z.object({
      params: z.object({
        _id: z.string({
          required_error: req.t("NOT_FOUND_REQUEST_PARAM_TYPE_RESPONSE", {
            key: "_id",
          }),
          invalid_type_error: req.t("INVALID_REQUEST_PARAM_TYPE_RESPONSE", {
            key: "_id",
            type: "string",
          }),
        }),
      }),
    });
  },
  changePassword: (req: Request) => {
    return z.object({
      body: z.object({
        currentPassword: z.string({
          required_error: req.t("NOT_FOUND_REQUEST_PARAM_TYPE_RESPONSE", {
            key: "currentPassword",
          }),
          invalid_type_error: req.t("INVALID_REQUEST_PARAM_TYPE_RESPONSE", {
            key: "currentPassword",
            type: "string",
          }),
        }),
        newPassword: z
          .string({
            required_error: req.t("NOT_FOUND_REQUEST_PARAM_TYPE_RESPONSE", {
              key: "newPassword",
            }),
            invalid_type_error: req.t("INVALID_REQUEST_PARAM_TYPE_RESPONSE", {
              key: "newPassword",
              type: "string",
            }),
          })
          .min(8, req.t("WORNG_PASSWORD_FORMAT")),
      }),
    });
  },
  forgotPassword: (req: Request) => {
    return z.object({
      body: z.object({
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
      }),
    });
  },
  verifyResetToken: (req: Request) => {
    return z.object({
      query: z.object({
        token: z.string({
          required_error: req.t("NOT_FOUND_REQUEST_PARAM_TYPE_RESPONSE", {
            key: "token",
          }),
          invalid_type_error: req.t("INVALID_REQUEST_PARAM_TYPE_RESPONSE", {
            key: "token",
            type: "string",
          }),
        }),
      }),
    });
  },
  resetPassword: (req: Request) => {
    return z.object({
      body: z.object({
        token: z.string({
          required_error: req.t("NOT_FOUND_REQUEST_PARAM_TYPE_RESPONSE", {
            key: "token",
          }),
          invalid_type_error: req.t("INVALID_REQUEST_PARAM_TYPE_RESPONSE", {
            key: "token",
            type: "string",
          }),
        }),
        newPassword: z
          .string({
            required_error: req.t("NOT_FOUND_REQUEST_PARAM_TYPE_RESPONSE", {
              key: "newPassword",
            }),
            invalid_type_error: req.t("INVALID_REQUEST_PARAM_TYPE_RESPONSE", {
              key: "newPassword",
              type: "string",
            }),
          })
          .min(8, req.t("WORNG_PASSWORD_FORMAT")),
      }),
    });
  },
  sendPhoneOTP: (req: Request) => {
    return z.object({
      body: z.object({
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
};

export default agentValidatorSchema;
