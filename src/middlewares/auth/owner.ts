import { Request, Response, NextFunction } from "express";
import responses from "../../utilities/responses";
// import jwt from 'jsonwebtoken';

const ownerAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    next();
  } catch (error) {
    responses.authFail(req, res, {});
  }
};

export default ownerAuth;
