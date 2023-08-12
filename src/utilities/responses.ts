import { Response, Request } from "express";
import { TResponse } from "../types/utilities/responses";

const responses = {
  serverError: async (req: Request, res: Response, data: object) => {
    const status: number = 500;
    const prepareResponse: TResponse = {
      message: req.t("SERVER_RESPONSE"),
      data,
      error: true,
      status,
      success: false,
      notFound: false,
    };
    return res.status(status).json(prepareResponse);
  },
  success: async (
    req: Request,
    res: Response,
    data: object,
    successMessage?: string,
  ) => {
    const status: number = 200;
    const prepareResponse: TResponse = {
      message: successMessage || req.t("SUCCESS_RESPONSE"),
      data,
      error: false,
      status,
      success: true,
      notFound: false,
    };
    return res.status(status).json(prepareResponse);
  },
  notFound: async (
    req: Request,
    res: Response,
    data: object,
    module: string,
  ) => {
    const status: number = 404;
    const prepareResponse: TResponse = {
      message: req.t("NOT_FOUND_RESPONSE", module),
      data,
      error: false,
      status,
      success: false,
      notFound: true,
    };
    return res.status(status).json(prepareResponse);
  },
  authFail: async (req: Request, res: Response, data: object) => {
    const status: number = 401;
    const prepareResponse: TResponse = {
      message: req.t("AUTH_FAIL_RESPONSE"),
      data,
      error: true,
      status,
      success: false,
      notFound: false,
    };
    return res.status(status).json(prepareResponse);
  },
  inVaildRequestParamType: async (
    req: Request,
    res: Response,
    data: object,
    key: string,
    correctType: string,
  ) => {
    const status: number = 400;
    const prepareResponse: TResponse = {
      message: req.t("INVALID_REQUEST_PARAM_TYPE_RESPONSE", {
        key,
        type: correctType,
      }),
      data,
      error: true,
      status,
      success: false,
      notFound: false,
    };
    return res.status(status).json(prepareResponse);
  },
  NotFoundRequestParam: async (
    req: Request,
    res: Response,
    data: object,
    key: string,
  ) => {
    const status: number = 400;
    const prepareResponse: TResponse = {
      message: req.t("NOT_FOUND_REQUEST_PARAM_TYPE_RESPONSE", { key }),
      data,
      error: true,
      status,
      success: false,
      notFound: false,
    };
    return res.status(status).json(prepareResponse);
  },
  // zod validator error
  requestDataValidatorError: async (
    req: Request,
    res: Response,
    data: object,
    message?: string,
  ) => {
    const status: number = 400;
    const prepareResponse: TResponse = {
      message: message || req.t("INVALID_REQUEST_DATA_RESPONSE"),
      data,
      error: true,
      status,
      success: false,
      notFound: false,
    };
    return res.status(status).json(prepareResponse);
  },
};

export default responses;
