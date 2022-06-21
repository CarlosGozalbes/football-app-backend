import mongoose from "mongoose"
import bcrypt from "bcrypt"

const { Schema, model } = mongoose

const UserSchema = new Schema(
  {
    name: { type: String },
    userName: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    reputation: { type: Number, min: 0, max: 10 },
    elo: { type: Number, min: 0 },
    skills: {
      PAC: { type: Number, min: 0, max: 100 },
      SHO: { type: Number, min: 0, max: 100 },
      PAS: { type: Number, min: 0, max: 100 },
      DRI: { type: Number, min: 0, max: 100 },
      DEF: { type: Number, min: 0, max: 100 },
      PHY: { type: Number, min: 0, max: 100 },
    },
    matchesPlayed: [{ type: Schema.Types.ObjectId, ref: "Match" }],
    matchesOrganized: [{ type: Schema.Types.ObjectId, ref: "Match" }],
    teams: [{ type: Schema.Types.ObjectId, ref: "Teams" }],
    friends: [[{ type: Schema.Types.ObjectId, ref: "User" }]],
    googleId: { type: String },
  },
  {
    timeStamps: true,
  }
);
UserSchema.pre("save",  function (next) {
  const newUser = this
  const plainpassword = newUser.password

  if (newUser.isModified("password")) {
    const hash = bcrypt.hashSync(plainpassword, 11)
    newUser.password = hash
  }
  next()
})

UserSchema.methods.toJSON = function () {
  // this toJSON function will be called EVERY TIME express does a res.send(user/s)

  const userDocument = this
  const userObject = userDocument.toObject() // we have to convert to naormal  object beacuse userObject is Mongoose doucment(_doc)

  delete userObject.password
  delete userObject.__v

  return userObject
}

UserSchema.statics.checkCredentials = async function (email, plainPW) {
  const user = await this.findOne({ email })

  if (user) {
    const isPasswordMathed = await bcrypt.compare(plainPW, user.password)

    if (isPasswordMathed) {
      return user
    } else {
      return null
    }
  } else {
    return null
  }
}

export default model("User", UserSchema)

// Every User registers with email, password and a role, which could be either host or guest.



// import mongoose from 'mongoose'
// import bcrypt from "bcrypt"
// import { Model } from 'mongoose';
// import {Document} from 'mongoose'
// import { IUser } from '../../types';



// interface UserModel extends Model<IUser> {
//   checkCredentials(email:string, password:string):Promise<IUser |null>;
// }
// const { Schema, model } = mongoose

// export const UserSchema = new Schema<IUser, UserModel>({
//   username: { type: String, required: true},
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   avatar: {type: String }
// })

// UserSchema.pre("save", async function (next) {
  
//   const newUser = this 
//   const plainPw = newUser.password
//   if (newUser.isModified("password")) {
//     const hash = await bcrypt.hash(plainPw, 10)
//     newUser.password = hash
//   }
//   next()
// })

// UserSchema.methods.toJSON = function () {
//   const userDocument = this
//   const userObject = userDocument.toObject()
//   delete userObject.password
//   delete userObject.__v

//   return userObject
// }


// UserSchema.statics.checkCredentials = async function (email:string, plainPw:string):Promise<any> {
//   const user = await this.findOne({ email }) 

//   if (user) {
//     const isMatch = await bcrypt.compare(plainPw, user.password)
//     if (isMatch) {
//       return user
//     } else {
//       return null
//     }
//   } else {
//     return null 
//   }
// }
// const User = model<IUser, UserModel>('User', UserSchema);

// export default User
