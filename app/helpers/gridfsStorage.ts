import mongoose from "mongoose";

const BUCKET_NAME = "media";

const getBucket = (): mongoose.mongo.GridFSBucket => {
  const database = mongoose.connection.db;

  if (!database) {
    throw new Error("MongoDB connection is not ready.");
  }

  return new mongoose.mongo.GridFSBucket(database, {
    bucketName: BUCKET_NAME,
  });
};

export const uploadFileToGridFS = async (
  fileBuffer: Buffer,
  fileName: string,
  mimeType: string
): Promise<mongoose.Types.ObjectId> => {
  const bucket = getBucket();

  return new Promise((resolve, reject) => {
    const uploadStream = bucket.openUploadStream(fileName, {
      contentType: mimeType,
      metadata: {
        originalName: fileName,
        contentType: mimeType,
      },
    });

    uploadStream.once("error", reject);
    uploadStream.once("finish", () => resolve(uploadStream.id));
    uploadStream.end(fileBuffer);
  });
};

export const deleteFileFromGridFS = async (
  fileId: mongoose.Types.ObjectId | string
): Promise<void> => {
  const bucket = getBucket();
  const objectId = new mongoose.mongo.ObjectId(fileId.toString());
  await bucket.delete(objectId);
};

export const getFileFromGridFS = async (
  fileId: string
): Promise<mongoose.mongo.GridFSFile | null> => {
  const bucket = getBucket();
  const objectId = new mongoose.mongo.ObjectId(fileId);
  return bucket.find({ _id: objectId }).next();
};

export const openGridFSDownloadStream = (fileId: string) => {
  const bucket = getBucket();
  return bucket.openDownloadStream(new mongoose.mongo.ObjectId(fileId));
};
