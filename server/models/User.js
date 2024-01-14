import mongoose, { Schema } from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      require: true,
      min: 2,
      max: 50,
    },
    lastName: {
      type: String,
      require: true,
      min: 2,
      max: 50,
    },
    email: {
      type: String,
      require: true,
      max: 50,
      unique: true,
    },
    password: {
      type: String,
      require: true,
      min: 5,
    },
    picturePath: {
      type: String,
      default: "",
    },
    friends: {
      type: Array,
      default: [],
    },
    location: { type: String },
    occupation: { type: String },
    viewedProfile: {
      type: [Schema.Types.ObjectId],
      default: [],
    },
    impressions: { type: Number },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
export default User;
