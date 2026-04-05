import { WebSocketServer, WebSocket } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { prismaClient } from "@repo/db/client";

const wss = new WebSocketServer({ host: "0.0.0.0", port: 8081 });

interface User {
  ws: WebSocket;
  userId: string;
  rooms: string[];
}
const users: User[] = [];

function checkUser(token: string): string | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (typeof decoded === "string") return null;
    if (!decoded || !decoded.userId) return null;

    return decoded.userId;
  } catch (e) {
    return null;
  }
}

wss.on("connection", function (ws, request) {
  const url = request.url;
  if (!url) return;

  const queryParams = new URLSearchParams(url.split("?")[1]);
  const token = queryParams.get("token") ?? "";
  const userId = checkUser(token);

  if (!userId) {
    ws.close();
    return;
  }

  // if user is authenticated, then add this user in the user list
  users.push({ ws, userId, rooms: [] });

  ws.on("message", async function (data) {
    const parsedData = JSON.parse(data as unknown as string);

    // if the type is user wants to join the room
    if (parsedData.type === "join_room") {
      // first check if the user exists in the store
      const findUser = users.find((x) => x.ws === ws);
      if (!findUser) return;
      // if exists, then add the roomId to the rooms array
      findUser.rooms.push(parsedData.roomId);
    }

    // if the type is user wants to leave the room
    if (parsedData.type === "leave_room") {
      const findUser = users.find((x) => x.ws === ws);
      if (!findUser) return;
      findUser.rooms = findUser.rooms.filter((x) => x !== parsedData.room);
    }

    // if the type is chat
    if (parsedData.type === "chat") {
      const roomId = parsedData.roomId;
      const message = parsedData.message;

      // broadcast the message to all the othere people who are part of this room
      users.forEach((x) => {
        if (x.rooms.includes(roomId)) {
          x.ws.send(
            JSON.stringify({
              type: "chat",
              message,
              roomId,
            }),
          );
        }
      });

      // create entry in the db
      await prismaClient.chat.create({
        data: {
          roomId: +roomId,
          message,
          userId,
        },
      });
    }
  });
});
