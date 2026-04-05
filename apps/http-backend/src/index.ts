import express from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { middleware } from "./middlewares";
import {
  createRoomSchema,
  createUserSchema,
  signinSchema,
} from "@repo/common/types";
import { prismaClient } from "@repo/db/client";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

app.post("/signup", async (req, res) => {
  const parsedData = createUserSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.json({ message: "Incorrect inputs" });
    return;
  }
  try {
    const user = await prismaClient.user.create({
      data: {
        email: parsedData.data.username,
        password: parsedData.data.password,
        name: parsedData.data.name,
      },
    });
    res.json({ userId: user.id });
  } catch (e) {
    res.status(411).json({
      message: "User already exists with this username",
    });
  }
});

app.post("/signin", async (req, res) => {
  const parsedData = signinSchema.safeParse(req.body);

  if (!parsedData.success) {
    res.json({ message: "Incorrect inputs" });
    return;
  }

  const user = await prismaClient.user.findFirst({
    where: {
      email: parsedData.data.username,
      password: parsedData.data.password,
    },
  });

  if (!user) {
    res.status(403).json({ message: "Not authorized!!" });
    return;
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET);
  res.json({ token });
});

app.post("/room", middleware, async (req, res) => {
  const parsedData = createRoomSchema.safeParse(req.body);

  if (!parsedData.success) {
    res.json({ message: "Incorrect inputs" });
    return;
  }

  const room = await prismaClient.room.findFirst({
    where: {
      slug: parsedData.data.name,
    },
  });

  if (room) {
    res.status(411).json({ message: "Room already exists with this name" });
    return;
  }

  // @ts-ignore
  const userId = req.userId;

  try {
    const roomData = await prismaClient.room.create({
      data: {
        slug: parsedData.data.name,
        adminId: userId,
      },
    });
    res.json({ roomId: roomData.id });
  } catch (e) {
    res.status(411).json({ message: "Error !!" });
  }
});

app.get("/chats/:roomId", async (req, res) => {
  const roomId = Number(req.params.roomId);
  const messages = await prismaClient.chat.findMany({
    where: {
      roomId,
    },
    orderBy: { id: "desc" },
    take: 50,
  });

  res.status(200).json({ messages });
});

app.listen(3001, "0.0.0.0", () => {
  console.log("App is listening at port: 3001");
});
