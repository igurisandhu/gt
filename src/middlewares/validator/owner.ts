import { z } from "zod";
import { Request } from "express";

const ownerValidatorSchema = {
  register: (req: Request) =>
    z.object({
      body: z.object({
        name: z.string({
          required_error: "Full name is required",
        }),
        email: z
          .string({
            required_error: "Email is required",
          })
          .email("Not a valid email"),
      }),
    }),
  update: (req: Request) =>
    z.object({
      body: z.object({
        name: z.string({
          required_error: "Full name is required",
        }),
        email: z
          .string({
            required_error: "Email is required",
          })
          .email("Not a valid email"),
      }),
    }),
};

export default ownerValidatorSchema;
