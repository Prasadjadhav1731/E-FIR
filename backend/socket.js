const { Server } = require("socket.io");
const { createServer } = require("http");
const connectedUser = require("./model/connectedUser.js");

let io = null;

exports.initSocket = (app) => {
  try {
    const server = createServer(app);
    io = new Server(server, {
      cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        credentials: true,
      },
    });

    io.on("connection", (socket) => {
      socket.on("login", async (data) => {
        try {
          if (!data) return;
          const { userId } = data;
          const socketId = socket.id;

          if (!userId) return;

          let user = await connectedUser.findOne({ userId });

          if (!user) {
            user = new connectedUser({
              userId,
              socketIds: [socketId],
            });
          } else {
            if (!user.socketIds.includes(socketId)) {
              user.socketIds.push(socketId);
            }
          }

          await user.save();
          io.to(socketId).emit("message", "Welcome Back!");
        } catch (err) {
          console.error("Error in socket login event:", err);
        }
      });

      socket.on("disconnect", async () => {
        try {
          const user = await connectedUser.findOne({
            socketIds: { $in: [socket.id] },
          });

          if (user) {
            user.socketIds = user.socketIds.filter((id) => id !== socket.id);

            if (user.socketIds.length === 0) {
              await connectedUser.deleteOne({ _id: user._id });
            } else {
              await user.save();
            }
          }
        } catch (err) {
          console.error("Error handling socket disconnect:", err);
        }
      });
    });

    return { io, server };
  } catch (error) {
    console.error("Error initializing socket:", error);
    throw error;
  }
};

exports.getIO = () => io;
