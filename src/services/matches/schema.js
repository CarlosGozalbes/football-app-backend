import mongoose from "mongoose";

const { Schema, model } = mongoose;

const commentSchemma = mongoose.Schema({
  text: { type: String, minLength: 10, required: true },
  
  user: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

const matchSchema = new Schema(
  {
    organizer: [{ type: Schema.Types.ObjectId, ref: "User" }],
    pitchName: { type: String, required: true },
    sport: { type: String, required: true },

    location: {
      lng: { type: Number, required: true },
      lat: { type: Number, required: true },
    },
    date: { type: Date, required: true },
    startTime: {
      hour: { type: Number, required: true, min: 00, max: 23 },
      minutes: { type: Number, required: true, min: 00, max: 59 },
    },

    pricePerPerson: { type: Number, required: true },
    team1: [[{ type: Schema.Types.ObjectId, ref: "User" }]],
    team2: [[{ type: Schema.Types.ObjectId, ref: "User" }]],

    description: { type: String, minLength: 20 },
  },
  {
    timestamps: true, // adds and manages automatically createdAt and updatedAt fields
  }
);

export default model("Match", matchSchema);
