require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const userRouter = require("./routes/userRoute");
const noteRouter = require("./routes/noteRoute");

app.use(bodyParser.json());
app.use(cors());

app.use("/user", userRouter);
app.use("/note", noteRouter);

app.get("/", (req, res, next) => {
  res.send("Hello World");
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    app.listen(process.env.PORT);
  })
  .catch((err) => {
    console.log(err);
  });
