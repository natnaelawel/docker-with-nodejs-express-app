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

const blogRouter = require("./routes/blogs")

app.use(cors());
app.use(express.json())

app.use("/api/blogs", blogRouter)

app.use("/", (req, res) => {
  res.send("<h1 >Docker tutorialllllll!!!!!!!! <h1>");
});

const PORT = process.env.PORT || "3000";
const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`;

// this will retry until successfull mongo db connection
const connectMongoWithRetry = () => {
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
      setTimeout(connectMongoWithRetry, 5000);
    });
};

connectMongoWithRetry()