import { Router } from "express";
const router = Router();
import { publishScheduledPosts } from "../cron/publishScheduledPosts";

router.post("", publishScheduledPosts);

module.exports = router;
