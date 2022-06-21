import createHttpError from "http-errors";

export const organizerOnlyMiddleware = async (req, res, next) => {
  try {
    console.log({ ruser: req.user });
    if (req.user._id === organizer) {
      next();
    } else {
      next(createHttpError(403, "Only Organizer is allowed!"));
    }
  } catch (error) {
    next(createHttpError(403, "Only Organizer is allowed!"));
  }
};

