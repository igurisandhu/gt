import { z } from "zod";
import { Request } from "express";

const teamValidatorSchema = {
  addTeam: (req: Request) => {
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
        description: z.string({
          required_error: req.t("NOT_FOUND_REQUEST_PARAM_TYPE_RESPONSE", {
            key: "description",
          }),
          invalid_type_error: req.t("INVALID_REQUEST_PARAM_TYPE_RESPONSE", {
            key: "description",
            type: "string",
          }),
        }),
        manager_id: z.string({
          required_error: req.t("NOT_FOUND_REQUEST_PARAM_TYPE_RESPONSE", {
            key: "manager_id",
          }),
          invalid_type_error: req.t("INVALID_REQUEST_PARAM_TYPE_RESPONSE", {
            key: "manager_id",
            type: "string",
          }),
        }),
      }),
    });
  },
  updateTeam: (req: Request) => {
    return z.object({
      body: z.object({
        name: z.string().optional(),
        description: z.string().optional(),
      }),
    });
  },
};

export default teamValidatorSchema;
