import express from "express";
const app = express();
import dotenv from "dotenv";
dotenv.config();
import "express-async-errors";

// morgan is useful when developing
import morgan from "morgan";

import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";

// security packages
// secure headers
import helmet from "helmet";
// sanitize input 
import xss from "xss-clean"
// prevents mongoDB operator injection
import mongoSanitize from "express-mongo-sanitize"

// db and authenticateUser
import connectDB from "./db/connect.js";

// routers
import authRouter from "./routes/authRoutes.js";
import jobsRouter from "./routes/jobsRoutes.js";

// middleware
import notFoundMiddleware from "./middleware/not-found.js";
import errorHandlerMiddleware from "./middleware/error-handler.js";
import authenticateUser from "./middleware/auth.js";

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

const __dirname = dirname(fileURLToPath(import.meta.url));

// make json data available to us in the controllers
app.use(express.json());

// add security packages as middleware
app.use(express.json())
app.use(helmet())
app.use(xss())
app.use(mongoSanitize())

// where the static assets are located
app.use(express.static(path.resolve(__dirname, "./client/build")));

// dummy route
// sets up a GET route for the root URL ("/") of your server.
// app.get("/", (req, res) => {
//   res.json({ msg: "Welcome!" });
// });
// app.get("/api/v1", (req, res) => {
//   res.json({ msg: "API" });
// });

app.use("/api/v1/auth", authRouter);
// use authenticateUser to restrict the update action
app.use("/api/v1/jobs", authenticateUser, jobsRouter);

// set up get route
// we want to direct the get route to the index.html since it contains the react router
// we want to point every get route goes into our server to the index.html, from there the React router would do its job
// after trying the above two routes (?)
app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "./client/build", "index.html"))
});

// if none of the routes match "/", goes here
app.use(notFoundMiddleware);
// error handler needs to be the last one
app.use(errorHandlerMiddleware);

// assign a port number for a server to listen on.
// The value of process.env.PORT is obtained from the environment variables.
// If it's not set or available, the code falls back to using port 5000 as the default
const port = process.env.PORT || 5000;

// first arg is the port second arg is the callback function
// starts the server and instructs it to listen on the port specified
// app.listen(port, () => {
//     console.log(`Server is listening on port ${port}...`)
// })

// start a server and connect to a MongoDB database

// async function allows the use of await inside the function
const start = async () => {
  try {
    // By awaiting this operation,
    // the code ensures that the connection is established before proceeding further.
    await connectDB(process.env.MONGO_URL);
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}...`);
    });
  } catch (error) {
    console.log(error);
  }
};

webpackConfig.resolve = {
  fallback: {
    "url": require.resolve("url/")
  }
};

start();
