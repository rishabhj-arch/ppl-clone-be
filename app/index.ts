import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";

const app = express();
const morgan = require("morgan");

const authRoutes = require("./routes/user");
const postRoutes = require("./routes/post");
const cotactRoutes = require("./routes/contact");
const cronRoutes = require("./routes/cron");
const mediaRoutes = require("./routes/media");

dotenv.config();
require("./db/config/config").connect();

app.use(morgan("dev"));
app.set("view engine", "ejs");
app.set("trust proxy", true);
app.use(express.json());
app.use(bodyParser.json({ limit: "20mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "20mb" }));
app.use(cors());

app.use(express.static(path.join(__dirname, "public")));
// Routes
app.get("/", (req, res) => {
  res.send("GCP APP engine");
});

app.use("/auth", authRoutes);
app.use("/post", postRoutes);
app.use("/contact", cotactRoutes);
app.use("/media", mediaRoutes);
app.use("/trigger-cron", cronRoutes);
// Start the server
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  // setAndLockRetentionPolicy()
});
