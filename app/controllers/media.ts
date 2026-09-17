import { Request, Response } from "express";
import mongoose from "mongoose";
import {
  getFileFromGridFS,
  openGridFSDownloadStream,
} from "../helpers/gridfsStorage";

export const getMedia = async (req: Request, res: Response): Promise<void> => {
  const { fileId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(fileId)) {
    res.status(400).json({ success: false, message: "Invalid media id." });
    return;
  }

  try {
    const file = await getFileFromGridFS(fileId);

    if (!file) {
      res.status(404).json({ success: false, message: "Media not found." });
      return;
    }

    res.setHeader("Content-Type", file.contentType || "application/octet-stream");
    res.setHeader("Content-Length", file.length);
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");

    const downloadStream = openGridFSDownloadStream(fileId);
    downloadStream.on("error", () => {
      if (!res.headersSent) {
        res.status(404).json({ success: false, message: "Media not found." });
      } else {
        res.end();
      }
    });
    downloadStream.pipe(res);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to load media.",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
