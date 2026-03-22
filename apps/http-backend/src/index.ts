import express from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { middleware } from "./middlewares";
import {
  createRoomSchema,
  CreateUserSchema,
  SigninSchema,
} from "@repo/common/types";

const app = express();

app.get("/", (req, res) => {
  return res.send({ success: true, message: "Success !!" });
});

app.post("/signin", middleware, (req, res) => {
  const data = SigninSchema.safeParse(req.body);

  if (!data.success) {
    res.json({ message: "Incorrect inputs" });
    return;
  }

  const userId = 1;
  const token = jwt.sign({ userId }, JWT_SECRET);
  res.json({ token });
});

app.post("/signup", (req, res) => {
  const data = CreateUserSchema.safeParse(req.body);

  if (!data.success) {
    res.json({ message: "Incorrect inputs" });
    return;
  }
  res.json({ userId: "123" });
});

app.post("/room", middleware, (req, res) => {
  const data = createRoomSchema.safeParse(req.body);

  if (!data.success) {
    res.json({ message: "Incorrect inputs" });
    return;
  }
  res.json({ roomId: 123 });
});

app.listen(3001, () => {
  console.log("App is listening at port: 3001");
});
