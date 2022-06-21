import express from "express";
import createHttpError from "http-errors";
import matchesModel from "./schema.js"



const matchesRouter = express.Router();

matchesRouter.post(
  "/",
  authMiddlaware,
  async (req, res, next) => {
    try {
      const newMatch = new matchesModel({
        ...req.body,
        organizer: [req.user._id],
      });
      const { _id } = await newMatch.save();
      res.status(201).send({ _id });
    } catch (error) {
      next(error);
    }
  }
);

matchesRouter.get("/", async (req, res, next) => {
  try {
    const matches = await matchesModel.find();
    if (matches) {
        res.send(matches)
    } else {
        console.log(error)
    }
  } catch (error) {
    next(error);
  }
});
//  const mongoQuery = q2m(req.query);
//  const total = await accommodationsModel.countDocuments(mongoQuery.criteria);
//  const accommodations = await accommodationsModel
//    .find(mongoQuery.criteria)
//    .limit(mongoQuery.options.limit)
//    .skip(mongoQuery.options.skip)
//    .sort(mongoQuery.options.sort);
//  res.send({
//    links: mongoQuery.links("/accommodations", total),
//    total,
//    totalPages: Math.ceil(total / mongoQuery.options.limit),
//    accommodations,
//  });

matchesRouter.get("/:matchId", async (req, res, next) => {
  try {
    const matchId = req.params.matchId;

    const match = await matchesModel.findById(matchId);
    if (match) {
      res.send(match);
    } else {
      next(createHttpError(404, `accommodation with id ${matchId} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

matchesRouter.put("/:matchId", authMiddleware, async(req, res, next) => {
    try{
        const matchId = req.params.matchId;
        const updatedMatch = await matchesModel.findOne({
          _id: matchId,
          organizer: { $in: [req.user._id] },
        });
        if (updatedMatch) {
          await updatedMatch.update(req.body);
          res.send(204).send();
        } else {
          next(
            createHttpError(404, `match with id ${matchId} not found!`)
          );
        }
    } catch (error) {
        next(error)
    }
});


export default matchesRouter;
