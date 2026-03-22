import express from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./config";
import { middleware } from "./middlewares";

const app = express();

app.get("/", (req, res) => {
  return res.send({ success: true, message: "Success !!" });
});

app.post("/signin", middleware, (req, res) => {
  const userId = 1;
  const token = jwt.sign({ userId }, JWT_SECRET);
  res.json({ token });
});

app.post("/signup", (req, res) => {});

app.post("/room", middleware, (req, res) => {
  res.json({ roomId: 123 });
});

app.listen(3001, () => {
  console.log("App is listening at port: 3001");
});
