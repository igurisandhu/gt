import responses from "../../utilities/responses";
import { Request, Response } from "express";

const getOwner = async (req: Request, res: Response) => {
  try {
    console.log(req.params);
    return responses.success(req, res, { _id: "12213" });
  } catch (error) {
    return responses.serverError(req, res, {});
  }
};

const register = async (req: Request, res: Response) => {
  try {
    return responses.success(req, res, { _id: req.body }, "Signup Successfull");
  } catch (error) {
    console.error(error);
    return responses.serverError(req, res, {});
  }
};

const ownerController = {
  getOwner,
  register,
};

export default ownerController;
