require("dotenv").config();
const { dbConnect } = require("./config/db");
const express = require("express");
const cookieParser = require("cookie-parser");
const expressFileUploader = require("express-fileupload");
const cors = require("cors");
const cron = require("node-cron");
const otpModel = require("./model/otpModel.js");
const { initSocket } = require("./socket.js");
const { cdnConnect } = require("./config/cdn.js");

const signIn = require("./routes/signUp.js");
const logIn = require("./routes/logIn.js");
const townTreeFetch = require("./routes/townTreeFetch");
const otpHandler = require("./routes/sendOtp.js");
const complainant = require("./routes/complaints.js");
const genAi = require("./routes/genAi.js");

const os = require("os");
const app = express();

const path = require("path");
const fs = require("fs");

const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use("/uploads", express.static(uploadsDir));

app.use(express.json());
app.use(cookieParser());
app.use(
  expressFileUploader({
    useTempFiles: true,
    tempFileDir: os.tmpdir(),
  })
);
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);

cron.schedule("0 0 * * *", async () => {
  try {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    await otpModel.deleteMany({ createdAt: { $lt: twentyFourHoursAgo } });
    console.log("Old OTP data deleted");
  } catch (cronErr) {
    console.error("Cron job error:", cronErr);
  }
});

app.use("/api/v1", signIn);
app.use("/api/v1", logIn);
app.use("/api/v1", townTreeFetch);
app.use("/api/v1", otpHandler);
app.use("/api/v1/complaints", complainant);
app.use("/api/v1", genAi);

dbConnect();
cdnConnect();

const { server, io } = initSocket(app);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server listening on PORT ${PORT}`));

module.exports = app;
module.exports.io = io;
