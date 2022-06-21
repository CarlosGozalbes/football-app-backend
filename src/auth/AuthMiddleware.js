import createHttpError from "http-errors";
import { verifyJWT } from "./GenerateToken.js";

export const authMiddlaware = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      next(
        createHttpError(
          401,
          "Please provide bearer token in authorization header!"
        )
      );
    } else {
      const token = req.headers.authorization.replace("Bearer ", "");
      const user = await verifyJWT(token);
        if (!user) return next(createHttpError(401, "Invalid Details"));
        req.user = {
          _id: user._id,
        };
        next();
      
    }
  } catch (error) {
    next(createHttpError(401, "User is unauthorized!"));
  }
};
