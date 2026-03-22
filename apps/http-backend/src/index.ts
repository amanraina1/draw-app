import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send(200).json({ success: true, message: "Success !!" });
});

app.listen(3001, () => {
  console.log("App is listening at port: 3000");
});
