import mongoose from "mongoose";

const { Schema } = mongoose;

const postSchema = Schema(
  {
    userId: {
      type: String,
      require: true,
    },
    firstName: {
      type: String,
      require: true,
    },
    lastName: {
      type: String,
      require: true,
    },
    location: {
      type: String,
    },
    description: {
      type: String,
    },
    picturePath: {
      type: String,
    },
    userPicturePath: {
      type: String,
    },
    likes: {
      type: Map,
      of: Boolean,
    },
    comments: {
      type: Array,
      default: [],
    },
  },
  { timeStamps: true }
);

const Post = mongoose.model("Post", postSchema);

export default Post;
