import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodSchema } from "zod";
import responses from "../../utilities/responses";

const validate =
  (schema: (req: Request) => ZodSchema) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema(req).parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error: any) {
      console.log(error);
      const formatted = error.flatten();

      return responses.requestDataValidatorError(
        req,
        res,
        {},
        formatted?.fieldErrors?.body?.join(", "),
      );
    }
  };

export default validate;
