const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const {
  MONGO_USER,
  MONGO_PASSWORD,
  MONGO_IP,
  MONGO_PORT,
} = require("./config/config");

app.use("/", (req, res) => {
  res.send("<h1 >Docker tutorial <h1>");
});
app.use(cors());
const PORT = process.env.PORT || "3000";

const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`;
mongoose
  .connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then((res) => {
    console.log("Database connection is successfull");
    app.listen(PORT, () =>
      console.log(`Server is listening in on port ${PORT} `)
    );
  })
  .catch((error) => {
    console.log("There is an error when connecting to database");
  });
