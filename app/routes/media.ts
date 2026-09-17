import { Router } from "express";
import { getMedia } from "../controllers/media";

const router = Router();

router.get("/:fileId", getMedia);

module.exports = router;
