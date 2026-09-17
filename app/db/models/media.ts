import mongoose, { Schema, Document } from "mongoose";

interface IMedia extends Document {
  post: mongoose.Types.ObjectId;
  imageName: string;
  imageId?: mongoose.Types.ObjectId;
  type: string;
  createdAt: Date;
  updatedAt: Date;
}

const MediaSchema: Schema = new Schema<IMedia>(
  {
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    imageName: {
      type: String,
      required: false,
    },
    imageId: {
      type: Schema.Types.ObjectId,
      required: false,
    },
    type: {
      type: String,
      enum: ["image/jpeg", "image/png", "image/jpg", "video/mp4"],
      required: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { toJSON: { versionKey: false } }
);

const Media = mongoose.model<IMedia>("Media", MediaSchema);
export default Media;
