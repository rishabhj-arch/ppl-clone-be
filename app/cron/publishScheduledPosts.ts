import Post from "../db/models/post";
import { DateTime } from "luxon";
import { PostStatus } from "../types/postTypes";

export const publishScheduledPosts = async (req, res) => {
  try {
    const nowISO = DateTime.now().setZone("Australia/Sydney").toISO();
    const postsToPublish = await Post.find({
      status: PostStatus.SCHEDULED,
      date: { $lte: nowISO },
    });

    if (postsToPublish.length > 0) {
      for (const post of postsToPublish) {
        post.status = PostStatus.PUBLISHED;
        await post.save();
        console.log(`Post titled "${post._id}" has been published.`);
      }
    }
    res.send("Posts published successfully.");
  } catch (error) {
    console.error("Error publishing scheduled posts:", error);
    res.status(500).send("Error publishing scheduled posts.");
  }
};
