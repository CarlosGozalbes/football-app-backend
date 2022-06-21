import express from "express";
import createHttpError from "http-errors";
import User from "./schema";
import { authenticateUser } from "../auth/GenerateToken";
import { authMiddleware } from "../auth/AuthMiddleware";
import MatchModel from "../matches/schema.js";
import passport from "passport";
import { cloudinary, parser } from "./../utils/Cloudinary";


const usersRouter = express.Router();

usersRouter.get(
  "/",
  async (req, res, next) => {
    try {
      const users = await User.find();
      res.send(users);
    } catch (error) {
      next(error);
    }
  }
);
usersRouter.get('/search',  async (req, res, next) => {
  try {
    const username = req.query.username
      const users = await User.find({ username: username})
      res.send(users)
  } catch (error) {
      next(error)
  }
})
usersRouter.get(
  "/id",
  async (req, res, next) => {
    try {
      const users = await User.findById(req.params.id);
      res.send(users);
    } catch (error) {
      next(error);
    }
  });
  

usersRouter.post(
  "/register",
  async (req, res, next) => {
    try {
      const newUser = new User(req.body);
      const { _id } = await newUser.save();
      res.send({ _id });
    } catch (error) {
      next(error);
    }
  }
);

usersRouter.post(
  "/login",
  async (req, res, next) => {
    try {
      // 1. Get credentials from req.body
      const { email, password } = req.body;

      // 2. Verify credentials
      const user = await User.checkCredentials(email, password);

      if (user) {
        // 3. If credentials are fine we are going to generate an access token
        const accessToken = await authenticateUser(user);
        res.send({accessToken});
      } else {
        // 4. If they are not --> error (401)
        next(createHttpError(401, "Credentials not ok!"));
      }
    } catch (error) {
      next(error);
    }
  }
);
usersRouter.get("/me", authMiddleware, async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) return res.send({ message: "No Token Provided!" });
    const user = await User.findById(req.user);
    if (user) {
      res.status(200).send(user);
    } else {
      next(createHttpError(404, "user not found!"));
    }
  } catch (error) {
    next(error)
  }
});

usersRouter.post("/me/avatar",authMiddleware,  parser.single('userAvatar'),  async (req, res, next) => {
  try {
  res.json(req.file)
  
  } catch (error) {
    next(error)
  }
});

usersRouter.put(
  "/me",
  authMiddleware,
  async (req, res, next) => {
    try {
      const request = req ;
      const user = await User.findByIdAndUpdate(request.user._id, req.body, {
        new: true,
      });
      if (user) {
        res.send(user);
      }
    } catch (error) {
      next(error);
    }
  }
);

usersRouter.get(
  "/googleLogin",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

usersRouter.get(
  "/googleRedirect",
  passport.authenticate("google"),
  async (req, res, next) => {
    try {
      const request = req ;
      console.log("TOKENS: ", request.user.token);

      res.redirect(
        `${process.env.FE_URL}?accessToken=${request.user.token}`
      );
    } catch (error) {
      next(error);
    }
  }
);
usersRouter.get("/me/matchesOrganized", authMiddleware, async (req, res, next) => {
  try {
    const matches = await MatchModel.find().populate("organizer");
    const users = matches.filter((match) => match.organizer === req.user._id);
    res.send(users);
  } catch (error) {
    console.log(error);
    next(error);
  }
});



export default usersRouter;