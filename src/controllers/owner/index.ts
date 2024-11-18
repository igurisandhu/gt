import jwt from "jsonwebtoken";
import OwnerModel from "../../databases/mongo/models/owner";
import {
  IOwnerProfileWithAuth,
  IOwnerSignupRequest,
  IOwnerProfileWithOptionalPassword,
} from "../../types/controllers/owner";
import responses from "../../utilities/responses";
import { Request, Response } from "express";
import { sendMail } from "../../utilities/mail";
import {
  deleteRedisData,
  getRedisData,
  setRedisDataWithExpiry,
} from "../../databases/redis";
import { sendPhoneOTPUtility } from "../../utilities/sms";

const OwnerAuthSecert = process.env.OWNER_AUTH_SECERT || "GOD-IS-ALl";

const signup = async (req: Request, res: Response) => {
  try {
    const body: IOwnerSignupRequest = req.body;

    body.email = body.email.toLowerCase();

    //check if owner already registered
    const check = await OwnerModel.findOne({ email: body.email });

    if (check) {
      return responses.alreadyExists(req, res, {}, "Owner account");
    }

    const newOwner = new OwnerModel({ ...body });

    const newSavedOwner = await newOwner.save();

    const owner: IOwnerProfileWithOptionalPassword = newSavedOwner.toObject();
    // await OwnerModel.findById(newSavedOwner._id).select(['-password']).lean()
    delete owner.password;

    if (!owner) {
      return responses.serverError(req, res, {});
    }

    const Authorization = await jwt.sign({ _id: owner._id }, OwnerAuthSecert);

    const ownerProfileWithAuth: IOwnerProfileWithAuth = {
      ...owner,
      Authorization,
    };

    return responses.success(req, res, ownerProfileWithAuth);
  } catch (error) {
    return responses.serverError(req, res, {});
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const { email, password }: { email: string; password: string } = req.body;

    const owner = await OwnerModel.findOne({ email: email });

    if (!owner || owner.isDeleted == true) {
      return responses.notFound(req, res, {}, "Owner Account");
    }

    if (owner.isActive == false) {
      return responses.notActive(req, res, {}, "Owner Account");
    }

    const isPasswordValid: boolean = await owner.validatePassword(password);

    if (!isPasswordValid) {
      return responses.authFail(req, res, {});
    }

    const Authorization = jwt.sign({ _id: owner._id }, OwnerAuthSecert);

    const ownerProfile: IOwnerProfileWithOptionalPassword = owner.toObject();

    delete ownerProfile.password;

    const ownerProfileWithAuth: IOwnerProfileWithAuth = {
      ...ownerProfile,
      Authorization,
    };

    return responses.success(req, res, ownerProfileWithAuth);
  } catch (error) {
    return responses.serverError(req, res, {});
  }
};

const updateProfile = async (req: Request, res: Response) => {
  try {
    const ownerId = req.params.id;
    const updateData: Partial<IOwnerProfileWithOptionalPassword> = req.body;

    // Remove sensitive fields that shouldn't be updated directly
    delete updateData.password;
    delete updateData.isActive;
    delete updateData.isDeleted;

    const updatedOwner = await OwnerModel.findByIdAndUpdate(
      ownerId,
      { $set: updateData },
      { new: true, runValidators: true },
    );

    if (!updatedOwner) {
      return responses.notFound(req, res, {}, "Owner not found");
    }

    const ownerProfile: IOwnerProfileWithAuth = updatedOwner.toObject();
    // delete ownerProfile.password;

    return responses.success(req, res, { owner: ownerProfile });
  } catch (error) {
    console.error("Error updating owner profile:", error);
    return responses.serverError(req, res, {});
  }
};

const changePassword = async (req: Request, res: Response) => {
  try {
    const { oldPassword, newPassword } = req.body;

    let owner = req.owner;

    owner = await OwnerModel.findById(owner._id);

    if (!owner) {
      return responses.notFound(req, res, {}, "Owner not found");
    }

    const isPasswordValid: boolean = await owner.validatePassword(oldPassword);

    if (!isPasswordValid) {
      return responses.authFail(req, res, {});
    }

    owner.password = newPassword;
    await owner.save();

    return responses.success(req, res, {});
  } catch (error) {
    console.error("Error changing owner password:", error);
    return responses.serverError(req, res, {});
  }
};

const getProfile = async (req: Request, res: Response) => {
  try {
    const owner = req.owner;

    if (!owner) {
      return responses.notFound(req, res, {}, "Owner not found");
    }

    const ownerProfile: IOwnerProfileWithAuth = owner.toObject();
    // delete ownerProfile.password;

    return responses.success(req, res, { owner: ownerProfile });
  } catch (error) {
    console.error("Error fetching owner profile:", error);
    return responses.serverError(req, res, {});
  }
};

const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const owner = await OwnerModel.findOne({ email });

    if (!owner) {
      return responses.notFound(req, res, {}, "Owner not found");
    }

    // Generate a token for password reset
    const resetToken = await jwt.sign(
      { _id: owner._id, password: owner.password },
      OwnerAuthSecert,
      {
        expiresIn: "1h",
      },
    );

    // Send email with reset link
    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    await sendMail(
      email,
      "Password Reset",
      `Click here to reset your password: ${resetLink}`,
    );

    return responses.success(req, res, {});
  } catch (error) {
    console.error("Error forgot password:", error);
    return responses.serverError(req, res, {});
  }
};

const verifyToken = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    const decoded = jwt.verify(token, OwnerAuthSecert);

    if (!decoded) {
      return responses.authFail(req, res, {});
    }

    return responses.success(req, res, {});
  } catch (error) {
    console.error("Error verifying token:", error);
    return responses.serverError(req, res, {});
  }
};

const changeForgotPassword = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    const { newPassword } = req.body;

    const decoded: any = jwt.verify(token, OwnerAuthSecert);

    if (!decoded) {
      return responses.authFail(req, res, {});
    }

    const owner = await OwnerModel.findOne({
      _id: decoded._id,
      password: decoded.password,
    });

    if (!owner) {
      return responses.notFound(req, res, {}, "Owner not found");
    }

    owner.password = newPassword;
    await owner.save();

    return responses.success(req, res, {});
  } catch (error) {
    console.error("Error changing forgot password:", error);
    return responses.serverError(req, res, {});
  }
};

const sendPhoneOTP = async (req: Request, res: Response) => {
  try {
    const { phone } = req.body;

    const owner = await OwnerModel.findOne({ phone });

    if (!owner) {
      return responses.notFound(req, res, {}, "Owner not found");
    }

    if (owner.isActive == false) {
      return responses.notActive(req, res, {}, "Owner Account)");
    }

    // Generate a 4 digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000);

    // Save the OTP in redis with a 5 minute expiry
    await setRedisDataWithExpiry(phone, otp.toString(), 60 * 5);

    // Send the OTP to the user's phone
    await sendPhoneOTPUtility(phone);

    return responses.success(req, res, { otp });
  } catch (error) {
    console.error("Error sending phone OTP:", error);
    return responses.serverError(req, res, {});
  }
};

const loginWithPhoneOTP = async (req: Request, res: Response) => {
  try {
    const { phone, otp }: { phone: string; otp: number } = req.body;

    const owner = await OwnerModel.findOne({ phone });

    if (!owner) {
      return responses.notFound(req, res, {}, "Owner not found");
    }

    if (owner.isActive == false) {
      return responses.notActive(req, res, {}, "Owner Account");
    }

    if (owner.isDeleted == true) {
      return responses.notFound(req, res, {}, "Owner Account");
    }

    let attempts = await getRedisData(phone + "_attempts");

    if (!attempts) {
      attempts = "0";
    }

    // Get the OTP from redis

    const savedOTP = await getRedisData(phone);

    if (Number(savedOTP) !== otp) {
      if (Number(attempts) >= 3) {
        await OwnerModel.findByIdAndUpdate(
          owner._id,
          { isActive: false },
          { new: true },
        );

        await deleteRedisData(phone);
        await deleteRedisData(phone + "_fail");

        return responses.authFail(req, res, {});
      }
      return responses.authFail(req, res, {});
    }

    await deleteRedisData(phone);
    await deleteRedisData(phone + "_fail");

    // Generate a JWT token

    const Authorization = jwt.sign({ _id: owner._id }, OwnerAuthSecert);

    const ownerProfile: IOwnerProfileWithOptionalPassword = owner.toObject();

    delete ownerProfile.password;

    const ownerProfileWithAuth: IOwnerProfileWithAuth = {
      ...ownerProfile,
      Authorization,
    };

    return responses.success(req, res, ownerProfileWithAuth);
  } catch (error) {
    console.error("Error logging in with phone OTP:", error);

    return responses.serverError(req, res, {});
  }
};

const ownerController = {
  signup,
  login,
  updateProfile,
  changePassword,
  getProfile,
  forgotPassword,
  verifyToken,
  changeForgotPassword,
  sendPhoneOTP,
  loginWithPhoneOTP,
};

export default ownerController;
