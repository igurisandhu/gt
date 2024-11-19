import { z } from "zod";
import { Request } from "express";

const ownerValidatorSchema = {
  signup: (req: Request) => {
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
  updateProfile: (req: Request) => {
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
        phone: z.string({
          required_error: req.t("NOT_FOUND_REQUEST_PARAM_TYPE_RESPONSE", {
            key: "phone",
          }),
          invalid_type_error: req.t("INVALID_REQUEST_PARAM_TYPE_RESPONSE", {
            key: "phone",
            type: "string",
          }),
        }),
        country: z.string().optional(),
        countryCode: z.string().optional(),
        avatar: z.string().url().optional(),
      }),
    });
  },
  changePassword: (req: Request) => {
    return z.object({
      body: z.object({
        oldPassword: z.string({
          required_error: req.t("NOT_FOUND_REQUEST_PARAM_TYPE_RESPONSE", {
            key: "oldPassword",
          }),
          invalid_type_error: req.t("INVALID_REQUEST_PARAM_TYPE_RESPONSE", {
            key: "oldPassword",
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
          .email(
            req.t("INVALID_REQUEST_PARAM_TYPE_RESPONSE", {
              key: "email",
              type: "string",
            }),
          ),
      }),
    });
  },
  changeForgotPassword: (req: Request) => {
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
};

export default ownerValidatorSchema;
