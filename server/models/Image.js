import mongoose from "mongoose";

const { Schema } = mongoose;

const imageSchema = Schema({
  name: String,
  img: {
    data: Buffer,
    contentType: String,
  },
});

const ImageModel = mongoose.model("Image", imageSchema);

export default ImageModel;
