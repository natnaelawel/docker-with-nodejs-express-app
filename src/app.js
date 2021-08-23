const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");

const {
  MONGO_USER,
  MONGO_PASSWORD,
  MONGO_IP,
  MONGO_PORT,
  REDIS_IP,
  REDIS_PORT,
  SESSION_SECRET,
} = require("./config/config");

const redis = require("redis");
const session = require("express-session");
let RedisStore = require("connect-redis")(session);

const blogRouter = require("./routes/blogs");
const authRouter = require("./routes/auth");

let redisClient = redis.createClient({
  host: REDIS_IP,
  port: REDIS_PORT,
});

// redis
app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: SESSION_SECRET,
    // saveUninitialized: false,
    // resave: false,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 60000,
      saveUninitialized: false,
      resave: false,
    }, // 30 sec
  })
);
app.use(cors());
app.use(express.json());

app.use("/api/v1/blogs", blogRouter);
app.use("/api/v1/auth", authRouter);

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

connectMongoWithRetry();
